/* ==========================================================================
   dialogue.js — Dialogue system for NPC conversations
   Supports: linear, choice, conditional, one-shot dialogue types
   ========================================================================== */

(function () {
  'use strict';

  window.DialogueSystem = {};

  // ========================================================================
  // STATE
  // ========================================================================
  var currentDialogue = null;   // The dialogue data object
  var currentNPC = null;        // The NPC we're talking to
  var lineIndex = 0;            // Current line in linear dialogue
  var seenDialogues = {};       // Track which dialogues have been seen
  var unlockedChoices = {};     // Track unlocked choice IDs per dialogue

  // ========================================================================
  // START DIALOGUE
  // ========================================================================
  DialogueSystem.startDialogue = function (dialogueId, npc) {
    var dialogue = null;

    // dialogueId can be a string reference or inline object
    if (typeof dialogueId === 'string') {
      dialogue = (window.GameData && GameData.dialogue) ? GameData.dialogue[dialogueId] : null;
    } else if (typeof dialogueId === 'object') {
      dialogue = dialogueId;
    }

    if (!dialogue) {
      if (npc) {
        UI.printNarration(npc.name + " has nothing to say.");
      }
      return;
    }

    currentDialogue = dialogue;
    currentNPC = npc;
    lineIndex = 0;

    // Increment NPC talk count
    if (npc && npc.talkCount !== undefined) {
      npc.talkCount++;
    }

    // Set engine mode
    Engine.Game.mode = Engine.GameMode.DIALOGUE;
    Engine.Game.dialogueState = {
      dialogueId: typeof dialogueId === 'string' ? dialogueId : null,
      npc: npc
    };

    // Check if this is a repeat visit
    var dId = typeof dialogueId === 'string' ? dialogueId : null;
    var isRepeat = dId && seenDialogues[dId];

    if (dialogue.type === 'one_shot' && isRepeat) {
      // One-shot dialogues only play once
      UI.printDialogue(dialogue.speaker || (npc ? npc.name : 'NPC'),
        dialogue.repeatLine || "We've already talked about this.");
      endDialogue();
      return;
    }

    if (dialogue.type === 'linear') {
      handleLinearDialogue(dialogue, isRepeat);
    } else if (dialogue.type === 'choice') {
      handleChoiceDialogue(dialogue, dId);
    } else if (dialogue.type === 'conditional') {
      handleConditionalDialogue(dialogue);
    } else {
      // Default to linear
      handleLinearDialogue(dialogue, isRepeat);
    }
  };

  // ========================================================================
  // LINEAR DIALOGUE
  // ========================================================================
  function handleLinearDialogue(dialogue, isRepeat) {
    if (isRepeat && dialogue.repeatLine) {
      var speaker = dialogue.speaker || (currentNPC ? currentNPC.name : 'NPC');
      UI.printDialogue(speaker, dialogue.repeatLine);
      endDialogue();
      return;
    }

    // Play through all lines
    var lines = dialogue.lines || [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      UI.printDialogue(line.speaker || dialogue.speaker || 'NPC', line.text);
    }

    // Mark as seen
    var dId = Engine.Game.dialogueState ? Engine.Game.dialogueState.dialogueId : null;
    if (dId) seenDialogues[dId] = true;

    // Fire completion
    if (dialogue.onComplete) {
      Engine.triggerEvent(dialogue.onComplete, currentNPC);
    }

    // Set flags
    if (dialogue.setsFlag) {
      applyDialogueFlags(dialogue.setsFlag);
    }

    endDialogue();
  }

  // ========================================================================
  // CHOICE DIALOGUE
  // ========================================================================
  function handleChoiceDialogue(dialogue, dialogueId) {
    // Show intro lines
    if (dialogue.intro) {
      for (var i = 0; i < dialogue.intro.length; i++) {
        var line = dialogue.intro[i];
        UI.printDialogue(line.speaker || dialogue.speaker || 'NPC', line.text);
      }
    }

    // Mark as seen
    if (dialogueId) seenDialogues[dialogueId] = true;

    // Show available choices
    showAvailableChoices(dialogue, dialogueId);
  }

  function showAvailableChoices(dialogue, dialogueId) {
    var choices = dialogue.choices || [];
    var availableChoices = [];

    for (var c = 0; c < choices.length; c++) {
      var choice = choices[c];

      // Check if choice is hidden and not yet unlocked
      if (choice.hidden) {
        var choiceId = choice.id || ('choice_' + c);
        var unlockKey = (dialogueId || 'inline') + ':' + choiceId;
        if (!unlockedChoices[unlockKey]) continue;
      }

      // Check conditions
      if (choice.condition && !Engine.checkCondition(choice.condition)) continue;

      // Check if already selected (for one-shot choices)
      if (choice.oneShot && choice._selected) continue;

      // Check if player can afford this choice
      if (choice.requiresMoney && Engine.getPlayerMoney() < choice.requiresMoney) continue;

      availableChoices.push({ index: c, choice: choice });
    }

    if (availableChoices.length === 0) {
      UI.printNarration("There's nothing more to discuss.");
      endDialogue();
      return;
    }

    // Display choices through UI
    var choiceTexts = availableChoices.map(function (ac) { return { text: ac.choice.text }; });

    UI.showChoices(choiceTexts, function (selectedIndex) {
      var selected = availableChoices[selectedIndex];
      if (!selected) return;
      handleChoiceSelected(selected.choice, dialogue, dialogueId);
    });
  }

  function handleChoiceSelected(choice, dialogue, dialogueId) {
    // Echo the player's choice
    UI.printDialogue('Guybrush', choice.text);

    // Show response
    if (choice.response) {
      for (var r = 0; r < choice.response.length; r++) {
        var line = choice.response[r];
        UI.printDialogue(line.speaker || dialogue.speaker || 'NPC', line.text);
      }
    }

    // Mark one-shot choices
    if (choice.oneShot) {
      choice._selected = true;
    }

    // Set flags
    if (choice.setsFlag) {
      applyDialogueFlags(choice.setsFlag);
    }

    // Unlock additional choices
    if (choice.unlocksChoices) {
      for (var u = 0; u < choice.unlocksChoices.length; u++) {
        var unlockId = choice.unlocksChoices[u];
        var unlockKey = (dialogueId || 'inline') + ':' + unlockId;
        unlockedChoices[unlockKey] = true;
      }
    }

    // Apply effects
    if (choice.effects) {
      Engine.applyEffects(choice.effects);
    }

    // Deduct money if required
    if (choice.deductsMoney) {
      Engine.deductPlayerMoney(choice.deductsMoney);
    }

    // Give item if specified
    if (choice.givesItem) {
      Engine.givePlayerItem(choice.givesItem);
    }

    // Fire callback
    if (choice.onSelect) {
      Engine.triggerEvent(choice.onSelect, currentNPC);
    }

    // Start a sub-dialogue if specified
    if (choice.startDialogue) {
      endDialogue(true); // silent end
      DialogueSystem.startDialogue(choice.startDialogue, currentNPC);
      return;
    }

    // Check if this choice exits the dialogue
    if (choice.exits) {
      if (dialogue.onComplete) {
        Engine.triggerEvent(dialogue.onComplete, currentNPC);
      }
      endDialogue();
      return;
    }

    // Show choices again (loop back)
    UI.printBlank();
    showAvailableChoices(dialogue, dialogueId);
  }

  // ========================================================================
  // CONDITIONAL DIALOGUE
  // ========================================================================
  function handleConditionalDialogue(dialogue) {
    var branches = dialogue.branches || [];

    for (var b = 0; b < branches.length; b++) {
      var branch = branches[b];
      if (!branch.condition || Engine.checkCondition(branch.condition)) {
        // This branch matches — run it
        if (branch.lines) {
          for (var l = 0; l < branch.lines.length; l++) {
            var line = branch.lines[l];
            UI.printDialogue(line.speaker || dialogue.speaker || 'NPC', line.text);
          }
        }
        if (branch.setsFlag) applyDialogueFlags(branch.setsFlag);
        if (branch.effects) Engine.applyEffects(branch.effects);
        if (branch.startDialogue) {
          endDialogue(true);
          DialogueSystem.startDialogue(branch.startDialogue, currentNPC);
          return;
        }
        break; // Only first matching branch
      }
    }

    // Default/fallback
    if (dialogue.defaultLine) {
      var speaker = dialogue.speaker || (currentNPC ? currentNPC.name : 'NPC');
      UI.printDialogue(speaker, dialogue.defaultLine);
    }

    var dId = Engine.Game.dialogueState ? Engine.Game.dialogueState.dialogueId : null;
    if (dId) seenDialogues[dId] = true;

    if (dialogue.onComplete) {
      Engine.triggerEvent(dialogue.onComplete, currentNPC);
    }

    endDialogue();
  }

  // ========================================================================
  // HANDLE INPUT (during dialogue mode)
  // ========================================================================
  DialogueSystem.handleInput = function (raw) {
    if (!raw) return;

    // Try handling as a numbered choice
    if (UI.handleChoiceInput(raw)) {
      return;
    }

    // Allow "leave", "exit", "bye", "goodbye" to exit dialogue
    var lowerRaw = raw.trim().toLowerCase();
    if (['leave', 'exit', 'bye', 'goodbye', 'quit', 'back', 'nevermind', 'never mind'].indexOf(lowerRaw) !== -1) {
      UI.printNarration("You end the conversation.");
      endDialogue();
      return;
    }

    // Pressing enter or invalid input
    var num = parseInt(raw, 10);
    if (isNaN(num)) {
      UI.printNarration("Type a number to select an option, or 'bye' to leave.");
    } else {
      UI.printNarration("That's not a valid choice. Try again.");
    }
  };

  // ========================================================================
  // END DIALOGUE
  // ========================================================================
  function endDialogue(silent) {
    currentDialogue = null;
    currentNPC = null;
    lineIndex = 0;

    Engine.Game.mode = Engine.GameMode.IDLE;
    Engine.Game.dialogueState = null;

    if (!silent) {
      UI.setInputPlaceholder('What do you do?');
    }

    Engine.checkTriggers();
  }

  // ========================================================================
  // UTILITY
  // ========================================================================
  function applyDialogueFlags(flags) {
    if (typeof flags === 'string') {
      Engine.setFlag(flags, true);
    } else if (typeof flags === 'object') {
      var keys = Object.keys(flags);
      for (var k = 0; k < keys.length; k++) {
        Engine.setFlag(keys[k], flags[keys[k]]);
      }
    }
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================
  DialogueSystem.isInDialogue = function () {
    return Engine.Game.mode === Engine.GameMode.DIALOGUE;
  };

  DialogueSystem.hasSeenDialogue = function (dialogueId) {
    return !!seenDialogues[dialogueId];
  };

  DialogueSystem.resetDialogue = function (dialogueId) {
    delete seenDialogues[dialogueId];
  };

  DialogueSystem.unlockChoice = function (dialogueId, choiceId) {
    unlockedChoices[dialogueId + ':' + choiceId] = true;
  };

  // For save/load
  DialogueSystem.getState = function () {
    return {
      seenDialogues: JSON.parse(JSON.stringify(seenDialogues)),
      unlockedChoices: JSON.parse(JSON.stringify(unlockedChoices))
    };
  };

  DialogueSystem.restoreState = function (state) {
    if (state.seenDialogues) seenDialogues = state.seenDialogues;
    if (state.unlockedChoices) unlockedChoices = state.unlockedChoices;
  };

})();
