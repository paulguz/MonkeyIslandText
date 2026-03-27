# The Secret of Monkey Island — Part I: The Three Trials
## Text Adventure Web App — Architecture Document

> *"I'm Guybrush Threepwood, and I'm a mighty pirate!"*

This document defines the complete technical architecture for a parser-based text adventure web app covering Part I of The Secret of Monkey Island. The aesthetic is 1980s home computer — think ZX Spectrum, C64, BBC Micro — green phosphor text on black, monospace everything, no graphics.

---

## 1. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Markup | Vanilla HTML5 | Single `index.html` entry point |
| Style | Vanilla CSS3 | Retro terminal aesthetic, no preprocessor |
| Logic | Vanilla ES6+ JavaScript | No framework, no bundler, no build step |
| Storage | `localStorage` | Save/load game state |
| Deployment | Static files | Drop on any web server or open `index.html` locally |

**Zero dependencies.** No npm, no webpack, no React. One folder, drag to browser, play.

### Retro Terminal Aesthetic
- Background: `#0a0a0a` (near-black)
- Text: `#33ff33` (phosphor green)
- Font: `"Courier New", "Lucida Console", monospace` at 16px
- Optional CRT scanline effect via CSS pseudo-elements
- Text appears character-by-character (typewriter effect) with configurable speed
- Blinking cursor: `█` block cursor after last line
- All uppercase option for extra retro feel (toggleable)

---

## 2. File Structure

```
MonkeyIsland/
├── index.html              # Entry point — loads all JS, contains game viewport
├── css/
│   └── style.css           # Retro terminal styling, CRT effects
├── js/
│   ├── engine.js           # Core game loop, command dispatch, state management
│   ├── parser.js           # Text parser — tokenizer, verb/noun extraction
│   ├── ui.js               # DOM interaction — text display, input, scrollback
│   ├── save.js             # Save/load to localStorage
│   └── data/
│       ├── rooms.js        # All room definitions (locations, exits, descriptions)
│       ├── items.js        # All item definitions (properties, combinations)
│       ├── npcs.js         # NPC definitions (dialogue, conditions)
│       ├── puzzles.js      # Puzzle logic and state machines
│       ├── insults.js      # Sword fighting insult/comeback tables
│       └── dialogue.js     # Conversation scripts and dialogue trees
└── Docs/
    └── architecture.md     # This file
```

All JS files use plain `<script>` tags (no modules needed — keep it simple). Data files expose global objects that the engine reads. Load order matters:

1. `data/*.js` (game content — must load first)
2. `parser.js` (text parsing)
3. `ui.js` (display layer)
4. `save.js` (persistence)
5. `engine.js` (ties everything together, starts game)

---

## 3. Room Map

### 3.1 Area Overview

The game world is divided into four major areas:

