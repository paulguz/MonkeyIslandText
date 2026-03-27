/**
 * The Secret of Monkey Island — NPC Definitions
 * All non-player characters for Part I: The Three Trials
 */
window.GameData = window.GameData || {};

GameData.npcs = {

  // ═══════════════════════════════════════════════════════════════
  // LOOKOUT POINT
  // ═══════════════════════════════════════════════════════════════
  "old_man": {
    id: "old_man",
    name: "Old Man",
    description: "A weathered old lookout. He seems to have been standing on this cliff since the island was formed. His eyes are milky, but they see more than you'd think.",
    location: "lookout",
    dialogue: "old_man_intro",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  // ═══════════════════════════════════════════════════════════════
  // SCUMM BAR
  // ═══════════════════════════════════════════════════════════════
  "mancomb": {
    id: "mancomb",
    name: "Mancomb Seepgood",
    description: "A friendly pirate with a tankard of grog and a willingness to chat. His name is Mancomb Seepgood, and he'll tell you all about the island if you let him.",
    location: "scumm_bar",
    dialogue: "mancomb_intro",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "estevan": {
    id: "estevan",
    name: "Estevan",
    description: "A scarred pirate with a haunted look in his one good eye. He sits alone, nursing his grog. Estevan takes the whole LeChuck thing VERY seriously.",
    location: "scumm_bar",
    dialogue: "estevan_lechuck",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "loom_pirate": {
    id: "loom_pirate",
    name: "Pirate with 'Ask me about LOOM' badge",
    description: "A bald pirate with a funny hat. He wears an 'Ask me about LOOM' badge prominently on his chest. His face is eager, as if he's just waiting for someone to bring it up.",
    location: "scumm_bar",
    dialogue: "loom_pirate_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "bar_dog": {
    id: "bar_dog",
    name: "Dog",
    description: "A mangy mutt lying in the corner of the Scumm Bar. It doesn't look friendly, but it doesn't look like it has the energy to be unfriendly either.",
    location: "scumm_bar",
    dialogue: "bar_dog_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "cook": {
    id: "cook",
    name: "Cook",
    description: "The Scumm Bar's cook. He shuffles around the kitchen stirring things and occasionally serving the pirates. He's not particularly observant, which works in your favor.",
    location: "scumm_bar_kitchen",
    dialogue: "cook_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: true,
    blockMessage: "The cook is between you and the kitchen supplies. Wait for him to go serve the pirates."
  },

  "cook_crying": {
    id: "cook_crying",
    name: "Cook",
    description: "The cook sits sobbing into a pot of stew. The Governor has been kidnapped, and his primary concern appears to be losing those convenient Health Board reports.",
    location: "scumm_bar_backroom",
    dialogue: "cook_kidnapping",
    talkCount: 0,
    conditions: {
      "ghost_ship_seen": true
    },
    blocking: false
  },

  // ═══════════════════════════════════════════════════════════════
  // PIRATE LEADERS (Back Room)
  // ═══════════════════════════════════════════════════════════════
  "pirate_leaders": {
    id: "pirate_leaders",
    name: "Important-Looking Pirates",
    description: "Three important-looking pirates sit around a table: one in blue, one in green, and one in black. They wear the biggest hats and the most serious expressions. These are the pirate leaders of Mêlée Island.",
    location: "scumm_bar_backroom",
    dialogue: "pirate_leaders_trials",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  // ═══════════════════════════════════════════════════════════════
  // TOWN NPCs
  // ═══════════════════════════════════════════════════════════════
  "citizen": {
    id: "citizen",
    name: "Citizen of Mêlée",
    description: "A sneaky-looking citizen with a parrot on his shoulder. He stands on the street corner with the nervous energy of someone selling something he probably shouldn't.",
    location: "town_street",
    dialogue: "citizen_map",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "street_pirates": {
    id: "street_pirates",
    name: "Men of Low Moral Fiber (pirates)",
    description: "Three pirates loiter on the street corner around a rat. One sits on a barrel, one is fat, and one is tall. They call themselves pirates, but they seem more interested in starting a circus.",
    location: "town_street",
    dialogue: "street_pirates_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "shopkeeper": {
    id: "shopkeeper",
    name: "Shopkeeper",
    description: "The shopkeeper is a grizzled old man with a suspicious nature and a keen eye for profit. He calls everyone 'fancy pants' and keeps a safe behind the counter that he thinks nobody notices.",
    location: "town_shop",
    dialogue: "shopkeeper_browse",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "otis": {
    id: "otis",
    name: "Otis",
    description: "A miserable prisoner in a jail cell. His breath is a biohazard, his cell is rat-infested, and his Aunt Tillie keeps sending carrot cake even though he hates it. He claims he's innocent. They all do.",
    location: "town_jail",
    dialogue: "otis_jail",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "sheriff": {
    id: "sheriff",
    name: "Sheriff Fester Shinetop",
    description: "Sheriff Fester Shinetop. He's mean, he's suspicious, and he has plans for the Governor that probably don't involve good governance. He doesn't like you. At all.",
    location: "town_alley",
    dialogue: "sheriff_alley",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "voodoo_lady": {
    id: "voodoo_lady",
    name: "Voodoo Lady",
    description: "The Voodoo Lady sits amid her collection of mystical artifacts, shrunken heads, and unidentifiable substances. She has a way of appearing and disappearing that's frankly unsettling. She knows your name before you tell her.",
    location: "town_voodoo",
    dialogue: "voodoo_fortune",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  // ═══════════════════════════════════════════════════════════════
  // ISLAND MAP NPCs
  // ═══════════════════════════════════════════════════════════════
  "wandering_pirates": {
    id: "wandering_pirates",
    name: "Wandering Pirate",
    description: "A rough-looking pirate wandering the island paths, looking for someone to fight. Or at least trade insults with.",
    location: "island_map",
    dialogue: "pirate_fight_intro",
    talkCount: 0,
    conditions: {
      "sword_training_done": true
    },
    blocking: false,
    isRandom: true,
    spawnLocations: ["island_map", "map_fork", "forest_1", "forest_2"]
  },

  "troll": {
    id: "troll",
    name: "Troll",
    description: "A large, imposing troll blocking the bridge. He wears a costume that's not fooling anyone and demands a toll from all who would pass. \"NONE SHALL PASS!!\" he bellows, with the confidence of someone who's been bellowing that for years.",
    location: "map_bridge",
    dialogue: "troll_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: true,
    blockMessage: "The troll blocks your path. You can't pass until you pay the toll!"
  },

  "captain_smirk": {
    id: "captain_smirk",
    name: "Captain Smirk",
    description: "A tough-looking sword trainer with a cigar and an attitude. He runs 'Captain Smirk's Big Body Pirate Gym' and claims to have fought alongside the legendary Swordmaster Carla at Port Royal.",
    location: "sword_trainer",
    dialogue: "smirk_training",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "fettuccini_brothers": {
    id: "fettuccini_brothers",
    name: "Fettuccini Brothers",
    description: "Alfredo and Bill Fettuccini, circus performers in ridiculous outfits. They've been arguing about who should get in the cannon for what seems like forever. They'd love a volunteer.",
    location: "circus",
    dialogue: "fettuccini_cannon",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "swordmaster": {
    id: "swordmaster",
    name: "Swordmaster Carla",
    description: "Carla, the Swordmaster of Mêlée Island. She's the most feared blade on the island, and she does NOT appreciate visitors. Especially ones who tracked dirt through her forest.",
    location: "swordmaster_clearing",
    dialogue: "swordmaster_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "meathook": {
    id: "meathook",
    name: "Meathook",
    description: "A towering bald pirate with a skull tattoo on his chest and two meathooks where his hands used to be. Despite his terrifying appearance, he's afraid of a parrot. He lives alone on a tiny island.",
    location: "meathook_island",
    dialogue: "meathook_intro",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "stan": {
    id: "stan",
    name: "Stan",
    description: "Stan of Stan's Previously Owned Vessels. His arms wave constantly, as if they have a life of their own. He could sell sand to a beach. He could sell water to the ocean. He WILL sell you a ship, whether you like it or not.",
    location: "stans_shipyard",
    dialogue: "stan_ships",
    talkCount: 0,
    conditions: {},
    blocking: false
  },

  "piranha_poodles": {
    id: "piranha_poodles",
    name: "Piranha Poodles",
    description: "Deadly piranha poodles. They look adorable and sound adorable, right up until they sink their teeth into you. The Governor's idea of home security.",
    location: "mansion_exterior",
    dialogue: null,
    talkCount: 0,
    conditions: {},
    blocking: true,
    blockMessage: "The piranha poodles snarl and snap at you. You're not getting past them without some clever plan.",
    isAnimal: true
  },

  "governor_marley": {
    id: "governor_marley",
    name: "Governor Elaine Marley",
    description: "Governor Elaine Marley. She's smart, she's capable, and she's the most powerful person on Mêlée Island. She also makes Guybrush completely forget how to form sentences.",
    location: null,
    dialogue: "governor_dialogue",
    talkCount: 0,
    conditions: {},
    blocking: false,
    notes: "Appears during mansion scene and at dock after underwater rescue."
  }
};
