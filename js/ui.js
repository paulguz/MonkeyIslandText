/* ==========================================================================
   ui.js — DOM interaction layer for The Secret of Monkey Island
   Handles: text display, input, command history, scrollback, status bar
   ========================================================================== */

(function () {
  'use strict';

  window.UI = {};

  // ========================================================================
  // CONFIGURATION
  // ========================================================================
  var CONFIG = {
    typewriterEnabled: false,    // Set to true for typewriter effect
    typewriterSpeed: 20,         // ms per character
    maxScrollbackLines: 500,
    wordWrapWidth: 80            // characters (approximate)
  };

  // ========================================================================
  // DOM REFERENCES (set on init)
  // ========================================================================
  var outputEl = null;
  var inputEl = null;
  var statusLocation = null;
  var statusExits = null;
  var statusScore = null;

  // ========================================================================
  // COMMAND HISTORY
  // ========================================================================
  var commandHistory = [];
  var historyIndex = -1;
  var MAX_HISTORY = 50;

  // ========================================================================
  // INITIALIZATION
  // ========================================================================
  UI.init = function () {
    outputEl = document.getElementById('output');
    inputEl = document.getElementById('command-input');
    statusLocation = document.getElementById('status-location');
    statusExits = document.getElementById('status-exits');
    statusScore = document.getElementById('status-score');

    if (!inputEl) return;

    inputEl.addEventListener('keydown', handleKeyDown);
    inputEl.placeholder = 'What do you do?';

    // Focus input on click anywhere
    document.addEventListener('click', function () {
      inputEl.focus();
    });
  };

  // ========================================================================
  // INPUT HANDLING
  // ========================================================================
  function handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        submitCommand();
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateHistory(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateHistory(1);
        break;
    }
  }

  function submitCommand() {
    var raw = inputEl.value.trim();
    inputEl.value = '';
    historyIndex = -1;

    if (!raw) return;

    // Add to history
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== raw) {
      commandHistory.push(raw);
      if (commandHistory.length > MAX_HISTORY) {
        commandHistory.shift();
      }
    }

    // Echo the command
    printCommandEcho('> ' + raw);

    // Pass to engine
    if (window.Engine && Engine.processCommand) {
      Engine.processCommand(raw);
    }
  }

  function navigateHistory(direction) {
    if (commandHistory.length === 0) return;

    if (direction === -1) {
      // Up — go back in history
      if (historyIndex === -1) {
        historyIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        historyIndex--;
      }
    } else {
      // Down — go forward in history
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
      } else {
        historyIndex = -1;
        inputEl.value = '';
        return;
      }
    }

    inputEl.value = commandHistory[historyIndex];
    // Move cursor to end
    setTimeout(function () {
      inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
    }, 0);
  }

  // ========================================================================
  // TEXT OUTPUT
  // ========================================================================
  function appendLine(text, className) {
    if (!outputEl) return;

    var line = document.createElement('div');
    line.className = className || '';

    if (CONFIG.typewriterEnabled && className !== 'command-echo' && className !== 'system-text') {
      typewriterAppend(line, text);
    } else {
      line.textContent = text;
    }

    outputEl.appendChild(line);
    trimScrollback();
    scrollToBottom();
  }

  function typewriterAppend(element, text) {
    element.textContent = '';
    outputEl.appendChild(element);
    var i = 0;
    var interval = setInterval(function () {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, CONFIG.typewriterSpeed);
  }

  function trimScrollback() {
    while (outputEl && outputEl.children.length > CONFIG.maxScrollbackLines) {
      outputEl.removeChild(outputEl.firstChild);
    }
  }

  function scrollToBottom() {
    if (outputEl) {
      outputEl.scrollTop = outputEl.scrollHeight;
    }
  }

  // ========================================================================
  // PUBLIC PRINT METHODS
  // ========================================================================
  UI.printRoomName = function (name) {
    appendLine('', 'separator');
    appendLine(name, 'room-name');
  };

  UI.printRoomDesc = function (text) {
    var lines = wordWrap(text, CONFIG.wordWrapWidth);
    for (var i = 0; i < lines.length; i++) {
      appendLine(lines[i], 'room-desc');
    }
  };

  UI.printRoomItems = function (text) {
    appendLine(text, 'room-items');
  };

  UI.printNPC = function (text) {
    appendLine(text, 'room-npcs');
  };

  UI.printExits = function (text) {
    appendLine(text, 'room-exits');
  };

  UI.printNarration = function (text) {
    if (!text) return;
    var lines = wordWrap(text, CONFIG.wordWrapWidth);
    for (var i = 0; i < lines.length; i++) {
      appendLine(lines[i], 'narrator');
    }
  };

  UI.printDialogue = function (speaker, text) {
    if (!outputEl) return;
    var line = document.createElement('div');

    var speakerSpan = document.createElement('span');
    speakerSpan.className = 'dialogue-speaker';
    speakerSpan.textContent = speaker + ': ';

    var textSpan = document.createElement('span');
    textSpan.className = 'dialogue-text';
    textSpan.textContent = '"' + text + '"';

    line.appendChild(speakerSpan);
    line.appendChild(textSpan);
    outputEl.appendChild(line);
    trimScrollback();
    scrollToBottom();
  };

  UI.printError = function (text) {
    appendLine(text, 'error-text');
  };

  UI.printSystem = function (text) {
    appendLine(text, 'system-text');
  };

  UI.printCombat = function (text) {
    appendLine(text, 'combat-text');
  };

  UI.printCommandEcho = printCommandEcho;
  function printCommandEcho(text) {
    appendLine(text, 'command-echo');
  }

  UI.printBlank = function () {
    appendLine('', '');
  };

  UI.printSeparator = function () {
    appendLine('─'.repeat(50), 'separator');
  };

  UI.printInventoryHeader = function (text) {
    appendLine(text, 'inventory-header');
  };

  UI.printInventoryItem = function (text) {
    appendLine(text, 'inventory-item');
  };

  // ========================================================================
  // DIALOGUE CHOICE DISPLAY
  // ========================================================================
  UI.showChoices = function (choices, callback) {
    if (!outputEl) return;

    var container = document.createElement('div');
    container.className = 'dialogue-choices';

    for (var i = 0; i < choices.length; i++) {
      (function (index, choice) {
        var choiceDiv = document.createElement('div');
        choiceDiv.className = 'dialogue-choice';
        choiceDiv.textContent = (index + 1) + '. ' + choice.text;
        choiceDiv.setAttribute('data-choice-index', index);
        container.appendChild(choiceDiv);
      })(i, choices[i]);
    }

    outputEl.appendChild(container);
    scrollToBottom();

    // Store callback for when player types a number
    UI._pendingChoiceCallback = callback;
    UI._pendingChoiceCount = choices.length;
    UI.setInputPlaceholder('Choose (1-' + choices.length + ')...');
  };

  UI.handleChoiceInput = function (raw) {
    var num = parseInt(raw, 10);
    if (UI._pendingChoiceCallback && num >= 1 && num <= UI._pendingChoiceCount) {
      var callback = UI._pendingChoiceCallback;
      UI._pendingChoiceCallback = null;
      UI._pendingChoiceCount = 0;
      callback(num - 1);
      // Only reset placeholder if the callback didn't set up new choices
      if (!UI._pendingChoiceCallback) {
        UI.setInputPlaceholder('What do you do?');
      }
      return true;
    }
    return false;
  };

  // ========================================================================
  // STATUS BAR
  // ========================================================================
  UI.updateStatus = function (roomName, exits, score) {
    if (statusLocation) statusLocation.textContent = roomName || '';
    if (statusExits) statusExits.textContent = exits && exits.length ? 'Exits: ' + exits.join(', ') : '';
    if (statusScore) statusScore.textContent = score !== undefined ? 'Score: ' + score : '';
  };

  // ========================================================================
  // UTILITIES
  // ========================================================================
  UI.clear = function () {
    if (outputEl) outputEl.innerHTML = '';
  };

  UI.setInputPlaceholder = function (text) {
    if (inputEl) inputEl.placeholder = text;
  };

  UI.focusInput = function () {
    if (inputEl) inputEl.focus();
  };

  UI.setTypewriter = function (enabled) {
    CONFIG.typewriterEnabled = !!enabled;
  };

  // ========================================================================
  // WORD WRAP
  // ========================================================================
  function wordWrap(text, maxWidth) {
    if (!text) return [''];
    if (text.length <= maxWidth) return [text];

    var lines = [];
    var remaining = text;

    while (remaining.length > maxWidth) {
      var breakPoint = remaining.lastIndexOf(' ', maxWidth);
      if (breakPoint <= 0) {
        breakPoint = maxWidth;
      }
      lines.push(remaining.substring(0, breakPoint));
      remaining = remaining.substring(breakPoint).trimStart();
    }
    if (remaining.length > 0) {
      lines.push(remaining);
    }

    return lines;
  }

})();