```
┌─────────────────────────────────────────────────┐
│                 MÊLÉE ISLAND MAP                │
│                  (overworld)                     │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Clearing/ │  │  Fork    │  │  Bridge/     │  │
│  │ Circus    │  │ (hub)    │──│  Sword       │  │
│  └──────────┘  └──────────┘  │  Trainer      │  │
│                     │        └──────────────┘  │
│  ┌──────────┐      │        ┌──────────────┐  │
│  │Stan's    │      │        │  Forest      │  │
│  │Shipyard  │      │        │  Paths →     │  │
│  └──────────┘      │        │  Swordmaster │  │
│                     │        └──────────────┘  │
│  ┌──────────┐      │        ┌──────────────┐  │
│  │Governor's│      │        │  Shore/      │  │
│  │Mansion   │      │        │  Meathook    │  │
│  └──────────┘      │        └──────────────┘  │
│                     │                           │
│  ┌──────────────────┴────────────────────────┐  │
│  │          MÊLÉE TOWN                       │  │
│  │  Lookout → Dock → Scumm Bar              │  │
│  │  Archway → Streets → Shops/Jail/Voodoo   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 3.2 Complete Room Definitions

#### LOOKOUT POINT (Opening Scene)
| ID | Name | Exits | Items | NPCs | Notes |
|----|------|-------|-------|------|-------|
| `lookout` | Lookout Point | south → `town_dock` | — | `old_man` | Opening scene. Panoramic view of Mêlée Island. |

#### MÊLÉE TOWN
| ID | Name | Exits | Items | NPCs | Notes |
|----|------|-------|-------|------|-------|
| `town_dock` | Town Dock | north → `lookout`, south → `scumm_bar_exterior`, west → `town_archway` | — | — | Dock area. Governor appears here late-game. |
| `scumm_bar_exterior` | Outside the Scumm Bar | north → `town_dock`, enter → `scumm_bar` | — | — | Exterior of the bar |
| `scumm_bar` | Scumm Bar | out → `scumm_bar_exterior`, east → `scumm_bar_kitchen`, north → `scumm_bar_backroom` | `mug` (×5, after LeChuck event) | `mancomb`, `estevan`, `loom_pirate`, `bar_dog` | Main bar room. Mugs appear on tables after ghost ship cutscene. |
| `scumm_bar_kitchen` | Scumm Bar Kitchen | west → `scumm_bar` | `meat`, `pot`, `fish` | `cook` | Must sneak in while cook is serving. Fish requires scaring the bird (rock the plank). |
| `scumm_bar_backroom` | Back Room — Pirate Leaders | south → `scumm_bar` | — | `pirate_leaders` | Three important-looking pirates explain the Three Trials. |
| `town_archway` | Town Archway | east → `town_dock`, west → `town_street`, north → `town_mapmaker` | — | — | Stone archway with clock tower |
| `town_street` | Town Street | east → `town_archway`, north → `town_shop`, south → `town_jail`, west → `town_alley` | — | `citizen`, `street_pirates` | Main shopping street. Citizen sells treasure map. Three pirates loiter. |
| `town_shop` | Shopkeeper's Store | south → `town_street` | `sword` (100po8), `shovel` (75po8), `breath_mints` (1po8) | `shopkeeper` | Items available for purchase. Safe behind counter (combination lock). |
| `town_jail` | Mêlée Island Jail | north → `town_street` | — | `otis`, `sheriff` (appears/disappears) | Otis is locked in cell. Grog melts the lock (timed). |
| `town_alley` | Dark Alley | east → `town_street` | — | `sheriff` (first visit only) | Sheriff Shinetop threatens Guybrush. |
| `town_voodoo_exterior` | Voodoo House | east → `town_street` | — | — | Exterior of the Voodoo Lady's establishment |
| `town_voodoo` | Voodoo Lady's Chamber | out → `town_voodoo_exterior` | `rubber_chicken` | `voodoo_lady` | Rubber chicken with a pulley in the middle. Fortune telling. |
| `town_church` | Church | — | — | — | Used later in Part IV (wedding). Present but empty in Part I. |
| `town_dock_end` | End of Dock | north → `town_dock` | — | — | Where crew gathers before sailing. Ship purchased from Stan docks here. |

#### ISLAND MAP (Overworld)
| ID | Name | Exits | Items | NPCs | Notes |
|----|------|-------|-------|------|-------|
| `map_clearing` | Clearing | map → `island_map` | — | — | Entrance to circus tent. |
| `circus` | Circus Tent | out → `map_clearing` | — | `fettuccini_brothers` | Cannon trick — need pot as helmet. Awards 478 pieces of eight. |
| `island_map` | Mêlée Island Map | town → `town_archway`, clearing → `map_clearing`, fork → `map_fork`, mansion → `mansion_exterior`, shore → `map_shore`, shipyard → `stans_shipyard` | — | `wandering_pirates` | Overworld hub. Random pirates appear for sword fights. |
| `map_fork` | Fork in the Road | map → `island_map`, north → `forest_1` | — | `wandering_pirates` | Hub for forest exploration. Pirates wander here for insult fights. |
| `forest_1` | Forest — Yellow Flowers | south → `map_fork`, north → `forest_2`, west → `forest_campsite` | `yellow_flowers` | — | Caniche Endormi flowers (illegal to pick — who cares). |
| `forest_2` | Dense Forest | south → `forest_1`, east → `forest_3` | — | — | Winding forest path |
| `forest_3` | Forest — Signpost | west → `forest_2`, east → `forest_4` | — | — | Signpost. Push it to lower bridge. |
| `forest_4` | Forest Bridge | west → `forest_3`, north → `swordmaster_clearing` | — | — | Bridge that must be lowered first (push signpost). |
| `swordmaster_clearing` | Swordmaster's Clearing | south → `forest_4` | — | `swordmaster` | Carla the Swordmaster. Must defeat her in insult sword fighting. |
| `forest_campsite` | Campsite | east → `forest_1` | — | — | Abandoned campsite |
| `treasure_path_1` | Forest — Treasure Trail | south → `map_fork` | — | — | Part of treasure map directions |
| `treasure_path_2` | Forest — Red Flowers | — | — | — | Field of red flowers, near X |
| `treasure_x` | X Marks the Spot | west → `treasure_path_2` | `treasure` (dig with shovel) | — | The legendary lost treasure of Mêlée Island |
| `map_bridge` | Bridge | north → `sword_trainer` | — | `troll` | Troll demands toll. Give fish to pass. |
| `sword_trainer` | Captain Smirk's House | south → `map_bridge` | — | `captain_smirk` | Sword training. Costs money. Must show sword. |
| `map_shore` | Shore | map → `island_map` | — | — | Cable stretches to small island |
| `meathook_island` | Meathook's Island | — | — | `meathook` | Use rubber chicken on cable to reach. Meathook recruitable for crew. |
| `mansion_exterior` | Governor's Mansion — Exterior | map → `island_map`, enter → `mansion_interior` (after dogs drugged) | — | `piranha_poodles` | Deadly piranha poodles guard entrance. Use drugged meat to pass. |
| `mansion_interior` | Governor's Mansion — Interior | out → `mansion_exterior` | `idol_of_many_hands`, `gopher_repellent` | `governor_marley` | Idol behind display case. Automatic fight scene triggers. |
| `mansion_gaping_hole` | Gaping Hole | up → `mansion_interior` | `idol_of_many_hands` (after file) | — | Jump down to retrieve idol using file from carrot cake |
| `stans_shipyard` | Stan's Previously Owned Vessels | map → `island_map` | — | `stan` | Buy the Sea Monkey. Requires note of credit. |

#### SPECIAL / TRANSITIONAL
| ID | Name | Notes |
|----|------|-------|
| `underwater` | Underwater | Thrown in by Sheriff. Get idol, walk up. |
| `cutscene_lechuck` | LeChuck's Ship (Cutscene) | Non-interactive. Ghost ship under Monkey Island. |
| `sea_monkey` | The Sea Monkey | Ship deck. End of Part I — sail away. |

### 3.3 Room State Changes

Several rooms change based on game flags:

| Room | Trigger | Change |
|------|---------|--------|
| `scumm_bar` | `ghost_ship_seen = true` | Cook is gone. Mugs appear on tables. Bar is emptier. |
| `scumm_bar_backroom` | `ghost_ship_seen = true` | Pirate leaders gone. Only cook remains, explains kidnapping. |
| `mansion_exterior` | `dogs_drugged = true` | Poodles asleep. Can enter mansion. |
| `town_jail` | `jail_lock_melted = true` | Cell door open. Otis is free (moves to dock). |
| `swordmaster_clearing` | `swordmaster_defeated = true` | Swordmaster gives T-shirt as proof. |
| `town_dock_end` | `crew_complete = true` AND `ship_bought = true` | Crew assembled, ship ready. Part I ends. |
| `map_bridge` | `troll_paid = true` | Troll is gone. Bridge is passable. |

---

## 4. Game Data Model

### 4.1 Room

```javascript
const ROOMS = {
  "lookout": {
    id: "lookout",
    name: "Lookout Point",
    description: "You stand on a high cliff overlooking the island. The moon casts a pale light over the Caribbean. Far below, you can see the lights of a small town and the masts of ships in the harbor. A weathered old man leans against a railing, gazing at the sea.",
    exits: {
      south: "town_dock"
    },
    items: [],
    npcs: ["old_man"],
    flags: {},
    onEnter: null,          // Optional callback ID for special entry logic
    onLook: null            // Optional extended look description
  },
  // ... all rooms follow this pattern
};
```

### 4.2 Item

```javascript
const ITEMS = {
  "pot": {
    id: "pot",
    name: "pot",
    description: "A battered old cooking pot. It's seen better days, but it could serve as a makeshift helmet in a pinch.",
    portable: true,
    location: "scumm_bar_kitchen",  // Starting location (room ID or "inventory")
    useWith: {
      "yellow_flowers": {
        result: "drugged_meat",     // What this combination produces (if applicable)
        message: "That doesn't make sense. The flowers go on the meat, not the pot.",
        failMessage: true
      }
    },
    aliases: ["cooking pot", "helmet"],
    hidden: false,                   // If true, not shown in room until discovered
    takeable: true,
    useAlone: null                   // Effect when "use pot" alone
  },
  "meat": {
    id: "meat",
    name: "hunk of meat",
    description: "A slab of meat of questionable origin. It smells... interesting.",
    portable: true,
    location: "scumm_bar_kitchen",
    useWith: {
      "yellow_flowers": {
        result: "drugged_meat",
        message: "You rub the yellow Caniche Endormi petals on the meat. It now has a lovely floral aroma and a powerful sedative effect.",
        consumesBoth: false,
        consumesSelf: true,
        consumesOther: true
      }
    },
    aliases: ["stew", "stewed meat"],
    takeable: true
  },
  "yellow_flowers": {
    id: "yellow_flowers",
    name: "yellow flowers",
    description: "Beautiful yellow Caniche Endormi flowers. Picking them is technically illegal, but you're a pirate.",
    portable: true,
    location: "forest_1",
    useWith: {
      "meat": {
        result: "drugged_meat",
        message: "You rub the yellow petals on the meat. The meat now smells floral and dangerous.",
        consumesBoth: true
      }
    },
    aliases: ["flowers", "petals", "caniche endormi"]
  },
  "drugged_meat": {
    id: "drugged_meat",
    name: "meat with condiment",
    description: "A hunk of meat liberally seasoned with yellow Caniche Endormi petals. One whiff and those poodles will be counting sheep.",
    portable: true,
    location: null, // Created by combination
    useWith: {
      "piranha_poodles": {
        message: "You toss the drugged meat to the poodles. They sniff it, devour it greedily, and within moments are snoring peacefully.",
        setsFlag: "dogs_drugged"
      }
    },
    aliases: ["drugged meat", "seasoned meat"]
  },
  // ... all items follow this pattern
};
```

### 4.3 NPC

```javascript
const NPCS = {
  "old_man": {
    id: "old_man",
    name: "Old Man",
    description: "A weathered old lookout. He seems to have been standing here since the island was formed.",
    location: "lookout",
    dialogue: "old_man_intro",    // References DIALOGUE table
    talkCount: 0,                  // How many times player has talked to NPC
    conditions: {},                // Flags that affect dialogue
    blocking: false                // If true, blocks an exit until resolved
  },
  // ... all NPCs follow this pattern
};
```

### 4.4 Player State

```javascript
const PLAYER = {
  location: "lookout",             // Current room ID
  inventory: [],                    // Array of item IDs
  flags: {
    // Trial completion
    trial_sword: false,             // Defeated Swordmaster
    trial_thievery: false,          // Got the idol
    trial_treasure: false,          // Found the treasure
    
    // Progress flags
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
    
    // Crew recruitment
    crew_otis: false,
    crew_swordmaster: false,
    crew_meathook: false,
    
    // Misc
    pieces_of_eight: 0,
    thrown_in_sea: false
  },
  
  // Sword fighting state
  insults_known: [],               // Array of insult IDs the player has learned
  comebacks_known: [],             // Array of comeback IDs the player has learned
  sword_wins: 0,                   // Number of sword fights won
  
  // Meta
  turns: 0,
  score: 0
};
```

### 4.5 Game Flags Summary

| Flag | Type | Purpose |
|------|------|---------|
| `pieces_of_eight` | Number | Currency. Start at 0. Circus gives 478. Spend on items. |
| `trial_sword` | Boolean | Completed when Swordmaster defeated |
| `trial_thievery` | Boolean | Completed when idol returned to pirate leaders |
| `trial_treasure` | Boolean | Completed when treasure returned to pirate leaders |
| `ghost_ship_seen` | Boolean | Triggers Part I phase 2: crew gathering + ship buying |
| `crew_complete` | Boolean | Computed: all three crew members recruited |
| `ship_bought` | Boolean | Sea Monkey purchased from Stan |

---

## 5. Parser Design

### 5.1 Verb Table

| Verb | Aliases | Pattern | Example |
|------|---------|---------|---------|
| `go` | walk, move, head, travel | `go [direction]` or just `[direction]` | `go north`, `north`, `n` |
| `look` | examine, inspect, read, check | `look`, `look at [noun]`, `examine [noun]` | `look at meat`, `examine pot` |
| `take` | get, pick up, grab, acquire | `take [noun]`, `pick up [noun]` | `take sword`, `pick up flowers` |
| `use` | — | `use [noun]`, `use [noun] with/on [noun]` | `use shovel`, `use meat with flowers` |
| `give` | hand, offer | `give [noun] to [noun]` | `give fish to troll` |
| `talk` | speak, chat, ask | `talk to [noun]` | `talk to pirate leaders` |
| `open` | unlock | `open [noun]` | `open door`, `open safe` |
| `push` | shove, press | `push [noun]` | `push plank`, `push signpost` |
| `pull` | yank | `pull [noun]` | `pull lever` |
| `buy` | purchase | `buy [noun]` | `buy sword` |
| `show` | present, display | `show [noun] to [noun]` | `show pot to brothers` |
| `inventory` | i, inv, items | `inventory` | `i` |
| `save` | — | `save` | `save` |
| `load` | restore | `load` | `load` |
| `help` | ? | `help` | `help` |
| `wait` | z | `wait` | `wait` |

### 5.2 Direction Shortcuts

| Full | Short |
|------|-------|
| north | n |
| south | s |
| east | e |
| west | w |
| up | u |
| down | d |
| enter | in |
| exit/leave | out |

### 5.3 Parser Algorithm

```
INPUT → lowercase → tokenize → remove articles (a, an, the)
  → identify verb (first token or known phrase like "pick up")
  → identify preposition (with, on, to, at, in, from)
  → extract noun1 (before preposition)
  → extract noun2 (after preposition)
  → resolve nouns against: room items, inventory, NPCs, room features
  → dispatch to verb handler with (noun1, noun2, context)
