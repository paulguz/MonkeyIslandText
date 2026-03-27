/* ==========================================================================
   combat.js — Insult Sword Fighting System
   The iconic Monkey Island combat: wit over might
   ========================================================================== */

(function () {
  'use strict';

  window.CombatSystem = {};

  // ========================================================================
  // COMBAT STATE
  // ========================================================================
  var fight = null;  // Active fight state

  // ========================================================================
  // START A FIGHT
  // ========================================================================
  CombatSystem.startFight = function (opponentType) {
    var insultData = (window.GameData && GameData.insults) ? GameData.insults : null;
    if (!insultData) {
      UI.printError("No insult data loaded. The pirates must be on vacation.");
      return;
    }

    var isSwordmaster = (opponentType === 'swordmaster');

    // Check prerequisites for swordmaster fight
    if (isSwordmaster) {
      if (Engine.Player.sword_wins < 5) {
        UI.printNarration("The Swordmaster doesn't consider you worthy of a fight. Come back when you've defeated more pirates.");
        return;
      }
    }

    // Check if player has sword training
    if (!Engine.Player.flags.sword_training_done) {
      UI.printNarration("You don't know how to sword fight yet. Maybe you should get some training first.");
      return;
    }

    fight = {
      isSwordmaster: isSwordmaster,
      playerScore: 0,
      opponentScore: 0,
      winTarget: isSwordmaster ? 5 : 3,
      round: 0,
      phase: 'start',  // start, player_insults, player_responds, result, end
      opponentInsults: [],
      opponentComebacks: [],
      currentInsult: null,
      playerIsInsulting: false
    };

    // Select opponent's known insults (random pirates know 3-6)
    if (isSwordmaster) {
      fight.opponentInsults = (insultData.swordmaster || []).slice();
      fight.opponentComebacks = Object.keys(insultData.comebacks || {});
    } else {
      var pirateInsults = (insultData.pirate || []).slice();
      var numInsults = 3 + Math.floor(Math.random() * 4); // 3-6
      shuffleArray(pirateInsults);
      fight.opponentInsults = pirateInsults.slice(0, numInsults);
      // Pirates know some correct comebacks
      var numComebacks = 1 + Math.floor(Math.random() * 3); // 1-3
      var allComebackIds = Object.keys(insultData.comebacks || {});
      shuffleArray(allComebackIds);
      fight.opponentComebacks = allComebackIds.slice(0, numComebacks);
    }

    // Enter combat mode
    Engine.Game.mode = Engine.GameMode.COMBAT;
    Engine.Game.combatState = fight;

    // Combat intro
    UI.printSeparator();
    if (isSwordmaster) {
      UI.printCombat('⚔ INSULT SWORD FIGHTING: The Swordmaster ⚔');
      UI.printCombat('First to 5 wins the duel!');
    } else {
      UI.printCombat('⚔ INSULT SWORD FIGHTING ⚔');
      UI.printCombat('A pirate challenges you to a duel of wits!');
      UI.printCombat('First to 3 wins!');
    }
    UI.printBlank();

    // Start first round
    startRound();
  };

  // ========================================================================
  // ROUND LOGIC
  // ========================================================================
  function startRound() {
    fight.round++;

    UI.printCombat('--- Round ' + fight.round + ' (You: ' + fight.playerScore + ' — Opponent: ' + fight.opponentScore + ') ---');

    // 50% chance: player insults or opponent insults
    fight.playerIsInsulting = Math.random() < 0.5;

    if (fight.playerIsInsulting) {
      promptPlayerInsult();
    } else {
      opponentInsults();
    }
  }

  // ========================================================================
  // PLAYER INSULTS (player chooses an insult, opponent tries to respond)
  // ========================================================================
  function promptPlayerInsult() {
    fight.phase = 'player_insults';

    var knownInsults = Engine.Player.insults_known;
    var insultData = GameData.insults;

    if (knownInsults.length === 0) {
      // Player doesn't know any insults yet — fumble
      UI.printCombat("You try to think of an insult but draw a blank.");
      UI.printCombat("You mumble something about their mother...");
      UI.printCombat("The pirate laughs. Point to opponent!");
      UI.printBlank();
      fight.opponentScore++;
      checkFightEnd();
      return;
    }

    // Build list of insults player can use
    var choices = [];
    for (var i = 0; i < knownInsults.length; i++) {
      var insult = findInsultById(knownInsults[i]);
      if (insult) {
        choices.push({ text: insult.insult, _insultObj: insult });
      }
    }

    if (choices.length === 0) {
      UI.printCombat("You can't think of anything to say. Point to opponent!");
      fight.opponentScore++;
      checkFightEnd();
      return;
    }

    UI.printCombat("Choose your insult:");
    UI.showChoices(choices, function (selectedIndex) {
      var selected = choices[selectedIndex];
      handlePlayerInsultChoice(selected._insultObj);
    });
  }

  function handlePlayerInsultChoice(insult) {
    UI.printDialogue('Guybrush', insult.insult);

    var comebackId = insult.comeback_id;
    var insultData = GameData.insults;

    // Does opponent know the correct comeback?
    var opponentKnowsComeback = fight.opponentComebacks.indexOf(comebackId) !== -1;

    if (opponentKnowsComeback && insultData.comebacks[comebackId]) {
      var comeback = insultData.comebacks[comebackId];
      UI.printDialogue('Pirate', comeback);
      UI.printCombat("Good comeback! Point to opponent.");
      fight.opponentScore++;

      // Player learns the comeback by seeing it used correctly
      learnComeback(comebackId);
    } else {
      // Opponent gives wrong comeback or stumbles
      var wrongComebacks = getWrongComebacks(comebackId);
      if (wrongComebacks.length > 0) {
        var wrongComeback = wrongComebacks[Math.floor(Math.random() * wrongComebacks.length)];
        UI.printDialogue('Pirate', insultData.comebacks[wrongComeback] || "Er... I don't know...");
      } else {
        UI.printDialogue('Pirate', "Uh... um... you... smell bad?");
      }
      UI.printCombat("Terrible comeback! Point to you!");
      fight.playerScore++;
    }

    UI.printBlank();
    checkFightEnd();
  }

  // ========================================================================
  // OPPONENT INSULTS (opponent chooses an insult, player must respond)
  // ========================================================================
  function opponentInsults() {
    fight.phase = 'player_responds';

    // Pick a random insult from opponent's pool
    var insult = fight.opponentInsults[Math.floor(Math.random() * fight.opponentInsults.length)];
    fight.currentInsult = insult;

    UI.printDialogue(fight.isSwordmaster ? 'Swordmaster' : 'Pirate', insult.insult);

    // Player learns this insult (for future use against other pirates)
    learnInsult(insult.id);

    // Show player's known comebacks as choices
    var knownComebacks = Engine.Player.comebacks_known;
    var insultData = GameData.insults;

    if (knownComebacks.length === 0) {
      // Player knows no comebacks
      UI.printCombat("You don't know any comebacks yet!");
      UI.printDialogue('Guybrush', "I am rubber, you are glue...");
      UI.printCombat("That doesn't work here. Point to opponent!");

      // Reveal the correct comeback so player can learn
      revealCorrectComeback(insult);

      UI.printBlank();
      fight.opponentScore++;
      checkFightEnd();
      return;
    }

    // Build choice list from known comebacks
    var choices = [];
    for (var c = 0; c < knownComebacks.length; c++) {
      var cbText = insultData.comebacks[knownComebacks[c]];
      if (cbText) {
        choices.push({ text: cbText, _comebackId: knownComebacks[c] });
      }
    }

    if (choices.length === 0) {
      UI.printCombat("You fumble for words. Point to opponent!");
      revealCorrectComeback(insult);
      fight.opponentScore++;
      checkFightEnd();
      return;
    }

    UI.printCombat("Choose your comeback:");
    UI.showChoices(choices, function (selectedIndex) {
      var selected = choices[selectedIndex];
      handlePlayerComebackChoice(selected._comebackId);
    });
  }

  function handlePlayerComebackChoice(comebackId) {
    var insultData = GameData.insults;
    var comebackText = insultData.comebacks[comebackId];

    UI.printDialogue('Guybrush', comebackText);

    var correctComebackId = fight.currentInsult.comeback_id;

    if (comebackId === correctComebackId) {
      UI.printCombat("Perfect comeback! Point to you!");
      fight.playerScore++;
    } else {
      UI.printCombat("Wrong comeback! Point to opponent.");
      fight.opponentScore++;

      // Reveal the correct comeback so player learns it
      revealCorrectComeback(fight.currentInsult);
    }

    UI.printBlank();
    checkFightEnd();
  }

  // ========================================================================
  // LEARNING SYSTEM
  // ========================================================================
  function learnInsult(insultId) {
    if (Engine.Player.insults_known.indexOf(insultId) === -1) {
      Engine.Player.insults_known.push(insultId);
      UI.printSystem("[You learned a new insult!]");
    }
  }

  function learnComeback(comebackId) {
    if (Engine.Player.comebacks_known.indexOf(comebackId) === -1) {
      Engine.Player.comebacks_known.push(comebackId);
      UI.printSystem("[You learned a new comeback!]");
    }
  }

  function revealCorrectComeback(insult) {
    var insultData = GameData.insults;
    var correctId = insult.comeback_id;
    var correctText = insultData.comebacks[correctId];
    if (correctText) {
      UI.printSystem('(The correct comeback was: "' + correctText + '")');
      learnComeback(correctId);
    }
  }

  // ========================================================================
  // FIGHT END
  // ========================================================================
  function checkFightEnd() {
    if (fight.playerScore >= fight.winTarget) {
      endFight(true);
    } else if (fight.opponentScore >= fight.winTarget) {
      endFight(false);
    } else {
      startRound();
    }
  }

  function endFight(playerWon) {
    UI.printSeparator();

    if (playerWon) {
      UI.printCombat('⚔ VICTORY! ⚔');
      if (fight.isSwordmaster) {
        UI.printCombat("You have defeated the Swordmaster!");
        Engine.setFlag('swordmaster_defeated', true);
        Engine.setFlag('trial_sword', true);
        Engine.Player.score += 100;
        UI.printCombat('The Swordmaster grudgingly acknowledges your skill.');
      } else {
        Engine.Player.sword_wins++;
        UI.printCombat("You defeated the pirate! (Wins: " + Engine.Player.sword_wins + ")");
        if (Engine.Player.sword_wins >= 5 && !Engine.Player.flags.swordmaster_found) {
          UI.printSystem("[You feel ready to challenge the Swordmaster.]");
        }
      }
    } else {
      UI.printCombat('DEFEAT!');
      if (fight.isSwordmaster) {
        UI.printCombat("The Swordmaster sends you packing. Come back when you've learned more.");
      } else {
        UI.printCombat("The pirate wins this time. But you learned some new tricks...");
      }
    }

    UI.printBlank();

    // Return to normal mode
    fight = null;
    Engine.Game.mode = Engine.GameMode.IDLE;
    Engine.Game.combatState = null;
    UI.setInputPlaceholder('What do you do?');

    Engine.checkTriggers();
  }

  // ========================================================================
  // HANDLE INPUT (during combat mode)
  // ========================================================================
  CombatSystem.handleInput = function (raw) {
    if (!fight) {
      Engine.Game.mode = Engine.GameMode.IDLE;
      return;
    }

    // Try handling as choice input
    if (UI.handleChoiceInput(raw)) {
      return;
    }

    // Allow retreat
    var lower = raw.trim().toLowerCase();
    if (['retreat', 'run', 'flee', 'escape', 'quit'].indexOf(lower) !== -1) {
      UI.printCombat("You flee from the fight! No honor among pirates...");
      fight = null;
      Engine.Game.mode = Engine.GameMode.IDLE;
      Engine.Game.combatState = null;
      UI.setInputPlaceholder('What do you do?');
      return;
    }

    var num = parseInt(raw, 10);
    if (isNaN(num)) {
      UI.printCombat("Type a number to select your choice, or 'retreat' to flee.");
    } else {
      UI.printCombat("That's not a valid choice.");
    }
  };

  // ========================================================================
  // UTILITY
  // ========================================================================
  function findInsultById(insultId) {
    var insultData = GameData.insults;
    if (!insultData) return null;

    // Search pirate insults
    if (insultData.pirate) {
      for (var p = 0; p < insultData.pirate.length; p++) {
        if (insultData.pirate[p].id === insultId) return insultData.pirate[p];
      }
    }
    // Search swordmaster insults
    if (insultData.swordmaster) {
      for (var s = 0; s < insultData.swordmaster.length; s++) {
        if (insultData.swordmaster[s].id === insultId) return insultData.swordmaster[s];
      }
    }
    return null;
  }

  function getWrongComebacks(correctId) {
    var insultData = GameData.insults;
    if (!insultData || !insultData.comebacks) return [];
    var wrong = [];
    var keys = Object.keys(insultData.comebacks);
    for (var k = 0; k < keys.length; k++) {
      if (keys[k] !== correctId) wrong.push(keys[k]);
    }
    return wrong;
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================
  CombatSystem.isInCombat = function () {
    return Engine.Game.mode === Engine.GameMode.COMBAT;
  };

  CombatSystem.getState = function () {
    return {
      insults_known: Engine.Player.insults_known.slice(),
      comebacks_known: Engine.Player.comebacks_known.slice(),
      sword_wins: Engine.Player.sword_wins
    };
  };

  CombatSystem.restoreState = function (state) {
    if (state.insults_known) Engine.Player.insults_known = state.insults_known;
    if (state.comebacks_known) Engine.Player.comebacks_known = state.comebacks_known;
    if (state.sword_wins !== undefined) Engine.Player.sword_wins = state.sword_wins;
  };

})();
