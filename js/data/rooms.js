/**
 * The Secret of Monkey Island — Room Definitions
 * All locations for Part I: The Three Trials
 */
window.GameData = window.GameData || {};

GameData.rooms = {

  // ═══════════════════════════════════════════════════════════════
  // LOOKOUT POINT (Opening Scene)
  // ═══════════════════════════════════════════════════════════════
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
    onEnter: null,
    onLook: "The view from up here is breathtaking. The whole of Mêlée Island stretches before you — a town huddled around a harbor, dense forests beyond, and the endless Caribbean glittering under moonlight.",
    graphic: [
      // ── SKY ──────────────────────────────────────────────────
      {cmd: 'fill', color: 'blue'},
      {cmd: 'rect', x: 0, y: 0, w: 256, h: 130},

      // ── OCEAN HORIZON (left side, lighter band) ──────────────
      {cmd: 'fill', color: 'cyan'},
      {cmd: 'poly', points: [[0,80],[90,78],[100,85],[85,100],[60,105],[0,110]]},

      // Ocean shimmer line
      {cmd: 'stroke', color: 'white'},
      {cmd: 'line', x1: 5, y1: 88, x2: 80, y2: 87},
      {cmd: 'line', x1: 15, y1: 95, x2: 65, y2: 94},

      // ── STARS (scattered cyan dots) ──────────────────────────
      {cmd: 'fill', color: 'cyan'},
      {cmd: 'dot', x: 20, y: 10},
      {cmd: 'dot', x: 55, y: 18},
      {cmd: 'dot', x: 40, y: 35},
      {cmd: 'dot', x: 12, y: 45},
      {cmd: 'dot', x: 80, y: 8},
      {cmd: 'dot', x: 110, y: 22},
      {cmd: 'dot', x: 135, y: 12},
      {cmd: 'dot', x: 160, y: 30},
      {cmd: 'dot', x: 95, y: 42},
      {cmd: 'dot', x: 200, y: 15},
      {cmd: 'dot', x: 230, y: 28},
      {cmd: 'dot', x: 175, y: 8},
      {cmd: 'dot', x: 145, y: 48},
      {cmd: 'dot', x: 60, y: 55},
      {cmd: 'dot', x: 25, y: 62},
      {cmd: 'dot', x: 105, y: 60},
      {cmd: 'dot', x: 210, y: 50},
      {cmd: 'dot', x: 240, y: 10},
      {cmd: 'dot', x: 72, y: 25},
      {cmd: 'fill', color: 'white'},
      {cmd: 'dot', x: 48, y: 6},
      {cmd: 'dot', x: 120, y: 38},
      {cmd: 'dot', x: 185, y: 20},
      {cmd: 'dot', x: 248, y: 40},

      // ── ROCKY CLIFF (large dark mass, left-center) ───────────
      {cmd: 'fill', color: 'black'},
      {cmd: 'poly', points: [
        [0,110],[20,98],[50,90],[75,88],[100,95],[120,100],
        [140,108],[150,115],[155,125],[140,130],[120,128],
        [90,132],[60,135],[30,130],[0,125]
      ]},

      // Cliff upper ridge detail
      {cmd: 'stroke', color: 'blue'},
      {cmd: 'line', x1: 20, y1: 99, x2: 50, y2: 91},
      {cmd: 'line', x1: 50, y1: 91, x2: 75, y2: 89},
      {cmd: 'line', x1: 75, y1: 89, x2: 100, y2: 96},
      {cmd: 'line', x1: 100, y1: 96, x2: 120, y2: 101},

      // ── STONE ARCHWAY (right side) ───────────────────────────
      // Arch left pillar
      {cmd: 'fill', color: 'red'},
      {cmd: 'stroke', color: 'yellow'},
      {cmd: 'poly', points: [[180,45],[195,42],[198,130],[195,192],[180,192],[178,130]], outline: true},

      // Arch right pillar
      {cmd: 'poly', points: [[230,48],[248,50],[256,192],[248,192],[245,130],[228,130]], outline: true},

      // Arch top curve (stones)
      {cmd: 'poly', points: [
        [180,45],[190,28],[200,18],[210,14],[220,16],[230,22],[240,35],[248,50],
        [238,55],[230,48],[222,38],[215,34],[208,33],[200,35],[195,42],[188,50]
      ], outline: true},

      // Arch keystone accent
      {cmd: 'fill', color: 'yellow'},
      {cmd: 'poly', points: [[205,16],[215,14],[218,24],[210,26],[204,22]]},

      // Stone detail lines on arch
      {cmd: 'stroke', color: 'yellow'},
      {cmd: 'line', x1: 183, y1: 70, x2: 196, y2: 70},
      {cmd: 'line', x1: 182, y1: 100, x2: 197, y2: 100},
      {cmd: 'line', x1: 184, y1: 140, x2: 196, y2: 140},
      {cmd: 'line', x1: 232, y1: 75, x2: 248, y2: 76},
      {cmd: 'line', x1: 233, y1: 110, x2: 249, y2: 111},
      {cmd: 'line', x1: 234, y1: 150, x2: 250, y2: 150},

      // Darkness inside arch
      {cmd: 'fill', color: 'black'},
      {cmd: 'poly', points: [
        [198,130],[198,55],[202,42],[208,36],[215,35],[222,40],[228,50],[228,130]
      ]},

      // ── CAMPFIRE (center-left) ───────────────────────────────
      // Fire glow base
      {cmd: 'fill', color: 'red'},
      {cmd: 'poly', points: [[108,110],[118,100],[128,105],[132,112],[125,118],[112,118]]},

      // Fire bright center
      {cmd: 'fill', color: 'yellow'},
      {cmd: 'poly', points: [[113,112],[118,103],[124,107],[126,114],[120,116],[114,116]]},

      // Fire tip
      {cmd: 'poly', points: [[117,105],[120,96],[122,103]]},

      // Sparks
      {cmd: 'fill', color: 'yellow'},
      {cmd: 'dot', x: 115, y: 93},
      {cmd: 'dot', x: 122, y: 90},
      {cmd: 'dot', x: 126, y: 95},
      {cmd: 'dot', x: 110, y: 97},

      // ── GROUND / ROCKY TERRAIN (bottom) ──────────────────────
      // Main ground mass
      {cmd: 'fill', color: 'black'},
      {cmd: 'poly', points: [
        [0,125],[30,130],[60,135],[90,132],[120,128],[140,130],
        [155,125],[165,128],[175,130],[180,130],[180,192],
        [0,192]
      ]},

      // Right side ground
      {cmd: 'poly', points: [
        [198,135],[210,140],[220,138],[228,130],[228,192],[198,192]
      ]},

      // Rocky texture lines
      {cmd: 'stroke', color: 'blue'},
      {cmd: 'line', x1: 10, y1: 145, x2: 50, y2: 148},
      {cmd: 'line', x1: 30, y1: 160, x2: 80, y2: 158},
      {cmd: 'line', x1: 5, y1: 170, x2: 60, y2: 172},
      {cmd: 'line', x1: 100, y1: 140, x2: 140, y2: 138},
      {cmd: 'line', x1: 80, y1: 155, x2: 130, y2: 152},
      {cmd: 'line', x1: 110, y1: 168, x2: 165, y2: 170},
      {cmd: 'line', x1: 140, y1: 180, x2: 175, y2: 182},
      {cmd: 'line', x1: 200, y1: 150, x2: 225, y2: 148},
      {cmd: 'line', x1: 205, y1: 165, x2: 222, y2: 163},

      // Boulder shapes on cliff edge
      {cmd: 'fill', color: 'blue'},
      {cmd: 'stroke', color: 'cyan'},
      {cmd: 'poly', points: [[85,125],[95,120],[105,123],[102,130],[88,130]], outline: true},
      {cmd: 'poly', points: [[55,128],[65,122],[72,126],[68,134],[56,133]], outline: true},
      {cmd: 'poly', points: [[130,122],[142,118],[150,124],[146,130],[132,128]], outline: true},

      // ── RAILING (left of archway) ────────────────────────────
      {cmd: 'stroke', color: 'white'},
      {cmd: 'line', x1: 145, y1: 118, x2: 178, y2: 118},
      {cmd: 'line', x1: 150, y1: 118, x2: 150, y2: 130},
      {cmd: 'line', x1: 160, y1: 118, x2: 160, y2: 130},
      {cmd: 'line', x1: 170, y1: 118, x2: 170, y2: 130}
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MÊLÉE TOWN
  // ═══════════════════════════════════════════════════════════════
  "town_dock": {
    id: "town_dock",
    name: "Town Dock",
    description: "A weathered wooden dock stretches along the harbor. The smell of salt and tar hangs in the air. Moored ships creak softly in the tide. The cliff path leads north to the lookout, and the Scumm Bar lies to the south. A stone archway marks the entrance to town to the west.",
    exits: {
      north: "lookout",
      south: "scumm_bar_exterior",
      west: "town_archway"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_dock_end": {
    id: "town_dock_end",
    name: "End of Dock",
    description: "The far end of the dock. The wooden planks are damp and slippery. This is where ships come and go — when anyone's brave enough to sail, that is.",
    exits: {
      north: "town_dock"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "crew_complete+ship_bought": "Your crew is assembled here at the end of the dock. The Sea Monkey bobs in the water, looking... seaworthy. Mostly. Otis, Carla, and Meathook wait impatiently. It's time to set sail for Monkey Island."
    }
  },

  "scumm_bar_exterior": {
    id: "scumm_bar_exterior",
    name: "Outside the Scumm Bar",
    description: "You stand before the infamous Scumm Bar. The sounds of drunken revelry and breaking furniture drift through the door. A crudely painted sign reads 'SCUMM BAR' in letters that were probably straight when the painter started. The dock is to the north.",
    exits: {
      north: "town_dock",
      enter: "scumm_bar"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "scumm_bar": {
    id: "scumm_bar",
    name: "Scumm Bar",
    description: "The Scumm Bar is packed with pirates in various stages of inebriation. The air is thick with the smell of grog, sweat, and questionable cooking. A mangy dog lies in the corner. Pirates sit at tables, nursing mugs of the most caustic beverage known to man. A doorway leads east to the kitchen, and an important-looking back room lies to the north.",
    exits: {
      out: "scumm_bar_exterior",
      east: "scumm_bar_kitchen",
      north: "scumm_bar_backroom"
    },
    items: [],
    npcs: ["mancomb", "estevan", "loom_pirate", "bar_dog"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "ghost_ship_seen": "The Scumm Bar is deserted. Every pirate has fled. Empty mugs sit abandoned on the tables — five of them, still half-full of that corrosive grog. The silence is eerie after all that revelry. Only the faint drip of something caustic eating through a mug breaks the quiet."
    },
    stateItems: {
      "ghost_ship_seen": ["mug_1", "mug_2", "mug_3", "mug_4", "mug_5"]
    },
    stateNpcs: {
      "ghost_ship_seen": []
    }
  },

  "scumm_bar_kitchen": {
    id: "scumm_bar_kitchen",
    name: "Scumm Bar Kitchen",
    description: "The kitchen is a grimy affair. A huge pot of stew bubbles on a stove that hasn't been cleaned since the Crusades. A plank extends over a window where a bird sits, eyeing a fish. Hunks of meat hang from hooks. The cook shuffles about, occasionally stirring something unspeakable.",
    exits: {
      west: "scumm_bar"
    },
    items: ["meat", "pot", "fish"],
    npcs: ["cook"],
    flags: {},
    onEnter: "kitchen_sneak",
    onLook: "You notice a hunk of meat, a battered cooking pot, and a fish that a bird seems very interested in. There's also a barrel of grog in the corner.",
    stateDescriptions: {
      "ghost_ship_seen": "The kitchen is empty. The cook has gone. The stew still bubbles away on its own, as if it's achieved sentience. A barrel of grog sits in the corner, its contents slowly eating through whatever container holds them."
    },
    stateNpcs: {
      "ghost_ship_seen": []
    }
  },

  "scumm_bar_backroom": {
    id: "scumm_bar_backroom",
    name: "Back Room — Pirate Leaders",
    description: "Three important-looking pirates sit around a table in this dimly-lit back room. They wear the kind of hats that say 'We're in charge here.' A map of Mêlée Island is pinned to the wall behind them. The air smells of authority and grog.",
    exits: {
      south: "scumm_bar"
    },
    items: [],
    npcs: ["pirate_leaders"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "ghost_ship_seen": "The back room is empty. The pirate leaders have fled. Only the cook remains, sobbing into a pot of stew. The map of Mêlée Island still hangs on the wall, though it seems less relevant now that the Governor has been kidnapped."
    },
    stateNpcs: {
      "ghost_ship_seen": ["cook_crying"]
    }
  },

  "town_archway": {
    id: "town_archway",
    name: "Town Archway",
    description: "A stone archway topped with a clock tower marks the entrance to Mêlée Island's town proper. The clock hasn't told the right time in years — nobody cares enough to fix it. The dock is to the east, the main street to the west.",
    exits: {
      east: "town_dock",
      west: "town_street",
      north: "town_mapmaker"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_mapmaker": {
    id: "town_mapmaker",
    name: "Mapmaker's House",
    description: "A small, cluttered house that smells of ink and old parchment. Maps cover every wall — some accurate, some wildly speculative, and at least one that appears to be a drawing of a duck.",
    exits: {
      south: "town_archway"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_street": {
    id: "town_street",
    name: "Town Street",
    description: "The main street of Mêlée Town. Shops line both sides, their signs swinging in the sea breeze. A sneaky-looking citizen loiters on one corner, and a trio of pirates stand around a rat on the other. The shop is to the north, the jail to the south, and a dark alley lurks to the west.",
    exits: {
      east: "town_archway",
      north: "town_shop",
      south: "town_jail",
      west: "town_alley"
    },
    items: [],
    npcs: ["citizen", "street_pirates"],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_shop": {
    id: "town_shop",
    name: "Shopkeeper's Store",
    description: "A well-stocked shop crammed with pirate supplies. Swords, shovels, and sundries crowd the shelves. A safe sits behind the counter, looking important and locked. The shopkeeper eyes you with the weary suspicion of a man who's been robbed by every pirate on the island.",
    exits: {
      south: "town_street"
    },
    items: ["sword", "shovel", "breath_mints"],
    npcs: ["shopkeeper"],
    flags: {},
    onEnter: null,
    onLook: "Swords gleam on the wall. Shovels lean in a corner. A roll of breath mints sits on the counter. Behind the shopkeeper, a safe with a combination lock beckons."
  },

  "town_jail": {
    id: "town_jail",
    name: "Mêlée Island Jail",
    description: "A grim little jailhouse. One cell is occupied by a miserable-looking prisoner whose breath could strip paint at twenty paces. The smell is... memorable. Iron bars separate the free world from the incarcerated one.",
    exits: {
      north: "town_street"
    },
    items: [],
    npcs: ["otis"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "jail_lock_melted": "The jail cell door hangs open, its lock a melted puddle of slag on the floor. The grog did its work. Otis is free at last."
    }
  },

  "town_alley": {
    id: "town_alley",
    name: "Dark Alley",
    description: "A narrow, shadowy alley between two buildings. The kind of place where bad things happen to people, especially at this time of night. Rats scurry in the darkness, and the cobblestones are slick with something you'd rather not identify.",
    exits: {
      east: "town_street"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: "sheriff_alley_encounter",
    onLook: "It's dark. It's damp. It's exactly the sort of alley your mother warned you about.",
    stateNpcs: {
      "default": ["sheriff"],
      "sheriff_met": []
    }
  },

  "town_voodoo_exterior": {
    id: "town_voodoo_exterior",
    name: "Voodoo House",
    description: "A crooked little building with mystical symbols painted on every surface. Candles flicker in the windows despite the absence of any draft. A sign reads 'International House of Mojo.' The door is ajar, and an unsettling purple light spills out.",
    exits: {
      east: "town_street",
      enter: "town_voodoo"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_voodoo": {
    id: "town_voodoo",
    name: "Voodoo Lady's Chamber",
    description: "The interior is thick with incense and mystery. Shrunken heads dangle from the ceiling. Jars of unidentifiable substances line the shelves. A crystal ball glows on a table. The Voodoo Lady sits amid her collection of arcane bric-a-brac, watching you with knowing eyes. A rubber chicken with a pulley in the middle sits on a nearby table.",
    exits: {
      out: "town_voodoo_exterior"
    },
    items: ["rubber_chicken"],
    npcs: ["voodoo_lady"],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "town_church": {
    id: "town_church",
    name: "Church",
    description: "A small church with peeling paint and a crooked steeple. The pews are dusty from disuse — pirates aren't known for their regular church attendance. It's quiet in here. Too quiet.",
    exits: {
      south: "town_street"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: "The church is empty and peaceful. Stained glass windows cast colored light across empty pews. This place will probably be important later."
  },

  // ═══════════════════════════════════════════════════════════════
  // ISLAND MAP (Overworld)
  // ═══════════════════════════════════════════════════════════════
  "island_map": {
    id: "island_map",
    name: "Mêlée Island Map",
    description: "You stand at the crossroads of Mêlée Island. Paths wind off in every direction. The town lies to the south, a clearing to the west, and a fork in the road to the north. Further trails lead to the Governor's Mansion, the shore, and Stan's Shipyard.",
    exits: {
      town: "town_archway",
      clearing: "map_clearing",
      fork: "map_fork",
      mansion: "mansion_exterior",
      shore: "map_shore",
      shipyard: "stans_shipyard",
      bridge: "map_bridge"
    },
    items: [],
    npcs: ["wandering_pirates"],
    flags: {},
    onEnter: null,
    onLook: "A painted map sign shows the major landmarks of Mêlée Island. Someone has drawn a mustache on the Governor's portrait."
  },

  "map_clearing": {
    id: "map_clearing",
    name: "Clearing",
    description: "A grassy clearing in the forest. A striped circus tent dominates the open space, its pennants flapping listlessly in the breeze. Faint sounds of argument drift from inside. The island map lies back the way you came.",
    exits: {
      map: "island_map",
      enter: "circus"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "circus": {
    id: "circus",
    name: "Circus Tent",
    description: "Inside the tent, a cannon dominates the center ring. Sawdust covers the ground. Two men in ridiculous outfits are arguing loudly about who should get into the cannon. Neither seems eager to volunteer.",
    exits: {
      out: "map_clearing"
    },
    items: [],
    npcs: ["fettuccini_brothers"],
    flags: {},
    onEnter: null,
    onLook: "The cannon looks dangerous. The Fettuccini Brothers look desperate. This seems like an opportunity.",
    stateDescriptions: {
      "cannon_trick_done": "The circus tent is quieter now. The Fettuccini Brothers are still arguing, but with renewed enthusiasm since the cannon trick actually worked. There's a dent in the support pillar that wasn't there before."
    }
  },

  "map_fork": {
    id: "map_fork",
    name: "Fork in the Road",
    description: "The road forks here. One path leads north into the dense forest, another heads back to the island map. Pirates are known to wander this area, looking for trouble and someone to trade insults with.",
    exits: {
      map: "island_map",
      north: "forest_1"
    },
    items: [],
    npcs: ["wandering_pirates"],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "map_bridge": {
    id: "map_bridge",
    name: "Bridge",
    description: "A rickety wooden bridge spans a deep ravine. A fearsome troll blocks the way, demanding a toll from all who would cross. He doesn't look like he's in a negotiating mood.",
    exits: {
      south: "island_map",
      north: {
        room: "sword_trainer",
        requires: "troll_paid",
        failMessage: "The troll blocks your path. \"NONE SHALL PASS!!\" he bellows. You'll need to pay the toll first."
      }
    },
    items: [],
    npcs: ["troll"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "troll_paid": "The bridge is clear. The troll has gone, apparently satisfied with his red herring. You can cross freely now."
    },
    stateNpcs: {
      "troll_paid": []
    }
  },

  "sword_trainer": {
    id: "sword_trainer",
    name: "Captain Smirk's House",
    description: "A squat building with a sign reading 'Captain Smirk's Big Body Pirate Gym.' Prices are posted: Sword Training 30 pieces o' eight. The door looks sturdy, and the sounds of clanging metal come from inside.",
    exits: {
      south: "map_bridge"
    },
    items: [],
    npcs: ["captain_smirk"],
    flags: {},
    onEnter: null,
    onLook: null
  },

  // ═══════════════════════════════════════════════════════════════
  // FOREST PATHS
  // ═══════════════════════════════════════════════════════════════
  "forest_1": {
    id: "forest_1",
    name: "Forest — Yellow Flowers",
    description: "A winding forest path dappled with moonlight. Beautiful yellow Caniche Endormi flowers bloom alongside the trail. A small sign reads: 'Do not pick the flowers. By order of the Sheriff.' The path continues north and south.",
    exits: {
      south: "map_fork",
      north: "forest_2",
      west: "forest_campsite"
    },
    items: ["yellow_flowers"],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: "The yellow flowers are quite lovely. Picking them is technically illegal. But you're a pirate."
  },

  "forest_2": {
    id: "forest_2",
    name: "Dense Forest",
    description: "The forest is thick here. Ancient trees loom overhead, their gnarled branches blocking most of the moonlight. Every path looks the same. You're pretty sure you've seen that same rock three times now.",
    exits: {
      south: "forest_1",
      east: "forest_3"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "forest_3": {
    id: "forest_3",
    name: "Forest — Signpost",
    description: "A wooden signpost stands at the trail crossing. It seems to be holding up a crude drawbridge mechanism. The sign points in several directions, none of which seem particularly helpful.",
    exits: {
      west: "forest_2",
      east: {
        room: "forest_4",
        requires: "bridge_lowered",
        failMessage: "The bridge is raised. Maybe that signpost does something useful."
      }
    },
    items: [],
    npcs: [],
    flags: {},
    features: ["signpost"],
    onEnter: null,
    onLook: "The signpost looks like it might be connected to the bridge mechanism. Maybe you could push it."
  },

  "forest_4": {
    id: "forest_4",
    name: "Forest Bridge",
    description: "A narrow bridge spans a gorge in the forest. The wood creaks ominously underfoot, but it holds. The Swordmaster's clearing lies to the north.",
    exits: {
      west: "forest_3",
      north: "swordmaster_clearing"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "swordmaster_clearing": {
    id: "swordmaster_clearing",
    name: "Swordmaster's Clearing",
    description: "A hidden clearing deep in the forest. Swords of defeated challengers are stuck in the ground like a steel garden. In the center, the Swordmaster waits — Carla, the most feared blade on Mêlée Island. She does not look pleased to see you.",
    exits: {
      south: "forest_4"
    },
    items: [],
    npcs: ["swordmaster"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "swordmaster_defeated": "The clearing is peaceful now. The swords still stand in the ground, but Carla seems almost relaxed. She even gave you a T-shirt. Well, threw it at you."
    }
  },

  "forest_campsite": {
    id: "forest_campsite",
    name: "Campsite",
    description: "An abandoned campsite in the forest. The fire pit is cold. Someone left in a hurry — or was dragged away. A few scattered supplies suggest this was once a pirate's hideout. It's not anymore.",
    exits: {
      east: "forest_1"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  // ═══════════════════════════════════════════════════════════════
  // TREASURE HUNT PATH
  // ═══════════════════════════════════════════════════════════════
  "treasure_path_1": {
    id: "treasure_path_1",
    name: "Forest — Treasure Trail",
    description: "A twisting forest trail that matches the directions on the treasure map. The trees here are ancient, their trunks carved with the initials of would-be treasure hunters who came before you.",
    exits: {
      south: "map_fork",
      north: "treasure_path_2"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "treasure_path_2": {
    id: "treasure_path_2",
    name: "Forest — Red Flowers",
    description: "A field of vivid red flowers stretches before you. Unlike the yellow Caniche Endormi, these appear to be perfectly legal. They also appear to be perfectly useless. A trail leads east.",
    exits: {
      east: "treasure_x",
      south: "treasure_path_1"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  "treasure_x": {
    id: "treasure_x",
    name: "X Marks the Spot",
    description: "You've found it! A large X is painted on the ground, surrounded by a small fence and a plaque. The plaque reads: 'The Legendary Lost Treasure of Mêlée Island. This carefully reproduced piece of Mêlée Island history has delighted thousands of would-be pirates and their families for generations. Remember, there are other pirates on this island, SO GO EASY ON THE TREASURE.'",
    exits: {
      west: "treasure_path_2"
    },
    items: [],
    npcs: [],
    flags: {},
    features: ["x_marks_spot"],
    onEnter: null,
    onLook: "A marker reads: 'Here lies treasure of such unimaginable wealth... well, you'll just have to dig it up to believe it. (Paid for by the Mêlée Island Chamber of Commerce.)'"
  },

  // ═══════════════════════════════════════════════════════════════
  // SHORE & MEATHOOK'S ISLAND
  // ═══════════════════════════════════════════════════════════════
  "map_shore": {
    id: "map_shore",
    name: "Shore",
    description: "A rocky shore at the edge of Mêlée Island. A long cable stretches from a pole here across the water to a small island. The cable sways gently in the sea breeze. There's no bridge, no boat, and no obvious way across. Unless you had something with a pulley, perhaps.",
    exits: {
      map: "island_map"
    },
    items: [],
    npcs: [],
    flags: {},
    features: ["cable"],
    onEnter: null,
    onLook: "The cable looks sturdy enough. If only you had some way to hang from it and slide across..."
  },

  "meathook_island": {
    id: "meathook_island",
    name: "Meathook's Island",
    description: "A tiny island dominated by a weathered shack. This is the home of Meathook — a towering bald pirate with hooks for hands and a skull tattoo on his chest. He doesn't get many visitors. Probably by design.",
    exits: {
      shore: {
        room: "map_shore",
        requires: null,
        failMessage: null
      }
    },
    items: [],
    npcs: ["meathook"],
    flags: {},
    onEnter: null,
    onLook: null
  },

  // ═══════════════════════════════════════════════════════════════
  // GOVERNOR'S MANSION
  // ═══════════════════════════════════════════════════════════════
  "mansion_exterior": {
    id: "mansion_exterior",
    name: "Governor's Mansion — Exterior",
    description: "An imposing mansion surrounded by manicured gardens. Deadly piranha poodles patrol the grounds, their tiny legs carrying surprisingly vicious bodies. They yap menacingly at your approach. The front door is tantalizingly close, yet impossibly far.",
    exits: {
      map: "island_map",
      enter: {
        room: "mansion_interior",
        requires: "dogs_drugged",
        failMessage: "The piranha poodles snarl and snap. You're not getting past them without drugging them first. On those helpless dogs? ...Yes."
      }
    },
    items: [],
    npcs: ["piranha_poodles"],
    flags: {},
    onEnter: null,
    onLook: null,
    stateDescriptions: {
      "dogs_drugged": "The piranha poodles lie snoring peacefully on the lawn, twitching in their doggy dreams. The path to the mansion door is clear."
    }
  },

  "mansion_interior": {
    id: "mansion_interior",
    name: "Governor's Mansion — Interior",
    description: "The Governor's mansion is lavishly decorated. Fine art and expensive furniture fill the rooms. A display case on the wall holds the Idol of Many Hands — your target. The place reeks of wealth and good governance.",
    exits: {
      out: "mansion_exterior"
    },
    items: ["gopher_repellent"],
    npcs: [],
    flags: {},
    onEnter: "mansion_fight_scene",
    onLook: "The Idol of Many Hands sits in a locked display case. You'll need something to open it. A file, maybe."
  },

  "mansion_gaping_hole": {
    id: "mansion_gaping_hole",
    name: "Gaping Hole",
    description: "You peer down through a gaping hole in the wall. Far below, the display case with the Idol of Many Hands is visible. This is going to be... interesting.",
    exits: {
      up: "mansion_interior"
    },
    items: [],
    npcs: [],
    flags: {},
    onEnter: null,
    onLook: null
  },

  // ═══════════════════════════════════════════════════════════════
  // STAN'S SHIPYARD
  // ═══════════════════════════════════════════════════════════════
  "stans_shipyard": {
    id: "stans_shipyard",
    name: "Stan's Previously Owned Vessels",
    description: "A garish sign reads 'STAN'S PREVIOUSLY OWNED VESSELS' in letters that somehow manage to be both huge and tacky. Ships of varying seaworthiness bob in the water. Pennants snap in the breeze. Stan himself is here, arms waving wildly — he appears to have been born that way.",
    exits: {
      map: "island_map"
    },
    items: [],
    npcs: ["stan"],
    flags: {},
    onEnter: null,
    onLook: "Among the ships, one catches your eye — the Sea Monkey, the only ship ever to make it to Monkey Island and come back. It's not pretty, but it's legendary."
  },

  // ═══════════════════════════════════════════════════════════════
  // SPECIAL / TRANSITIONAL ROOMS
  // ═══════════════════════════════════════════════════════════════
  "underwater": {
    id: "underwater",
    name: "Underwater",
    description: "You're at the bottom of the harbor, tied to the Idol of Many Hands. Fish swim past your face. Crabs eye your fingers speculatively. Remember: you can hold your breath for ten minutes. The clock is ticking.",
    exits: {
      up: "town_dock"
    },
    items: ["idol_of_many_hands"],
    npcs: [],
    flags: {},
    onEnter: "underwater_timer",
    onLook: "Dangerous-looking swords and cutlasses lie on the sea floor, tantalizingly just out of reach. The Idol of Many Hands is tied to your feet. Maybe you can pick it up..."
  },

  "cutscene_lechuck": {
    id: "cutscene_lechuck",
    name: "LeChuck's Ship",
    description: "Deep beneath Monkey Island, the ghost pirate LeChuck's ship lies anchored in a river of lava. The air shimmers with unholy heat. Bone pirates shuffle about the deck, and LeChuck himself stands at the helm, plotting terrible things.",
    exits: {},
    items: [],
    npcs: [],
    flags: {},
    onEnter: "lechuck_cutscene",
    onLook: null
  },

  "sea_monkey": {
    id: "sea_monkey",
    name: "The Sea Monkey",
    description: "You stand on the deck of the Sea Monkey, your very own ship. Sure, she's a bit rough around the edges. Okay, she's a lot rough. But she's YOURS. The open sea beckons, and Monkey Island awaits. Your crew is assembled and ready to sail.",
    exits: {},
    items: [],
    npcs: [],
    flags: {},
    onEnter: "end_part_one",
    onLook: "The Sea Monkey creaks ominously. A pole has already fallen off. Maybe you should have gotten that extended warranty after all."
  }
};