```

### 5.4 Noun Resolution Priority

1. Items in current room
2. Items in player inventory
3. NPCs in current room
4. Room features (door, plank, signpost, etc.)
5. Directions (for `go` verb)

### 5.5 Error Messages (Humorous)

Bad commands get pirate-themed responses, randomly selected:

```javascript
const ERROR_MESSAGES = [
  "That's not how pirating works.",
  "You can't do that. Believe me, I've tried.",
  "I don't understand. Try using smaller words.",
  "Even a three-headed monkey couldn't figure out what you mean.",
  "That doesn't work. But points for creativity.",
  "You can't get there from here. Or anywhere, really.",
  "I'd love to do that, but my hands are full of nothing.",
  "That's about as useful as a rubber chicken with a pulley in the middle.",
  "Nope. Try something that makes sense. Or at least less nonsense.",
  "I'm not sure what you're trying to do, but I admire your ambition."
];
```

Specific error types:
- **Unknown verb:** "I don't know the word '[word]'. I'm a pirate, not a dictionary."
- **Item not here:** "I don't see a [noun] here. Maybe it's behind you. A three-headed monkey!"
- **Can't take:** "You can't take the [noun]. It's not yours. ...Yet."
- **Wrong combination:** "Using the [X] with the [Y] doesn't do anything. But it was fun to try."
- **NPC not here:** "There's nobody called [noun] here. You're talking to yourself again."

---

## 6. Sword Fighting System

### 6.1 Overview

Insult sword fighting is combat via wit. No HP, no damage — just insults and comebacks. The entire system is dialogue-based.

### 6.2 Fight Flow

```
ENCOUNTER (random pirate on island map, or challenge Swordmaster)
  │
  ├─ Round starts
  │   ├─ 50% chance: Player insults → Pirate responds
  │   │   ├─ Player picks insult from known list
  │   │   ├─ If pirate knows correct comeback → Pirate scores
  │   │   └─ If pirate picks wrong comeback → Player scores
  │   │
  │   └─ 50% chance: Pirate insults → Player responds  
  │       ├─ Player picks comeback from known list
  │       ├─ If correct comeback → Player scores
  │       └─ If wrong comeback → Pirate scores
  │
  ├─ First to 3 points wins the fight
  │
  ├─ LEARNING: If player sees new insult (from pirate) → added to insults_known
  │            If player sees correct comeback → added to comebacks_known
  │
  └─ WIN → sword_wins++ (need ~5 wins to challenge Swordmaster)
