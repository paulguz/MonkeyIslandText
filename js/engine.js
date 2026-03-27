/* ==========================================================================
   engine.js — Core game engine for The Secret of Monkey Island text adventure
   Handles: game loop, command parsing, state management, inventory,
            room navigation, puzzle resolution, save/load
   ========================================================================== */

(function () {
  'use strict';

  // ========================================================================
  // Global namespace
  // ========================================================================
  window.GameData = window.GameData || {};
  window.GameData.events = window.GameData.events || {};
  window.Engine = {};

  // ========================================================================
  // PLAYER STATE
  // ========================================================================
  var Player = {
    location: 'lookout',
    inventory: [],
    flags: {
      trial_sword: false,
      trial_thievery: false,
      trial_treasure: false,
      talked_to_leaders: false,
      knows_three_trials: false,
      cannon_trick_done: false,
      sword_training_done: false,
      swordmaster_found: false,
      swordmaster_defeated: false,
      troll_paid: false,
      dogs_drugged: false,
      mansion_entered: false,
      governor_met: false,
      ghost_ship_seen: false,
      otis_has_mints: false,
      otis_has_repellent: false,
      got_carrot_cake: false,
      got_file: false,
      got_idol: false,
      jail_lock_melted: false,
      got_treasure: false,
      safe_combination_seen: false,
      safe_opened: false,
      got_note_of_credit: false,
      ship_bought: false,
      crew_otis: false,
      crew_swordmaster: false,
      crew_meathook: false,
      pieces_of_eight: 0,
      thrown_in_sea: false
    },
    insults_known: [],
    comebacks_known: [],
    sword_wins: 0,
    turns: 0,
    score: 0
  };

  // ========================================================================
  // GAME STATE MACHINE
  // ========================================================================
  var GameMode = {
    IDLE: 'idle',
    DIALOGUE: 'dialogue',
    COMBAT: 'combat',
    CUTSCENE: 'cutscene'
  };

  var Game = {
    mode: GameMode.IDLE,
    initialized: false,
    dialogueState: null,
    combatState: null,
    cutsceneQueue: [],
    timedItems: {}       // itemId -> turnsRemaining (grog mug, etc.)
  };

  // ========================================================================
  // DIRECTION MAP
  // ========================================================================
  var DIRECTION_ALIASES = {
    n: 'north', s: 'south', e: 'east', w: 'west',
    u: 'up', d: 'down',
    'in': 'enter', enter: 'enter',
    out: 'out', exit: 'out', leave: 'out',
    north: 'north', south: 'south', east: 'east', west: 'west',
    up: 'up', down: 'down'
  };

  var ALL_DIRECTIONS = ['north', 'south', 'east', 'west', 'up', 'down', 'enter', 'out',
                        'n', 's', 'e', 'w', 'u', 'd', 'in', 'exit', 'leave'];

  // ========================================================================
  // VERB TABLE
  // ========================================================================
  var VERB_ALIASES = {
    go: 'go', walk: 'go', move: 'go', head: 'go', travel: 'go',
    look: 'look', examine: 'look', inspect: 'look', read: 'look', check: 'look', l: 'look',
    take: 'take', get: 'take', grab: 'take',
    'pick': 'take',   // "pick up" handled specially
    use: 'use',
    give: 'give', hand: 'give', offer: 'give',
    talk: 'talk', speak: 'talk', chat: 'talk', ask: 'talk',
    open: 'open', unlock: 'open',
    close: 'close', shut: 'close',
    push: 'push', shove: 'push', press: 'push',
    pull: 'pull', yank: 'pull',
    buy: 'buy', purchase: 'buy',
    show: 'show', present: 'show', display: 'show',
    inventory: 'inventory', i: 'inventory', inv: 'inventory', items: 'inventory',
    save: 'save',
    load: 'load', restore: 'load',
    saves: 'saves',
    help: 'help', '?': 'help',
    wait: 'wait', z: 'wait',
    dig: 'dig',
    eat: 'eat',
    music: 'music'
  };

  var PREPOSITIONS = ['with', 'on', 'to', 'at', 'in', 'from', 'into', 'using'];
  var ARTICLES = ['a', 'an', 'the', 'some'];

  // ========================================================================
  // ERROR MESSAGES
  // ========================================================================
  var ERROR_MESSAGES = [
    "That's not how pirating works.",
    "You can't do that. Believe me, I've tried.",
    "I don't understand. Try using smaller words.",
    "Even a three-headed monkey couldn't figure out what you mean.",
    "That doesn't work. But points for creativity.",
    "I'd love to do that, but my hands are full of nothing.",
    "That's about as useful as a rubber chicken with a pulley in the middle.",
    "Nope. Try something that makes sense. Or at least less nonsense.",
    "I'm not sure what you're trying to do, but I admire your ambition."
  ];

  function randomError() {
    return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
  }

  // ========================================================================
  // PARSER
  // ========================================================================
  var Parser = {
    parse: function (raw) {
      if (!raw || !raw.trim()) return null;

      var input = raw.trim().toLowerCase();
      var tokens = input.split(/\s+/);

      // Remove articles
      tokens = tokens.filter(function (t) { return ARTICLES.indexOf(t) === -1; });
      if (tokens.length === 0) return null;

      // Check for bare direction
      if (tokens.length === 1 && DIRECTION_ALIASES[tokens[0]]) {
        return { verb: 'go', noun1: DIRECTION_ALIASES[tokens[0]], noun2: null, raw: input };
      }

      // Handle "pick up" as two-word verb
      var verb, restTokens;
      if (tokens[0] === 'pick' && tokens.length > 1 && tokens[1] === 'up') {
        verb = 'take';
        restTokens = tokens.slice(2);
      } else if (tokens[0] === 'look' && tokens.length > 1 && tokens[1] === 'at') {
        verb = 'look';
        restTokens = tokens.slice(2);
      } else if (tokens[0] === 'talk' && tokens.length > 1 && tokens[1] === 'to') {
        verb = 'talk';
        restTokens = tokens.slice(2);
      } else if (tokens[0] === 'speak' && tokens.length > 1 && tokens[1] === 'to') {
        verb = 'talk';
        restTokens = tokens.slice(2);
      } else {
        var resolvedVerb = VERB_ALIASES[tokens[0]];
        if (!resolvedVerb) {
          // Maybe the whole input is a direction alias
          if (DIRECTION_ALIASES[tokens[0]]) {
            return { verb: 'go', noun1: DIRECTION_ALIASES[tokens[0]], noun2: null, raw: input };
          }
          return { verb: null, unknownWord: tokens[0], raw: input };
        }
        verb = resolvedVerb;
        restTokens = tokens.slice(1);
      }

      // If verb is "go" and next token is a direction
      if (verb === 'go' && restTokens.length > 0 && DIRECTION_ALIASES[restTokens[0]]) {
        return { verb: 'go', noun1: DIRECTION_ALIASES[restTokens[0]], noun2: null, raw: input };
      }

      // If verb is "go" and next tokens form a named exit (e.g., "go town", "go map")
      if (verb === 'go' && restTokens.length > 0) {
        return { verb: 'go', noun1: restTokens.join(' '), noun2: null, raw: input };
      }

      // Split on preposition
      var noun1Tokens = [];
      var noun2Tokens = [];
      var foundPrep = null;
      for (var idx = 0; idx < restTokens.length; idx++) {
        if (!foundPrep && PREPOSITIONS.indexOf(restTokens[idx]) !== -1) {
          foundPrep = restTokens[idx];
        } else if (foundPrep) {
          noun2Tokens.push(restTokens[idx]);
        } else {
          noun1Tokens.push(restTokens[idx]);
        }
      }

      var noun1 = noun1Tokens.join(' ') || null;
      var noun2 = noun2Tokens.join(' ') || null;

      return { verb: verb, noun1: noun1, noun2: noun2, preposition: foundPrep, raw: input };
    }
  };

  // ========================================================================
  // NOUN RESOLUTION
  // ========================================================================
  function resolveNoun(text) {
    if (!text) return null;
    var lowerText = text.toLowerCase();

    // 1. Check items in current room
    var room = getRoom(Player.location);
    if (room && room.items) {
      for (var ri = 0; ri < room.items.length; ri++) {
        var roomItemId = room.items[ri];
        var rItem = getItem(roomItemId);
        if (rItem && matchesItem(rItem, lowerText)) {
          return { type: 'item', id: rItem.id, obj: rItem };
        }
      }
    }

    // 2. Check player inventory
    for (var ii = 0; ii < Player.inventory.length; ii++) {
      var invItem = getItem(Player.inventory[ii]);
      if (invItem && matchesItem(invItem, lowerText)) {
        return { type: 'item', id: invItem.id, obj: invItem };
      }
    }

    // 3. Check NPCs in current room
    if (room && room.npcs) {
      for (var ni = 0; ni < room.npcs.length; ni++) {
        var npcId = room.npcs[ni];
        var npc = getNPC(npcId);
        if (npc && matchesNPC(npc, lowerText)) {
          return { type: 'npc', id: npc.id, obj: npc };
        }
      }
    }

    // 4. Check room features (items that are in the room but not portable)
    if (GameData.items) {
      var allItems = Object.keys(GameData.items);
      for (var fi = 0; fi < allItems.length; fi++) {
        var fItem = GameData.items[allItems[fi]];
        if (fItem && fItem.location === Player.location && matchesItem(fItem, lowerText)) {
          return { type: 'item', id: fItem.id, obj: fItem };
        }
      }
    }

    // 5. Directions
    if (DIRECTION_ALIASES[lowerText]) {
      return { type: 'direction', id: DIRECTION_ALIASES[lowerText] };
    }

    return null;
  }

  function matchesItem(item, text) {
    if (!item) return false;
    if (item.id === text) return true;
    if (item.name && item.name.toLowerCase() === text) return true;
    if (item.aliases) {
      for (var a = 0; a < item.aliases.length; a++) {
        if (item.aliases[a].toLowerCase() === text) return true;
      }
    }
    // Partial match: text matches last word(s) of name
    if (item.name && item.name.toLowerCase().indexOf(text) !== -1) return true;
    return false;
  }

  function matchesNPC(npc, text) {
    if (!npc) return false;
    if (npc.id === text) return true;
    if (npc.name && npc.name.toLowerCase() === text) return true;
    if (npc.aliases) {
      for (var a = 0; a < npc.aliases.length; a++) {
        if (npc.aliases[a].toLowerCase() === text) return true;
      }
    }
    // Partial match on NPC name
    if (npc.name && npc.name.toLowerCase().indexOf(text) !== -1) return true;
    if (npc.id.replace(/_/g, ' ') === text) return true;
    return false;
  }

  // ========================================================================
  // DATA ACCESSORS (all content comes from GameData)
  // ========================================================================
  function getRoom(id) {
    return GameData.rooms ? GameData.rooms[id] || null : null;
  }

  function getItem(id) {
    return GameData.items ? GameData.items[id] || null : null;
  }

  function getNPC(id) {
    return GameData.npcs ? GameData.npcs[id] || null : null;
  }

  function getDialogue(id) {
    return GameData.dialogue ? GameData.dialogue[id] || null : null;
  }

  function getPuzzle(id) {
    return GameData.puzzles ? GameData.puzzles[id] || null : null;
  }

  // ========================================================================
  // ROOM DISPLAY
  // ========================================================================
  function describeRoom(roomId, forceLook) {
    var room = getRoom(roomId);
    if (!room) {
      UI.printError('You appear to be nowhere. This is concerning.');
      return;
    }

    UI.printRoomName(room.name);

    // Draw room graphic if available
    if (window.Graphics && Graphics.drawRoom) {
      Graphics.drawRoom(roomId);
    }

    // Get appropriate description (may vary by flags)
    var desc = getRoomDescription(room);
    UI.printRoomDesc(desc);

    // Show visible items
    var visibleItems = getRoomVisibleItems(room);
    if (visibleItems.length > 0) {
      var itemNames = visibleItems.map(function (iid) {
        var item = getItem(iid);
        return item ? item.name : iid;
      });
      UI.printRoomItems('You can see: ' + itemNames.join(', ') + '.');
    }

    // Show NPCs
    var visibleNPCs = getRoomVisibleNPCs(room);
    if (visibleNPCs.length > 0) {
      for (var n = 0; n < visibleNPCs.length; n++) {
        var npc = getNPC(visibleNPCs[n]);
        if (npc && npc.roomDescription) {
          UI.printNPC(npc.roomDescription);
        } else if (npc) {
          UI.printNPC(npc.name + ' is here.');
        }
      }
    }

    // Show exits
    var exits = getRoomExits(room);
    if (exits.length > 0) {
      UI.printExits('Exits: ' + exits.join(', '));
    }

    // Update status bar
    UI.updateStatus(room.name, exits, Player.score);
  }

  function getRoomDescription(room) {
    // Check for conditional descriptions based on flags
    if (room.conditionalDescriptions) {
      for (var cd = 0; cd < room.conditionalDescriptions.length; cd++) {
        var cond = room.conditionalDescriptions[cd];
        if (checkCondition(cond.condition)) {
          return cond.description;
        }
      }
    }
    return room.description || 'You see nothing special.';
  }

  function getRoomVisibleItems(room) {
    var items = [];
    if (!room.items) return items;
    for (var i = 0; i < room.items.length; i++) {
      var item = getItem(room.items[i]);
      if (item && !item.hidden) {
        items.push(room.items[i]);
      }
    }
    return items;
  }

  function getRoomVisibleNPCs(room) {
    var npcs = [];
    if (!room.npcs) return npcs;
    for (var i = 0; i < room.npcs.length; i++) {
      var npc = getNPC(room.npcs[i]);
      if (npc) {
        // Check if NPC has a visibility condition
        if (npc.visibleWhen && !checkCondition(npc.visibleWhen)) continue;
        npcs.push(room.npcs[i]);
      }
    }
    return npcs;
  }

  function getRoomExits(room) {
    if (!room.exits) return [];
    return Object.keys(room.exits);
  }

  // ========================================================================
  // CONDITION CHECKER
  // ========================================================================
  function checkCondition(condition) {
    if (!condition) return true;
    if (typeof condition === 'function') return condition(Player, Game);
    if (typeof condition === 'string') return !!Player.flags[condition];
    if (typeof condition === 'object') {
      var keys = Object.keys(condition);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var expected = condition[key];
        if (key === 'not') {
          if (checkCondition(expected)) return false;
        } else if (key === 'or') {
          var anyTrue = false;
          for (var oi = 0; oi < expected.length; oi++) {
            if (checkCondition(expected[oi])) { anyTrue = true; break; }
          }
          if (!anyTrue) return false;
        } else if (key === 'and') {
          for (var ai = 0; ai < expected.length; ai++) {
            if (!checkCondition(expected[ai])) return false;
          }
        } else if (key === 'hasItem') {
          if (Player.inventory.indexOf(expected) === -1) return false;
        } else if (key === 'inRoom') {
          if (Player.location !== expected) return false;
        } else if (key === 'gte') {
          var parts = expected.split(':');
          var flagVal = Player.flags[parts[0]];
          if (typeof flagVal !== 'number' || flagVal < parseInt(parts[1], 10)) return false;
        } else {
          // Flag check: key is flag name, expected is the value
          var flagValue = Player.flags[key];
          if (flagValue !== expected) return false;
        }
      }
      return true;
    }
    return !!condition;
  }

  // ========================================================================
  // MOVEMENT
  // ========================================================================
  function movePlayer(direction) {
    var room = getRoom(Player.location);
    if (!room || !room.exits) {
      UI.printError("You can't go anywhere from here.");
      return;
    }

    var targetId = room.exits[direction];

    // Also check named exits (e.g., "town", "map")
    if (!targetId) {
      var exitKeys = Object.keys(room.exits);
      for (var ek = 0; ek < exitKeys.length; ek++) {
        if (exitKeys[ek].toLowerCase() === direction.toLowerCase()) {
          targetId = room.exits[exitKeys[ek]];
          break;
        }
      }
    }

    if (!targetId) {
      UI.printNarration("You can't go that way.");
      return;
    }

    // Handle conditional exit objects: {room, requires, failMessage}
    if (typeof targetId === 'object' && targetId !== null) {
      if (targetId.requires && !checkCondition(targetId.requires)) {
        UI.printNarration(targetId.failMessage || "The way is blocked.");
        return;
      }
      targetId = targetId.room;
    }

    // Check for blocked exits
    if (room.blockedExits && room.blockedExits[direction]) {
      var blocked = room.blockedExits[direction];
      if (!checkCondition(blocked.condition)) {
        UI.printNarration(blocked.message || "The way is blocked.");
        return;
      }
    }

    var targetRoom = getRoom(targetId);
    if (!targetRoom) {
      UI.printError("That exit leads nowhere. Strange.");
      return;
    }

    // Fire onExit for current room
    if (room.onExit) {
      var exitResult = triggerEvent(room.onExit, direction);
      if (exitResult === false) return; // Exit was blocked by event handler
    }

    Player.location = targetId;
    Player.turns++;

    // Tick timed items
    tickTimedItems();

    // Fire onEnter for new room
    if (targetRoom.onEnter) {
      var enterResult = triggerEvent(targetRoom.onEnter, null);
      if (enterResult && enterResult.skipDescription) return;
    }

    // Auto-save on room transition
    SaveSystem.autoSave();

    // Display new room
    UI.printSeparator();
    describeRoom(targetId);

    // Check puzzle triggers
    checkTriggers();
  }

  // ========================================================================
  // INVENTORY MANAGEMENT
  // ========================================================================
  function addToInventory(itemId) {
    if (Player.inventory.indexOf(itemId) === -1) {
      Player.inventory.push(itemId);
      var item = getItem(itemId);
      // Remove from room if it's there
      removeItemFromRoom(itemId);
      if (item) {
        item.location = 'inventory';
      }
    }
  }

  function removeFromInventory(itemId) {
    var idx = Player.inventory.indexOf(itemId);
    if (idx !== -1) {
      Player.inventory.splice(idx, 1);
    }
  }

  function hasItem(itemId) {
    return Player.inventory.indexOf(itemId) !== -1;
  }

  function removeItemFromRoom(itemId) {
    if (!GameData.rooms) return;
    var roomKeys = Object.keys(GameData.rooms);
    for (var r = 0; r < roomKeys.length; r++) {
      var room = GameData.rooms[roomKeys[r]];
      if (room.items) {
        var idx = room.items.indexOf(itemId);
        if (idx !== -1) {
          room.items.splice(idx, 1);
        }
      }
    }
  }

  function addItemToRoom(itemId, roomId) {
    var room = getRoom(roomId);
    if (room) {
      if (!room.items) room.items = [];
      if (room.items.indexOf(itemId) === -1) {
        room.items.push(itemId);
      }
      var item = getItem(itemId);
      if (item) item.location = roomId;
    }
  }

  function displayInventory() {
    if (Player.inventory.length === 0 && Player.flags.pieces_of_eight === 0) {
      UI.printNarration("You're not carrying anything. A true minimalist pirate.");
      return;
    }
    UI.printInventoryHeader('You are carrying:');
    for (var i = 0; i < Player.inventory.length; i++) {
      var item = getItem(Player.inventory[i]);
      var name = item ? item.name : Player.inventory[i];
      UI.printInventoryItem('  - ' + capitalize(name));
    }
    if (Player.flags.pieces_of_eight > 0) {
      UI.printInventoryItem('  - ' + Player.flags.pieces_of_eight + ' pieces of eight');
    }
  }

  // ========================================================================
  // TIMED ITEMS (Grog mug, etc.)
  // ========================================================================
  function registerTimedItem(itemId, turns) {
    Game.timedItems[itemId] = turns;
  }

  function tickTimedItems() {
    var keys = Object.keys(Game.timedItems);
    for (var i = 0; i < keys.length; i++) {
      var itemId = keys[i];
      Game.timedItems[itemId]--;
      if (Game.timedItems[itemId] <= 0) {
        // Item has expired
        var item = getItem(itemId);
        var expireMsg = (item && item.onExpire) ? item.onExpire : "The " + (item ? item.name : itemId) + " has dissolved!";
        UI.printNarration(expireMsg);
        removeFromInventory(itemId);
        delete Game.timedItems[itemId];
        // Fire expire event
        if (item && item.onExpireEvent) {
          triggerEvent(item.onExpireEvent, null);
        }
      } else if (Game.timedItems[itemId] <= 2) {
        var warnItem = getItem(itemId);
        UI.printNarration("The " + (warnItem ? warnItem.name : itemId) + " is about to dissolve!");
      }
    }
  }

  // ========================================================================
  // VERB HANDLERS
  // ========================================================================
  var VerbHandlers = {
    go: function (parsed) {
      var direction = parsed.noun1;
      if (!direction) {
        UI.printNarration("Go where? Try a direction like north, south, east, or west.");
        return;
      }
      movePlayer(direction);
    },

    look: function (parsed) {
      if (!parsed.noun1) {
        // Look at room
        describeRoom(Player.location, true);
        // Show room's onLook extended description if present
        var currentRoom = getRoom(Player.location);
        if (currentRoom && currentRoom.onLook) {
          if (typeof currentRoom.onLook === 'string') {
            UI.printNarration(currentRoom.onLook);
          } else {
            triggerEvent(currentRoom.onLook, currentRoom);
          }
        }
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target) {
        UI.printNarration("I don't see a " + parsed.noun1 + " here. Maybe it's behind you. A three-headed monkey!");
        return;
      }

      if (target.type === 'item') {
        UI.printNarration(target.obj.description || "You see nothing special about the " + target.obj.name + ".");
        if (target.obj.onLook) {
          if (typeof target.obj.onLook === 'string') {
            UI.printNarration(target.obj.onLook);
          } else {
            triggerEvent(target.obj.onLook, target.obj);
          }
        }
      } else if (target.type === 'npc') {
        UI.printNarration(target.obj.description || "You see " + target.obj.name + ".");
      }
    },

    take: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Take what? You need to be more specific.");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target || target.type !== 'item') {
        UI.printNarration("I don't see a " + parsed.noun1 + " here. Maybe it's behind you. A three-headed monkey!");
        return;
      }

      var item = target.obj;
      if (!item.portable && !item.takeable) {
        UI.printNarration("You can't take the " + item.name + ". It's not yours. ...Yet.");
        return;
      }

      if (item.takeable === false) {
        UI.printNarration(item.cantTakeMessage || "You can't take that.");
        return;
      }

      // Check if item is in the room or accessible
      var room = getRoom(Player.location);
      var inRoom = room && room.items && room.items.indexOf(item.id) !== -1;
      var isRoomFeature = item.location === Player.location;

      if (!inRoom && !isRoomFeature) {
        if (hasItem(item.id)) {
          UI.printNarration("You're already carrying the " + item.name + ".");
        } else {
          UI.printNarration("I don't see a " + parsed.noun1 + " here.");
        }
        return;
      }

      // Check take conditions
      if (item.takeCondition && !checkCondition(item.takeCondition)) {
        UI.printNarration(item.takeFailMessage || "You can't take that right now.");
        return;
      }

      addToInventory(item.id);
      UI.printNarration(item.takeMessage || "You pick up the " + item.name + ".");

      // Check for price
      if (item.price && item.price > 0) {
        if (Player.flags.pieces_of_eight < item.price) {
          removeFromInventory(item.id);
          addItemToRoom(item.id, Player.location);
          UI.printNarration("You can't afford that. It costs " + item.price + " pieces of eight.");
          return;
        }
        Player.flags.pieces_of_eight -= item.price;
        UI.printNarration("That cost you " + item.price + " pieces of eight.");
      }

      // Fire onTake event
      if (item.onTake) {
        triggerEvent(item.onTake, item);
      }

      // Register timed items
      if (item.timedTurns) {
        registerTimedItem(item.id, item.timedTurns);
      }
    },

    use: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Use what? You need to specify an item.");
        return;
      }

      var target1 = resolveNoun(parsed.noun1);
      if (!target1) {
        UI.printNarration("I don't see a " + parsed.noun1 + " here.");
        return;
      }

      // "use X with Y" or "use X on Y"
      if (parsed.noun2) {
        var target2 = resolveNoun(parsed.noun2);
        if (!target2) {
          UI.printNarration("I don't see a " + parsed.noun2 + " here.");
          return;
        }
        handleUseWith(target1, target2);
        return;
      }

      // "use X" alone
      if (target1.type === 'item') {
        var item = target1.obj;
        if (item.useAlone) {
          triggerEvent(item.useAlone, item);
        } else {
          UI.printNarration("You can't figure out how to use the " + item.name + " by itself.");
        }
      } else {
        UI.printNarration(randomError());
      }
    },

    give: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Give what to whom?");
        return;
      }
      if (!parsed.noun2) {
        UI.printNarration("Give the " + parsed.noun1 + " to whom?");
        return;
      }

      var item = resolveNoun(parsed.noun1);
      var recipient = resolveNoun(parsed.noun2);

      if (!item || item.type !== 'item') {
        UI.printNarration("You don't have a " + parsed.noun1 + " to give.");
        return;
      }
      if (!hasItem(item.id)) {
        UI.printNarration("You're not carrying the " + item.obj.name + ".");
        return;
      }
      if (!recipient || recipient.type !== 'npc') {
        UI.printNarration("There's nobody called " + parsed.noun2 + " here. You're talking to yourself again.");
        return;
      }

      handleGiveTo(item, recipient);
    },

    talk: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Talk to whom? There's nobody to talk to if you don't specify.");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target || target.type !== 'npc') {
        UI.printNarration("There's nobody called " + parsed.noun1 + " here. You're talking to yourself again.");
        return;
      }

      var npc = target.obj;
      if (!npc.dialogue) {
        UI.printNarration(npc.name + " doesn't seem interested in talking.");
        return;
      }

      // Start dialogue
      DialogueSystem.startDialogue(npc.dialogue, npc);
    },

    open: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Open what?");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target) {
        UI.printNarration("I don't see a " + parsed.noun1 + " here.");
        return;
      }

      if (target.type === 'item' && target.obj.onOpen) {
        triggerEvent(target.obj.onOpen, target.obj);
      } else {
        UI.printNarration("You can't open that.");
      }
    },

    close: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Close what?");
        return;
      }
      UI.printNarration("You can't close that. Well, you probably could, but why bother?");
    },

    push: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Push what?");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target) {
        UI.printNarration("I don't see a " + parsed.noun1 + " here.");
        return;
      }

      if (target.type === 'item' && target.obj.onPush) {
        triggerEvent(target.obj.onPush, target.obj);
      } else {
        UI.printNarration("Pushing the " + (target.obj ? target.obj.name : parsed.noun1) + " doesn't accomplish anything.");
      }
    },

    pull: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Pull what?");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target) {
        UI.printNarration("I don't see a " + parsed.noun1 + " here.");
        return;
      }

      if (target.type === 'item' && target.obj.onPull) {
        triggerEvent(target.obj.onPull, target.obj);
      } else {
        UI.printNarration("Pulling the " + (target.obj ? target.obj.name : parsed.noun1) + " doesn't do anything useful.");
      }
    },

    buy: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Buy what?");
        return;
      }

      var target = resolveNoun(parsed.noun1);
      if (!target || target.type !== 'item') {
        UI.printNarration("I don't see a " + parsed.noun1 + " for sale here.");
        return;
      }

      var item = target.obj;
      if (!item.price && item.price !== 0) {
        UI.printNarration("That's not for sale.");
        return;
      }

      if (item.buyCondition && !checkCondition(item.buyCondition)) {
        UI.printNarration(item.buyFailMessage || "You can't buy that right now.");
        return;
      }

      if (Player.flags.pieces_of_eight < item.price) {
        UI.printNarration("You can't afford the " + item.name + ". It costs " + item.price + " pieces of eight and you only have " + Player.flags.pieces_of_eight + ".");
        return;
      }

      Player.flags.pieces_of_eight -= item.price;
      addToInventory(item.id);
      UI.printNarration(item.buyMessage || "You buy the " + item.name + " for " + item.price + " pieces of eight.");

      if (item.onBuy) {
        triggerEvent(item.onBuy, item);
      }
    },

    show: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Show what to whom?");
        return;
      }
      if (!parsed.noun2) {
        UI.printNarration("Show the " + parsed.noun1 + " to whom?");
        return;
      }

      var item = resolveNoun(parsed.noun1);
      var target = resolveNoun(parsed.noun2);

      if (!item || item.type !== 'item') {
        UI.printNarration("You don't have a " + parsed.noun1 + " to show.");
        return;
      }
      if (!hasItem(item.id)) {
        UI.printNarration("You're not carrying the " + item.obj.name + ".");
        return;
      }
      if (!target || target.type !== 'npc') {
        UI.printNarration("There's nobody called " + parsed.noun2 + " here.");
        return;
      }

      handleShowTo(item, target);
    },

    inventory: function () {
      displayInventory();
    },

    help: function () {
      UI.printSystem('=== HELP ===');
      UI.printSystem('Available commands:');
      UI.printSystem('  go/walk [direction]  - Move (north, south, east, west, up, down, enter, out)');
      UI.printSystem('  look/examine [thing] - Look at something (or just "look" for room)');
      UI.printSystem('  take/get [item]      - Pick up an item');
      UI.printSystem('  use [item]           - Use an item (or "use X with Y")');
      UI.printSystem('  give [item] to [npc] - Give an item to someone');
      UI.printSystem('  talk to [npc]        - Talk to a character');
      UI.printSystem('  open [thing]         - Open something');
      UI.printSystem('  push/pull [thing]    - Push or pull something');
      UI.printSystem('  buy [item]           - Purchase an item');
      UI.printSystem('  show [item] to [npc] - Show an item to someone');
      UI.printSystem('  inventory / i        - Check what you\'re carrying');
      UI.printSystem('  save [name]          - Save your game');
      UI.printSystem('  load [name]          - Load a saved game');
      UI.printSystem('  saves                - List saved games');
      UI.printSystem('  wait / z             - Wait a turn');
      UI.printSystem('  music                - Toggle the Monkey Island theme');
      UI.printSystem('  help / ?             - Show this help');
      UI.printSystem('');
      UI.printSystem('You can also just type a direction: n, s, e, w, u, d');
    },

    wait: function () {
      Player.turns++;
      tickTimedItems();
      var waitMessages = [
        "Time passes...",
        "You wait around for a bit. Nothing happens.",
        "You twiddle your thumbs piratically.",
        "You wait. The Caribbean breeze ruffles your hair.",
        "You stand around looking piratey."
      ];
      UI.printNarration(waitMessages[Math.floor(Math.random() * waitMessages.length)]);
    },

    music: function () {
      if (!window.Beeper) {
        UI.printError("The beeper seems to be broken. No music for you.");
        return;
      }
      var playing = Beeper.toggle();
      if (playing) {
        UI.printSystem('♪ The Monkey Island theme fills the air from a tiny beeper...');
      } else {
        UI.printSystem('The music stops. Silence returns to Mêlée Island.');
      }
    },

    save: function (parsed) {
      var slotName = parsed.noun1 || 'quicksave';
      SaveSystem.save(slotName);
      UI.printSystem('Game saved to slot: ' + slotName);
    },

    load: function (parsed) {
      var slotName = parsed.noun1 || 'quicksave';
      if (SaveSystem.load(slotName)) {
        UI.printSystem('Game loaded from slot: ' + slotName);
        UI.printSeparator();
        describeRoom(Player.location);
      } else {
        UI.printError('No save found in slot: ' + slotName);
      }
    },

    saves: function () {
      var saveList = SaveSystem.listSaves();
      if (saveList.length === 0) {
        UI.printSystem('No saved games found.');
        return;
      }
      UI.printSystem('=== Saved Games ===');
      for (var s = 0; s < saveList.length; s++) {
        var sv = saveList[s];
        var date = new Date(sv.timestamp).toLocaleString();
        UI.printSystem('  ' + sv.name + ' — ' + date);
      }
    },

    dig: function (parsed) {
      // Shortcut for "use shovel"
      if (hasItem('shovel')) {
        VerbHandlers.use({ verb: 'use', noun1: 'shovel', noun2: null });
      } else {
        UI.printNarration("You need something to dig with. Your fingernails won't cut it.");
      }
    },

    eat: function (parsed) {
      if (!parsed.noun1) {
        UI.printNarration("Eat what? You're hungry, but not that desperate.");
        return;
      }
      // Treat as "use" for consumable items
      VerbHandlers.use({ verb: 'use', noun1: parsed.noun1, noun2: null });
    }
  };

  // ========================================================================
  // USE X WITH Y / GIVE X TO Y / SHOW X TO Y
  // ========================================================================
  function handleUseWith(target1, target2) {
    var item1 = target1.obj;
    var item2 = target2.obj;

    // Check item combinations (data-driven)
    if (item1 && item1.useWith && item1.useWith[target2.id]) {
      executeCombination(item1, item1.useWith[target2.id], target1.id, target2.id);
      return;
    }

    // Check reverse combination
    if (item2 && item2.useWith && item2.useWith[target1.id]) {
      executeCombination(item2, item2.useWith[target1.id], target2.id, target1.id);
      return;
    }

    // Check puzzle system for combinations
    if (GameData.puzzles) {
      var puzzleKeys = Object.keys(GameData.puzzles);
      for (var p = 0; p < puzzleKeys.length; p++) {
        var puzzle = GameData.puzzles[puzzleKeys[p]];
        if (puzzle.useWith) {
          var comboKey = target1.id + '+' + target2.id;
          var comboKeyR = target2.id + '+' + target1.id;
          if (puzzle.useWith[comboKey] || puzzle.useWith[comboKeyR]) {
            var combo = puzzle.useWith[comboKey] || puzzle.useWith[comboKeyR];
            if (combo.condition && !checkCondition(combo.condition)) {
              UI.printNarration(combo.failMessage || randomError());
              return;
            }
            UI.printNarration(combo.message);
            if (combo.effects) applyEffects(combo.effects);
            return;
          }
        }
      }
    }

    var name1 = item1 ? item1.name : target1.id;
    var name2 = item2 ? item2.name : target2.id;
    UI.printNarration("Using the " + name1 + " with the " + name2 + " doesn't do anything. But it was fun to try.");
  }

  function executeCombination(sourceItem, combo, sourceId, targetId) {
    // Check conditions
    if (combo.condition && !checkCondition(combo.condition)) {
      UI.printNarration(combo.failMessage || randomError());
      return;
    }

    // Print the result message
    UI.printNarration(combo.message);

    // Apply flag changes
    if (combo.setsFlag) {
      if (typeof combo.setsFlag === 'string') {
        Player.flags[combo.setsFlag] = true;
      } else if (typeof combo.setsFlag === 'object') {
        var flagKeys = Object.keys(combo.setsFlag);
        for (var f = 0; f < flagKeys.length; f++) {
          Player.flags[flagKeys[f]] = combo.setsFlag[flagKeys[f]];
        }
      }
    }

    // Handle item consumption
    if (combo.consumesBoth) {
      removeFromInventory(sourceId);
      removeFromInventory(targetId);
      removeItemFromRoom(sourceId);
      removeItemFromRoom(targetId);
    } else {
      if (combo.consumesSelf) {
        removeFromInventory(sourceId);
        removeItemFromRoom(sourceId);
      }
      if (combo.consumesOther) {
        removeFromInventory(targetId);
        removeItemFromRoom(targetId);
      }
    }

    // Handle result item
    if (combo.result) {
      addToInventory(combo.result);
      var resultItem = getItem(combo.result);
      if (resultItem) {
        UI.printNarration("You now have: " + resultItem.name + ".");
      }
    }

    // Handle additional effects
    if (combo.effects) {
      applyEffects(combo.effects);
    }

    // Handle triggersPuzzle (data files use this to reference puzzle events)
    if (combo.triggersPuzzle) {
      var puzzle = getPuzzle(combo.triggersPuzzle);
      if (puzzle && puzzle.onTrigger) {
        puzzle.triggered = true;
        triggerEvent(puzzle.onTrigger, puzzle);
      } else if (GameData.events && GameData.events[combo.triggersPuzzle]) {
        triggerEvent(combo.triggersPuzzle, null);
      }
    }

    checkTriggers();
  }

  function handleGiveTo(itemRef, npcRef) {
    var item = itemRef.obj;
    var npc = npcRef.obj;

    // Check NPC's receivable items (data-driven)
    if (npc.receives && npc.receives[itemRef.id]) {
      var reaction = npc.receives[itemRef.id];

      // Check conditions
      if (reaction.condition && !checkCondition(reaction.condition)) {
        UI.printNarration(reaction.failMessage || npc.name + " doesn't want that right now.");
        return;
      }

      UI.printNarration(reaction.message);
      if (reaction.consumesItem !== false) {
        removeFromInventory(itemRef.id);
      }
      if (reaction.givesItem) {
        addToInventory(reaction.givesItem);
        var givenItem = getItem(reaction.givesItem);
        if (givenItem) {
          UI.printNarration("You receive: " + givenItem.name + ".");
        }
      }
      if (reaction.setsFlag) {
        if (typeof reaction.setsFlag === 'string') {
          Player.flags[reaction.setsFlag] = true;
        } else {
          var fkeys = Object.keys(reaction.setsFlag);
          for (var fi = 0; fi < fkeys.length; fi++) {
            Player.flags[fkeys[fi]] = reaction.setsFlag[fkeys[fi]];
          }
        }
      }
      if (reaction.effects) {
        applyEffects(reaction.effects);
      }
      checkTriggers();
      return;
    }

    // Check item's useWith for NPC targets
    if (item.useWith && item.useWith[npcRef.id]) {
      executeCombination(item, item.useWith[npcRef.id], itemRef.id, npcRef.id);
      return;
    }

    UI.printNarration(npc.name + " doesn't want the " + item.name + ".");
  }

  function handleShowTo(itemRef, npcRef) {
    var item = itemRef.obj;
    var npc = npcRef.obj;

    // Check NPC's showReaction (data-driven)
    if (npc.showReaction && npc.showReaction[itemRef.id]) {
      var reaction = npc.showReaction[itemRef.id];
      if (reaction.condition && !checkCondition(reaction.condition)) {
        UI.printNarration(reaction.failMessage || npc.name + " isn't impressed.");
        return;
      }
      UI.printNarration(reaction.message);
      if (reaction.setsFlag) {
        if (typeof reaction.setsFlag === 'string') {
          Player.flags[reaction.setsFlag] = true;
        } else {
          var fkeys = Object.keys(reaction.setsFlag);
          for (var fk = 0; fk < fkeys.length; fk++) {
            Player.flags[fkeys[fk]] = reaction.setsFlag[fkeys[fk]];
          }
        }
      }
      if (reaction.effects) applyEffects(reaction.effects);
      checkTriggers();
      return;
    }

    UI.printNarration(npc.name + " looks at the " + item.name + " and shrugs.");
  }

  // ========================================================================
  // EFFECTS SYSTEM
  // ========================================================================
  function applyEffects(effects) {
    if (!effects) return;
    if (!Array.isArray(effects)) effects = [effects];

    for (var i = 0; i < effects.length; i++) {
      var eff = effects[i];
      switch (eff.type) {
        case 'setFlag':
          Player.flags[eff.flag] = eff.value !== undefined ? eff.value : true;
          break;
        case 'addItem':
          addToInventory(eff.item);
          break;
        case 'removeItem':
          removeFromInventory(eff.item);
          break;
        case 'addItemToRoom':
          addItemToRoom(eff.item, eff.room);
          break;
        case 'removeItemFromRoom':
          removeItemFromRoom(eff.item);
          break;
        case 'moveNPC':
          var npc = getNPC(eff.npc);
          if (npc) {
            // Remove from old room
            if (npc.location) {
              var oldRoom = getRoom(npc.location);
              if (oldRoom && oldRoom.npcs) {
                var npcIdx = oldRoom.npcs.indexOf(eff.npc);
                if (npcIdx !== -1) oldRoom.npcs.splice(npcIdx, 1);
              }
            }
            // Add to new room
            npc.location = eff.room;
            if (eff.room) {
              var newRoom = getRoom(eff.room);
              if (newRoom) {
                if (!newRoom.npcs) newRoom.npcs = [];
                if (newRoom.npcs.indexOf(eff.npc) === -1) {
                  newRoom.npcs.push(eff.npc);
                }
              }
            }
          }
          break;
        case 'addMoney':
          Player.flags.pieces_of_eight += eff.amount;
          break;
        case 'removeMoney':
          Player.flags.pieces_of_eight = Math.max(0, Player.flags.pieces_of_eight - eff.amount);
          break;
        case 'print':
          UI.printNarration(eff.text);
          break;
        case 'dialogue':
          DialogueSystem.startDialogue(eff.dialogueId, null);
          break;
        case 'teleport':
          Player.location = eff.room;
          UI.printSeparator();
          describeRoom(Player.location);
          break;
        case 'combat':
          CombatSystem.startFight(eff.opponent || 'random');
          break;
        case 'score':
          Player.score += eff.amount || 0;
          break;
        case 'registerTimed':
          registerTimedItem(eff.item, eff.turns);
          break;
        case 'addNPCToRoom':
          var addRoom = getRoom(eff.room);
          if (addRoom) {
            if (!addRoom.npcs) addRoom.npcs = [];
            if (addRoom.npcs.indexOf(eff.npc) === -1) {
              addRoom.npcs.push(eff.npc);
            }
          }
          break;
        case 'removeNPCFromRoom':
          var remRoom = getRoom(eff.room);
          if (remRoom && remRoom.npcs) {
            var ri = remRoom.npcs.indexOf(eff.npc);
            if (ri !== -1) remRoom.npcs.splice(ri, 1);
          }
          break;
      }
    }
  }

  // ========================================================================
  // EVENT TRIGGER SYSTEM
  // ========================================================================
  function triggerEvent(eventId, context) {
    if (typeof eventId === 'function') {
      return eventId(Player, Game, Engine);
    }
    if (typeof eventId === 'string' && GameData.events && GameData.events[eventId]) {
      var evt = GameData.events[eventId];
      if (evt.condition && !checkCondition(evt.condition)) return;
      if (evt.message) UI.printNarration(evt.message);
      if (evt.effects) applyEffects(evt.effects);
      if (evt.dialogue) DialogueSystem.startDialogue(evt.dialogue, null);
      return evt.result || undefined;
    }
    if (typeof eventId === 'object') {
      if (eventId.message) UI.printNarration(eventId.message);
      if (eventId.effects) applyEffects(eventId.effects);
      if (eventId.dialogue) DialogueSystem.startDialogue(eventId.dialogue, null);
      return eventId.result || undefined;
    }
  }

  // ========================================================================
  // PUZZLE TRIGGER CHECKS
  // ========================================================================
  function checkTriggers() {
    if (!GameData.puzzles) return;

    var puzzleKeys = Object.keys(GameData.puzzles);
    for (var p = 0; p < puzzleKeys.length; p++) {
      var puzzle = GameData.puzzles[puzzleKeys[p]];
      if (puzzle.completed) continue;

      // Auto-triggered puzzles (check condition every turn)
      if (puzzle.autoCheck && puzzle.condition) {
        if (checkCondition(puzzle.condition)) {
          puzzle.completed = true;
          if (puzzle.onComplete) {
            triggerEvent(puzzle.onComplete, puzzle);
          }
        }
      }

      // Room-entry triggers
      if (puzzle.triggerRoom && puzzle.triggerRoom === Player.location) {
        if (!puzzle.condition || checkCondition(puzzle.condition)) {
          if (!puzzle.triggered) {
            puzzle.triggered = true;
            if (puzzle.onTrigger) {
              triggerEvent(puzzle.onTrigger, puzzle);
            }
          }
        }
      }
    }

    // Check crew_complete computed flag
    if (Player.flags.crew_otis && Player.flags.crew_swordmaster && Player.flags.crew_meathook) {
      Player.flags.crew_complete = true;
    }
  }

  // ========================================================================
  // SAVE / LOAD SYSTEM
  // ========================================================================
  var SaveSystem = {
    save: function (slotName) {
      try {
        var state = {
          version: 1,
          timestamp: Date.now(),
          player: deepCopy(Player),
          roomStates: SaveSystem._getRoomStates(),
          npcStates: SaveSystem._getNPCStates(),
          gameMode: Game.mode,
          timedItems: deepCopy(Game.timedItems)
        };
        localStorage.setItem('monkey_save_' + slotName, JSON.stringify(state));
        return true;
      } catch (e) {
        UI.printError('Save failed: ' + e.message);
        return false;
      }
    },

    load: function (slotName) {
      try {
        var raw = localStorage.getItem('monkey_save_' + slotName);
        if (!raw) return false;
        var state = JSON.parse(raw);

        // Restore player
        var pKeys = Object.keys(state.player);
        for (var pk = 0; pk < pKeys.length; pk++) {
          Player[pKeys[pk]] = deepCopy(state.player[pKeys[pk]]);
        }

        // Restore room states
        if (state.roomStates) {
          SaveSystem._restoreRoomStates(state.roomStates);
        }

        // Restore NPC states
        if (state.npcStates) {
          SaveSystem._restoreNPCStates(state.npcStates);
        }

        // Restore game state
        Game.mode = GameMode.IDLE;
        Game.dialogueState = null;
        Game.combatState = null;
        Game.timedItems = state.timedItems || {};

        return true;
      } catch (e) {
        UI.printError('Load failed: ' + e.message);
        return false;
      }
    },

    autoSave: function () {
      SaveSystem.save('autosave');
    },

    listSaves: function () {
      var saves = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.indexOf('monkey_save_') === 0) {
          try {
            var data = JSON.parse(localStorage.getItem(key));
            saves.push({
              name: key.replace('monkey_save_', ''),
              timestamp: data.timestamp || 0
            });
          } catch (e) { /* skip malformed */ }
        }
      }
      saves.sort(function (a, b) { return b.timestamp - a.timestamp; });
      return saves;
    },

    deleteSave: function (slotName) {
      localStorage.removeItem('monkey_save_' + slotName);
    },

    _getRoomStates: function () {
      if (!GameData.rooms) return {};
      var states = {};
      var roomKeys = Object.keys(GameData.rooms);
      for (var r = 0; r < roomKeys.length; r++) {
        var room = GameData.rooms[roomKeys[r]];
        states[roomKeys[r]] = {
          items: room.items ? room.items.slice() : [],
          npcs: room.npcs ? room.npcs.slice() : []
        };
      }
      return states;
    },

    _restoreRoomStates: function (states) {
      if (!GameData.rooms) return;
      var keys = Object.keys(states);
      for (var k = 0; k < keys.length; k++) {
        var room = GameData.rooms[keys[k]];
        if (room) {
          room.items = states[keys[k]].items ? states[keys[k]].items.slice() : [];
          room.npcs = states[keys[k]].npcs ? states[keys[k]].npcs.slice() : [];
        }
      }
    },

    _getNPCStates: function () {
      if (!GameData.npcs) return {};
      var states = {};
      var npcKeys = Object.keys(GameData.npcs);
      for (var n = 0; n < npcKeys.length; n++) {
        var npc = GameData.npcs[npcKeys[n]];
        states[npcKeys[n]] = {
          location: npc.location,
          talkCount: npc.talkCount || 0
        };
      }
      return states;
    },

    _restoreNPCStates: function (states) {
      if (!GameData.npcs) return;
      var keys = Object.keys(states);
      for (var k = 0; k < keys.length; k++) {
        var npc = GameData.npcs[keys[k]];
        if (npc) {
          npc.location = states[keys[k]].location;
          npc.talkCount = states[keys[k]].talkCount || 0;
        }
      }
    }
  };

  // ========================================================================
  // COMMAND DISPATCH
  // ========================================================================
  function processCommand(raw) {
    // In dialogue mode, forward to dialogue system
    if (Game.mode === GameMode.DIALOGUE) {
      DialogueSystem.handleInput(raw);
      return;
    }

    // In combat mode, forward to combat system
    if (Game.mode === GameMode.COMBAT) {
      CombatSystem.handleInput(raw);
      return;
    }

    // In cutscene mode, advance
    if (Game.mode === GameMode.CUTSCENE) {
      advanceCutscene();
      return;
    }

    // Parse the command
    var parsed = Parser.parse(raw);
    if (!parsed) return;

    // Unknown verb
    if (!parsed.verb) {
      UI.printError("I don't know the word '" + parsed.unknownWord + "'. I'm a pirate, not a dictionary.");
      return;
    }

    // Find handler
    var handler = VerbHandlers[parsed.verb];
    if (!handler) {
      UI.printError(randomError());
      return;
    }

    // Execute
    handler(parsed);

    // Increment turn counter for most verbs
    if (['go', 'take', 'use', 'give', 'open', 'push', 'pull', 'buy', 'show', 'wait', 'dig', 'eat'].indexOf(parsed.verb) !== -1) {
      if (parsed.verb !== 'go' && parsed.verb !== 'wait') {
        Player.turns++;
        tickTimedItems();
      }
    }
  }

  // ========================================================================
  // CUTSCENE SYSTEM
  // ========================================================================
  function startCutscene(lines) {
    Game.mode = GameMode.CUTSCENE;
    Game.cutsceneQueue = lines.slice();
    advanceCutscene();
  }

  function advanceCutscene() {
    if (Game.cutsceneQueue.length === 0) {
      Game.mode = GameMode.IDLE;
      UI.setInputPlaceholder('What do you do?');
      return;
    }
    var line = Game.cutsceneQueue.shift();
    if (typeof line === 'string') {
      UI.printNarration(line);
    } else if (line.speaker) {
      UI.printDialogue(line.speaker, line.text);
    }
    if (Game.cutsceneQueue.length > 0) {
      UI.setInputPlaceholder('[Press Enter to continue]');
    } else {
      Game.mode = GameMode.IDLE;
      UI.setInputPlaceholder('What do you do?');
    }
  }

  // ========================================================================
  // UTILITY
  // ========================================================================
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ========================================================================
  // PUBLIC ENGINE API (exposed for data files and other modules)
  // ========================================================================
  Engine.Player = Player;
  Engine.Game = Game;
  Engine.GameMode = GameMode;

  Engine.processCommand = processCommand;
  Engine.describeRoom = describeRoom;
  Engine.movePlayer = movePlayer;
  Engine.addToInventory = addToInventory;
  Engine.removeFromInventory = removeFromInventory;
  Engine.hasItem = hasItem;
  Engine.addItemToRoom = addItemToRoom;
  Engine.removeItemFromRoom = removeItemFromRoom;
  Engine.resolveNoun = resolveNoun;
  Engine.checkCondition = checkCondition;
  Engine.applyEffects = applyEffects;
  Engine.triggerEvent = triggerEvent;
  Engine.checkTriggers = checkTriggers;
  Engine.startCutscene = startCutscene;
  Engine.registerTimedItem = registerTimedItem;
  Engine.displayInventory = displayInventory;
  Engine.setFlag = function (flag, value) {
    Player.flags[flag] = value !== undefined ? value : true;
  };
  Engine.getFlag = function (flag) {
    return Player.flags[flag];
  };
  Engine.getPlayerMoney = function () {
    return Player.flags.pieces_of_eight || 0;
  };
  Engine.deductPlayerMoney = function (amount) {
    Player.flags.pieces_of_eight = Math.max(0, (Player.flags.pieces_of_eight || 0) - amount);
    UI.printNarration("That cost you " + amount + " pieces of eight.");
  };
  Engine.givePlayerItem = function (itemId) {
    addToInventory(itemId);
    var item = getItem(itemId);
    var name = item ? item.name : itemId;
    UI.printNarration("You received: " + name);
  };
  Engine.getRoom = getRoom;
  Engine.getItem = getItem;
  Engine.getNPC = getNPC;
  Engine.getDialogue = getDialogue;
  Engine.getPuzzle = getPuzzle;
  Engine.deepCopy = deepCopy;
  Engine.capitalize = capitalize;
  Engine.SaveSystem = SaveSystem;

  // ========================================================================
  // INITIALIZATION
  // ========================================================================
  Engine.init = function () {
    if (Game.initialized) return;
    Game.initialized = true;

    UI.init();

    // Initialize room graphics canvas
    if (window.Graphics && Graphics.init) {
      Graphics.init('room-canvas');
    }

    // Display welcome banner
    UI.printSystem('╔══════════════════════════════════════════════════╗');
    UI.printSystem('║     THE SECRET OF MONKEY ISLAND — PART I       ║');
    UI.printSystem('║           The Three Trials                      ║');
    UI.printSystem('║                                                 ║');
    UI.printSystem('║  A text adventure in the Caribbean              ║');
    UI.printSystem('║  Type "help" for a list of commands             ║');
    UI.printSystem('╚══════════════════════════════════════════════════╝');
    UI.printBlank();

    // Show starting room
    describeRoom(Player.location);
  };

  // Auto-init when DOM is ready — run tape loader first if available
  function startWithLoader() {
    if (window.Loader && Loader.start) {
      Loader.start(Engine.init);
    } else {
      Engine.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWithLoader);
  } else {
    setTimeout(startWithLoader, 0);
  }

})();