```

### 6.3 Pirate Insults & Comebacks

These are used by random pirates on the island map:

| # | Insult | Correct Comeback |
|---|--------|-----------------|
| 1 | "This is the END for you, you gutter-crawling cur!" | "And I've got a little TIP for you, get the POINT?" |
| 2 | "Soon you'll be wearing my sword like a shish kebab!" | "First you better stop waving it like a feather-duster." |
| 3 | "My handkerchief will wipe up your blood!" | "So you got that job as janitor, after all." |
| 4 | "People fall at my feet when they see me coming." | "Even BEFORE they smell your breath?" |
| 5 | "I once owned a dog that was smarter than you." | "He must have taught you everything you know." |
| 6 | "You make me want to puke." | "You make me think somebody already did." |
| 7 | "Nobody's ever drawn blood from me and nobody ever will." | "You run THAT fast?" |
| 8 | "You fight like a dairy farmer." | "How appropriate. You fight like a cow." |
| 9 | "I got this scar on my face during a mighty struggle!" | "I hope now you've learned to stop picking your nose." |
| 10 | "Have you stopped wearing diapers yet?" | "Why, did you want to borrow one?" |
| 11 | "I've heard you were a contemptible sneak." | "Too bad no one's ever heard of YOU at all." |
| 12 | "You're no match for my brains, you poor fool." | "I'd be in real trouble if you ever used them." |
| 13 | "You have the manners of a beggar." | "I wanted to make sure you'd feel comfortable with me." |
| 14 | "I'm not going to take your insolence sitting down!" | "Your hemorrhoids are flaring up again, eh?" |
| 15 | "There are no words for how disgusting you are." | "Yes there are. You just never learned them." |
| 16 | "I've spoken with apes more polite than you." | "I'm glad to hear you attended your family reunion." |

### 6.4 Swordmaster Insults

The Swordmaster (Carla) uses **different insults** but the **same comebacks** work:

| # | Swordmaster Insult | Correct Comeback (same as pirates) |
|---|-------------------|-----------------------------------|
| 1 | "I've got a long, sharp lesson for you to learn today." | "And I've got a little TIP for you. Get the POINT?" |
| 2 | "My tongue is sharper than any sword." | "First you better stop waving it like a feather-duster." |
| 3 | "My name is feared in every dirty corner of this island!" | "So you got that job as a janitor, after all." |
| 4 | "My wisest enemies run away at the first sight of me!" | "Even BEFORE they smell your breath?" |
| 5 | "Only once have I met such a coward!" | "He must have taught you everything you know." |
| 6 | "If your brother's like you, better to marry a pig." | "You make me think somebody already has." |
| 7 | "No one will ever catch ME fighting as badly as you do." | "You run THAT fast?" |
| 8 | "I will milk every drop of blood from your body!" | "How appropriate. You fight like a cow." |
| 9 | "My last fight ended with my hands covered with blood." | "I hope now you've learned to stop picking your nose." |
| 10 | "I hope you have a boat ready for a quick escape." | "Why, did you want to borrow one?" |
| 11 | "My sword is famous all over the Caribbean!" | "Too bad no one's ever heard of YOU at all." |
| 12 | "I've got the courage and skill of a master swordsman!" | "I'd be in real trouble if you ever used them." |
| 13 | "Every word you say to me is stupid." | "I wanted to make sure you'd feel comfortable with me." |
| 14 | "You are a pain in the backside, sir!" | "Your hemorrhoids are flaring up again, eh?" |
| 15 | "There are no clever moves that can help you now." | "Yes there are. You just never learned them." |
| 16 | "Now I know what filth and stupidity really are." | "I'm glad to hear you attended your family reunion." |
| 17 | "I usually see people like you passed-out on tavern floors." | "Even BEFORE they smell your breath?" |

### 6.5 Data Structure

```javascript
const INSULTS = {
  pirate: [
    {
      id: "p1",
      insult: "This is the END for you, you gutter-crawling cur!",
      comeback_id: "c1"
    },
    // ... 16 total
  ],
  swordmaster: [
    {
      id: "sm1",
      insult: "I've got a long, sharp lesson for you to learn today.",
      comeback_id: "c1"   // Same comeback IDs — that's the trick!
    },
    // ... 17 total
  ],
  comebacks: {
    "c1": "And I've got a little TIP for you. Get the POINT?",
    "c2": "First you better stop waving it like a feather-duster.",
    "c3": "So you got that job as a janitor, after all.",
    "c4": "Even BEFORE they smell your breath?",
    "c5": "He must have taught you everything you know.",
    "c6": "You make me think somebody already did.",
    "c7": "You run THAT fast?",
    "c8": "How appropriate. You fight like a cow.",
    "c9": "I hope now you've learned to stop picking your nose.",
    "c10": "Why, did you want to borrow one?",
    "c11": "Too bad no one's ever heard of YOU at all.",
    "c12": "I'd be in real trouble if you ever used them.",
    "c13": "I wanted to make sure you'd feel comfortable with me.",
    "c14": "Your hemorrhoids are flaring up again, eh?",
    "c15": "Yes there are. You just never learned them.",
    "c16": "I'm glad to hear you attended your family reunion."
  }
};
```

### 6.6 Fight Mechanics

- **Random pirates:** Know a random subset of 3-6 insults. May or may not know correct comebacks. Difficulty scales with player progress.
- **Swordmaster:** Knows ALL her insults and ALL correct comebacks. Player must know enough comebacks to win 5 rounds (first to 5 for Swordmaster, not 3).
- **Learning:** When pirate insults player and player doesn't know the comeback, the correct comeback is revealed and added to `comebacks_known`. When player insults and pirate gives correct comeback, that comeback is also learned.
- **Gate:** Player needs `sword_wins >= 5` before the Swordmaster will fight. The shopkeeper or Voodoo Lady hints at this.

---

## 7. Key Puzzles

### 7.1 Puzzle Dependency Graph

```
START: Talk to pirate leaders → Learn Three Trials
  │
  ├── TRIAL 1: SWORDSMANSHIP ─────────────────────────────
  │   ├── Buy sword (100 po8) ← Need money ← Circus cannon trick
  │   │                                        └── Need pot (kitchen)
  │   ├── Train with Captain Smirk ← Need sword + money
  │   │                              └── Cross bridge ← Give fish to troll
  │   │                                                  └── Fish from kitchen
  │   ├── Fight random pirates (learn insults) ← Need sword training
  │   ├── Find Swordmaster ← Navigate forest path, push signpost
  │   └── Defeat Swordmaster ← Know enough insults/comebacks (5+ wins)
  │       └── GET: T-shirt (proof of swordsmanship)
  │
  ├── TRIAL 2: THIEVERY ──────────────────────────────────
  │   ├── Drug the poodles ← Use drugged meat
  │   │   └── Drugged meat ← yellow flowers + meat (from kitchen)
  │   │                       └── Flowers from forest
  │   ├── Enter Governor's Mansion → Automatic fight scene
  │   │   └── GET: gopher repellent (from mansion)
  │   ├── Get file from Otis ← Give breath mints → Give gopher repellent
  │   │   └── Breath mints from shopkeeper (1 po8)
  │   │   └── Gopher repellent from mansion
  │   │   └── GET: carrot cake → Use/eat cake → GET: file
  │   ├── Return to mansion → Use file on idol case
  │   │   └── GET: Idol of Many Hands
  │   └── Survive Sheriff encounter → Thrown in sea → Retrieve idol
  │       └── GET: Idol (proof of thievery)
  │
  ├── TRIAL 3: TREASURE HUNTERY ──────────────────────────
  │   ├── Buy treasure map (100 po8) ← From citizen on street
  │   ├── Buy shovel (75 po8) ← From shopkeeper
  │   ├── Follow map directions through forest
  │   └── Dig at X ← Use shovel on X
  │       └── GET: Legendary Lost Treasure (proof of treasure huntery)
  │
  └── PHASE 2: CREW & SHIP (after ghost ship cutscene) ──
      ├── Recruit Otis ← Melt jail lock with grog
      │   └── Grog from Scumm Bar mugs → Transfer between mugs (TIMED)
      │       └── Mugs from bar tables (5 available)
      ├── Recruit Swordmaster ← Just ask her (if defeated)
      ├── Recruit Meathook ← Use rubber chicken on cable → Touch the beast
      │   └── Rubber chicken from Voodoo Lady's shop
      └── Buy ship from Stan ← Need note of credit
          ├── Get note of credit from shopkeeper's safe
          │   ├── Watch shopkeeper open safe (learn combination)
          │   ├── Ask shopkeeper to look for Swordmaster (leaves shop)
          │   └── Open safe → GET: note of credit
          └── Bargain with Stan → Buy Sea Monkey
```

### 7.2 Puzzle Details

#### P1: Circus Cannon Trick
- **Trigger:** Talk to Fettuccini Brothers
- **Requires:** `pot` in inventory
- **Action:** `show pot to brothers` or `use pot`
- **Result:** 478 pieces of eight added. `cannon_trick_done = true`
- **One-shot:** Can only do this once

#### P2: Buy Treasure Map
- **Trigger:** Talk to citizen on street
- **Requires:** `pieces_of_eight >= 100`
- **Action:** `buy map` when talking to citizen
- **Result:** `treasure_map` added to inventory, 100 po8 deducted

#### P3: Buy Sword & Shovel
- **Trigger:** Browse shopkeeper's store
- **Requires:** Sword = 100 po8, Shovel = 75 po8
- **Action:** `buy sword`, `buy shovel`
- **Result:** Items added to inventory

#### P4: Bridge Troll
- **Trigger:** Attempt to cross bridge
- **Requires:** `fish` in inventory
- **Action:** `give fish to troll`
- **Result:** Troll satisfied, bridge passable. `troll_paid = true`
- **Humor:** "Mmm... it's got a nice 'red herring' flavor to it."

#### P5: Sword Training
- **Trigger:** Talk to Captain Smirk
- **Requires:** `sword` in inventory, money for training fee
- **Action:** `talk to captain` → training montage (text cutscene)
- **Result:** `sword_training_done = true`. Player can now fight pirates.

#### P6: Insult Sword Fighting → Swordmaster
- See Section 6 for full details
- **Gate:** `sword_wins >= 5` to challenge Swordmaster
- **Result:** `swordmaster_defeated = true`, receive T-shirt. `trial_sword = true`

#### P7: Drug the Poodles
- **Requires:** `yellow_flowers` + `meat` → `drugged_meat`
- **Action:** `use flowers with meat` (in inventory), then `give meat to poodles` or `use meat`
- **Result:** `dogs_drugged = true`, can enter mansion

#### P8: Get the Idol (Multi-step)
1. Give breath mints to Otis → `otis_has_mints = true`
2. Enter mansion (after drugging dogs) → automatic fight → get `gopher_repellent`
3. Give gopher repellent to Otis → he gives `carrot_cake`
4. `use carrot_cake` (eat it) → discover `file` inside
5. Return to mansion → `use file` on display case → get `idol_of_many_hands`
6. Sheriff throws you in sea → `use idol` underwater or `take idol` → walk up
7. `trial_thievery = true`

#### P9: Treasure Hunt
- **Requires:** `treasure_map`, `shovel`
- **Action:** Follow specific path through forest rooms (directions from map)
- **Final:** `use shovel` at X marks the spot → `treasure`. `trial_treasure = true`

#### P10: Grog Mug Relay (Timed Puzzle)
- **Context:** After ghost ship cutscene. Must free Otis from jail.
- **Mechanic:** Pick up mug from bar → `use mug with barrel` → grog dissolves mug over N turns
- **Action:** `use grog with mug` to transfer to fresh mug before current one dissolves
- **Timer:** Each mug lasts ~8 turns. Player must navigate bar → jail in time.
- **If mug dissolves:** "The grog eats through the mug and sizzles on the floor. You'll need another one."
- **Success:** `use mug with lock` at jail → lock melts. `jail_lock_melted = true`

#### P11: Stan's Ship Deal
1. Talk to Stan → learn about ships, mention buying on credit
2. Get Stan's business card
3. Go to shopkeeper → ask about note of credit
4. Watch shopkeeper open safe (memorize combination)
5. Ask shopkeeper to check on Swordmaster (he leaves)
6. `open safe` (player must have seen combination: `safe_combination_seen = true`)
7. `take note of credit`
8. Return to Stan → `give note of credit to Stan` → bargaining sequence
9. Buy Sea Monkey. `ship_bought = true`

#### P12: Recruit Crew
| Member | How | Flag |
|--------|-----|------|
| Otis | Melt jail lock with grog, ask him to join | `crew_otis = true` |
| Swordmaster (Carla) | Ask her to join (must have defeated her) | `crew_swordmaster = true` |
| Meathook | Use rubber chicken on cable at shore, touch the beast | `crew_meathook = true` |

---

## 8. Dialogue System

### 8.1 Format

```javascript
const DIALOGUE = {
  "old_man_intro": {
    speaker: "Old Man",
    type: "linear",           // linear = plays through, choice = player picks
    lines: [
      { speaker: "Guybrush", text: "Hi! My name's Guybrush Threepwood, and I want to be a pirate!" },
      { speaker: "Old Man", text: "Yikes! Don't sneak up on me like that!" },
      { speaker: "Guybrush", text: "Er... I'm over this way." },
      { speaker: "Old Man", text: "I see. So, you want to be a pirate, eh? You look more like a flooring inspector." },
      { speaker: "Old Man", text: "But if you're serious about pirating, go talk to the pirate leaders. You'll find them in the Scumm Bar." },
      { speaker: "Guybrush", text: "Gosh, thanks! I'm off to seek my fortune." }
    ],
    onComplete: null,
    repeatLine: "The Scumm Bar. Now stop wasting time and get going."
  },

  "pirate_leaders_trials": {
    speaker: "Pirate Leaders",
    type: "choice",
    intro: [
      { speaker: "Blue Pirate", text: "What be ye wantin' boy?" }
    ],
    choices: [
      {
        text: "I want to be a pirate.",
        response: [
          { speaker: "Blue Pirate", text: "So what?" },
          { speaker: "Black Pirate", text: "Hey, we're short on help because of this whole LeChuck thing." },
          { speaker: "Blue Pirate", text: "All right, but you don't become a pirate just by ASKING." },
          { speaker: "All", text: "The Three Trials!" }
        ],
        setsFlag: "knows_three_trials",
        unlocksChoices: ["trial_sword_info", "trial_thievery_info", "trial_treasure_info"]
      },
      {
        id: "trial_sword_info",
        text: "Tell me more about mastering the sword.",
        hidden: true,    // Only shows after unlocked
        response: [
          { speaker: "Blue Pirate", text: "First, get ye a sword. Then seek out and defeat the Sword Master." },
          { speaker: "Black Pirate", text: "Ha ha. Imagine trying without any training!" },
          { speaker: "All", text: "Har Har Har" }
        ]
      },
      {
        id: "trial_thievery_info",
        text: "Tell me more about the art of thievery.",
        hidden: true,
        response: [
          { speaker: "Green Pirate", text: "We want you to procure a small item for us..." },
          { speaker: "Blue Pirate", text: "The Idol of Many Hands..." },
          { speaker: "Black Pirate", text: "In the Governor's Mansion!" }
        ]
      },
      {
        id: "trial_treasure_info",
        text: "Tell me more about treasure hunting.",
        hidden: true,
        response: [
          { speaker: "Black Pirate", text: "Legend has it there's a treasure buried here on the island..." },
          { speaker: "Blue Pirate", text: "Find the Legendary Lost Treasure and bring it back here." },
          { speaker: "Green Pirate", text: "And don't forget: X marks the spot!" }
        ]
      },
      {
        text: "What's in that grog stuff, anyway?",
        response: [
          { speaker: "Green Pirate", text: "Grog is a secret mixture containing one or more of the following:" },
          { speaker: "Blue Pirate", text: "Kerosene, propylene glycol, artificial sweeteners, sulphuric acid, rum, acetone, red dye #2, scumm, axle grease, battery acid, and/or pepperoni." },
          { speaker: "Blue Pirate", text: "The stuff eats right through these mugs." }
        ]
      },
      {
        text: "I'll just be running along now.",
        response: [
          { speaker: "Green Pirate", text: "Come back later and tell us how ye're doing." }
        ],
        exits: true
      }
    ]
  },
  // ... more dialogue entries
};
```

### 8.2 Dialogue Types

| Type | Behavior |
|------|----------|
| `linear` | Plays all lines in sequence. On repeat visits, shows `repeatLine`. |
| `choice` | Player picks from available options. Choices can unlock other choices. |
| `conditional` | Lines shown/hidden based on game flags. |
| `one_shot` | Plays once, then NPC has nothing more to say (or shorter response). |

### 8.3 Key Conversations

| NPC | Dialogue ID | Key Info Delivered |
|-----|------------|-------------------|
| Old Man | `old_man_intro` | Go to Scumm Bar |
| Mancomb Seepgood | `mancomb_intro` | LeChuck backstory, Governor Marley |
| Estevan | `estevan_lechuck` | LeChuck's ghost ship, why pirates won't sail |
| Pirate Leaders | `pirate_leaders_trials` | The Three Trials explained |
| Voodoo Lady | `voodoo_fortune` | Prophecy — voyage, giant monkey, destiny |
| Sheriff Shinetop | `sheriff_alley` | Threat, establishes antagonist on island |
| Otis | `otis_jail` | Needs breath mints, has carrot cake, needs gopher repellent |
| Shopkeeper | `shopkeeper_browse` | Items for sale, safe combination scene |
| Citizen | `citizen_map` | Treasure map for sale (100 po8) |
| Fettuccini Brothers | `fettuccini_cannon` | Cannon trick, 478 po8 reward |
| Captain Smirk | `smirk_training` | Sword training (requires sword + fee) |
| Stan | `stan_ships` | Ship buying, credit, bargaining |
| Meathook | `meathook_intro` | Touch the beast challenge, crew recruitment |
| Cook (post-kidnapping) | `cook_kidnapping` | LeChuck kidnapped Governor, sets Phase 2 |

### 8.4 Humor Guidelines

Preserve the Ron Gilbert tone:
- **Deadpan absurdity:** Treat ridiculous situations as completely normal
- **Self-aware:** Guybrush knows he's in a weird situation
- **Running gags:** "Look behind you, a three-headed monkey!" (works once, then NPCs wise up)
- **Fourth wall:** Subtle nods ("I'm selling these fine leather jackets")
- **Understated reactions:** Guybrush responds to danger with mild inconvenience

---

## 9. Inventory & Item Combinations

### 9.1 Inventory Display

Command: `inventory`, `i`, or `inv`

```
You are carrying:
  - A hunk of meat
  - A cooking pot
  - A fish
  - 478 pieces of eight
```

### 9.2 Key Item Combinations

| Item A | Item B | Action/Context | Result |
|--------|--------|---------------|--------|
| `yellow_flowers` | `meat` | `use flowers with meat` | `drugged_meat` |
| `drugged_meat` | `piranha_poodles` | `give meat to poodles` | Dogs fall asleep (`dogs_drugged`) |
| `grog_mug` | `mug` | `use grog with mug` | Transfer grog to fresh mug (timed) |
| `grog_mug` | `jail_lock` | `use grog on lock` / `use mug on lock` | Lock melts (`jail_lock_melted`) |
| `file` | `idol_case` | `use file on case` | Get Idol of Many Hands |
| `rubber_chicken` | `cable` | `use chicken on cable` | Zip-line to Meathook's island |
| `pot` | — | `show pot to brothers` | Cannon trick (478 po8) |
| `fish` | `troll` | `give fish to troll` | Bridge toll paid |
| `breath_mints` | `otis` | `give mints to otis` | Otis grateful, dialogue advances |
| `gopher_repellent` | `otis` | `give repellent to otis` | Receive carrot cake |
| `carrot_cake` | — | `use cake` / `eat cake` | Discover file inside |
| `shovel` | `x_marks_spot` | `use shovel` / `dig` | Unearth treasure |
| `note_of_credit` | `stan` | `give note to Stan` | Begin ship purchase |
| `sword` | `captain_smirk` | `show sword to captain` | Begin training |

### 9.3 Special Items

| Item | Notes |
|------|-------|
| `pieces_of_eight` | Currency, tracked as number in player flags, not inventory item |
| `grog_mug` | Has a timer. Dissolves after N turns. Must transfer to fresh `mug`. |
| `rubber_chicken` | "A rubber chicken with a pulley in the middle." Iconic item. |
| `treasure_map` | When examined, shows cryptic directions for the forest path |
| `business_card` | Stan's card. Shows to shopkeeper to discuss credit. |
| `t_shirt` | Proof of defeating Swordmaster. "I defeated the Swordmaster and all I got was this lousy T-shirt." |

---

## 10. Save/Load System

### 10.1 Architecture

```javascript
const SaveSystem = {
  save(slotName) {
    const state = {
      version: 1,                    // Schema version for migration
      timestamp: Date.now(),
      player: { ...PLAYER },         // Deep copy of player state
      rooms: getRoomStates(),        // Only rooms with changed state
      npcs: getNPCStates(),          // NPC talk counts, locations
      flags: { ...GAME_FLAGS },      // Global game flags
      turnCount: GAME.turns
    };
    localStorage.setItem(`monkey_save_${slotName}`, JSON.stringify(state));
  },

  load(slotName) {
    const raw = localStorage.getItem(`monkey_save_${slotName}`);
    if (!raw) return false;
    const state = JSON.parse(raw);
    // Restore all state objects
    Object.assign(PLAYER, state.player);
    restoreRoomStates(state.rooms);
    restoreNPCStates(state.npcs);
    Object.assign(GAME_FLAGS, state.flags);
    GAME.turns = state.turnCount;
    // Re-render current room
    UI.clear();
    UI.displayRoom(ROOMS[PLAYER.location]);
    return true;
  },

  listSaves() {
    // Scan localStorage for monkey_save_* keys
    // Return array of { name, timestamp }
  },

  deleteSave(slotName) {
    localStorage.removeItem(`monkey_save_${slotName}`);
  }
};
```

### 10.2 Auto-save

- Auto-save on every room transition (slot: `autosave`)
- Player can manually save to named slots: `save my_game`
- Player loads with: `load my_game`
- `saves` command lists all save slots with timestamps

### 10.3 What Gets Saved

| Data | Details |
|------|---------|
| Player location | Current room ID |
| Inventory | Array of item IDs |
| Player flags | All boolean/number progress flags |
| Sword fighting state | Known insults, known comebacks, win count |
| Room states | Items removed, NPCs moved, doors opened |
| NPC states | Dialogue progress, location changes |
| Turn count | For scoring/stats |

---

## Appendix A: Game Flow Summary

```
OPENING
  Lookout Point → Old Man says go to Scumm Bar

SCUMM BAR  
  Talk to pirates → Talk to Leaders → Learn Three Trials
  Sneak into kitchen → Get meat, pot, fish

THREE TRIALS (any order)
  ├── Sword: Circus → money → buy sword → troll/bridge → train → fight pirates → defeat Swordmaster
  ├── Thief: Flowers + meat → drug poodles → mansion → mints/repellent/cake/file → get idol  
  └── Treasure: Buy map → buy shovel → follow directions → dig

GHOST SHIP CUTSCENE
  LeChuck kidnaps Governor Marley

PHASE 2: CREW & SHIP
  ├── Free Otis (grog relay puzzle)
  ├── Ask Swordmaster to join
  ├── Rubber chicken → Meathook's island → touch beast
  └── Shopkeeper's safe → note of credit → buy ship from Stan

SET SAIL → End of Part I
```

## Appendix B: Technical Notes

### State Machine

The game operates as a simple state machine:

```
IDLE (waiting for input)
  → PARSING (processing command)
    → EXECUTING (running verb handler)
      → NARRATING (displaying result text)
        → CHECK_TRIGGERS (puzzle completions, cutscenes)
          → IDLE
```

Special modes interrupt the loop:
- **DIALOGUE_MODE:** Player is in conversation. Input selects dialogue choices.
- **COMBAT_MODE:** Player is in insult sword fight. Input selects insults/comebacks.
- **CUTSCENE_MODE:** Non-interactive text plays out. Any key advances.
- **TIMED_MODE:** Grog mug puzzle. Turn counter ticking.

### UI Layout

```
┌────────────────────────────────────────────────┐
│  THE SECRET OF MONKEY ISLAND                   │  ← Title bar (fixed)
├────────────────────────────────────────────────┤
│                                                │
│  You are at the Lookout Point.                 │  ← Scrollback area
│  A weathered old man leans against a railing.  │     (auto-scrolls)
│  The town lies to the south.                   │
│                                                │
│  > talk to old man                             │
│                                                │
│  Old Man: "Ah! So you want to be a pirate,    │
│  eh? You look more like a flooring inspector." │
│                                                │
│  > _                                           │  ← Input line (blinking cursor)
├────────────────────────────────────────────────┤
│  Exits: south                                  │  ← Status bar (fixed)
└────────────────────────────────────────────────┘
```

### Performance

- No heavy computation — text games are tiny
- Scrollback buffer limited to ~500 lines (older text removed)
- Save files are small JSON blobs (< 10KB)
- All assets are text — total game size should be under 200KB
