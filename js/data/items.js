/**
 * The Secret of Monkey Island — Item Definitions
 * All collectible and interactive items for Part I: The Three Trials
 */
window.GameData = window.GameData || {};

GameData.items = {

  // ═══════════════════════════════════════════════════════════════
  // SCUMM BAR KITCHEN ITEMS
  // ═══════════════════════════════════════════════════════════════
  "pot": {
    id: "pot",
    name: "pot",
    description: "A battered old cooking pot. It's seen better days, but it could serve as a makeshift helmet in a pinch.",
    portable: true,
    location: "scumm_bar_kitchen",
    useWith: {
      "fettuccini_brothers": {
        result: null,
        message: "You show the pot to the Fettuccini Brothers. They examine it with the scrutiny of two men who really don't want to get in that cannon themselves.",
        triggersPuzzle: "cannon_trick"
      }
    },
    aliases: ["cooking pot", "helmet"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  "meat": {
    id: "meat",
    name: "hunk of meat",
    description: "A slab of meat of questionable origin. It smells... interesting. You found it in the Scumm Bar kitchen, so 'interesting' is probably the nicest thing anyone's ever said about it.",
    portable: true,
    location: "scumm_bar_kitchen",
    useWith: {
      "yellow_flowers": {
        result: "drugged_meat",
        message: "You rub the yellow Caniche Endormi petals on the meat. It now has a lovely floral aroma and a powerful sedative effect. Meat with condiment — how gourmet.",
        consumesSelf: true,
        consumesOther: true
      },
      "pot": {
        result: "stewed_meat",
        message: "You put the meat in the pot of stew. It's now stewed meat. It doesn't look any more appetizing.",
        consumesSelf: true,
        consumesOther: false
      }
    },
    aliases: ["stew", "stewed meat", "hunk"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  "fish": {
    id: "fish",
    name: "fish",
    description: "A herring of distinctly reddish hue. It smells about as good as you'd expect a fish from a pirate bar kitchen to smell. A seagull was eyeing it earlier.",
    portable: true,
    location: "scumm_bar_kitchen",
    useWith: {
      "troll": {
        result: null,
        message: "You give the fish to the troll. He sniffs it, takes a big bite, and nods approvingly. \"Ah! A red herring! Pass.\" He steps aside.",
        setsFlag: "troll_paid"
      }
    },
    aliases: ["herring", "red herring"],
    hidden: true,
    takeable: true,
    useAlone: null,
    notes: "Hidden until bird is chased away by rocking the plank."
  },

  // ═══════════════════════════════════════════════════════════════
  // SHOP ITEMS (Purchaseable)
  // ═══════════════════════════════════════════════════════════════
  "sword": {
    id: "sword",
    name: "sword",
    description: "A fine pirate sword. Razor-sharp and well-balanced. Best 100 pieces of eight you ever spent — assuming you live long enough to agree.",
    portable: true,
    location: "town_shop",
    useWith: {
      "captain_smirk": {
        result: null,
        message: "You show Captain Smirk your sword. He examines it approvingly. \"Yes, this is a nice one. Let's get to it.\"",
        triggersPuzzle: "sword_training"
      }
    },
    aliases: ["blade", "cutlass"],
    hidden: false,
    takeable: true,
    useAlone: null,
    price: 100,
    buyMessage: "The shopkeeper takes your money with the efficiency of long practice. \"Great. Best 100 pieces of eight you ever spent.\""
  },

  "shovel": {
    id: "shovel",
    name: "shovel",
    description: "A sturdy shovel, perfect for digging up buried treasure. Or burying things. Or hitting people. It's a versatile tool.",
    portable: true,
    location: "town_shop",
    useWith: {
      "x_marks_spot": {
        result: "treasure",
        message: "You dig... and dig... and dig. Hours pass. \"Hey, I think I hit something!\" It's a T-shirt! Not your size, but a nice one nonetheless.",
        setsFlag: "got_treasure",
        triggersPuzzle: "treasure_dig"
      }
    },
    aliases: ["spade"],
    hidden: false,
    takeable: true,
    useAlone: null,
    price: 75,
    buyMessage: "\"Another would-be treasure hunter, eh? That'll cost you 75 pieces of eight. It'll pay for itself, believe me.\""
  },

  "breath_mints": {
    id: "breath_mints",
    name: "breath mints",
    description: "A roll of Grog-o-Mint breath fresheners. Extra strong — they'd have to be, to cut through what passes for oral hygiene on this island.",
    portable: true,
    location: "town_shop",
    useWith: {
      "otis": {
        result: null,
        message: "You hand the breath mints to Otis. \"Ooooh! Grog-o-Mint! How refreshing! Thanks.\" His breath improves from 'biological weapon' to merely 'unpleasant.'",
        setsFlag: "otis_has_mints"
      }
    },
    aliases: ["mints", "grog-o-mint"],
    hidden: false,
    takeable: true,
    useAlone: "You pop a mint. Mmm, minty fresh. Now you're the best-smelling pirate on Mêlée Island, which is a low bar.",
    price: 1,
    buyMessage: "\"You're telling me! Here, take one... please. Take a whole roll! That'll be one piece of eight.\""
  },

  // ═══════════════════════════════════════════════════════════════
  // FOREST ITEMS
  // ═══════════════════════════════════════════════════════════════
  "yellow_flowers": {
    id: "yellow_flowers",
    name: "yellow flowers",
    description: "Beautiful yellow Caniche Endormi flowers. Picking them is technically illegal, but you're a pirate. They have a powerful sedative effect on dogs. And probably everything else.",
    portable: true,
    location: "forest_1",
    useWith: {
      "meat": {
        result: "drugged_meat",
        message: "You rub the yellow petals on the meat. The meat now smells floral and dangerous.",
        consumesBoth: true
      }
    },
    aliases: ["flowers", "petals", "caniche endormi"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  // ═══════════════════════════════════════════════════════════════
  // COMBINATION ITEMS
  // ═══════════════════════════════════════════════════════════════
  "drugged_meat": {
    id: "drugged_meat",
    name: "meat with condiment",
    description: "A hunk of meat liberally seasoned with yellow Caniche Endormi petals. One whiff and those poodles will be counting sheep.",
    portable: true,
    location: null,
    useWith: {
      "piranha_poodles": {
        result: null,
        message: "You toss the drugged meat to the poodles. They sniff it, devour it greedily, and within moments are snoring peacefully. No animals were harmed during the production of this game.",
        setsFlag: "dogs_drugged",
        consumesSelf: true
      }
    },
    aliases: ["drugged meat", "seasoned meat", "condiment meat"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  // ═══════════════════════════════════════════════════════════════
  // VOODOO LADY ITEMS
  // ═══════════════════════════════════════════════════════════════
  "rubber_chicken": {
    id: "rubber_chicken",
    name: "rubber chicken with a pulley in the middle",
    description: "It's a rubber chicken with a pulley in the middle. You're not sure what's more disturbing — that someone made this, or that you're carrying it around. The pulley squeaks.",
    portable: true,
    location: "town_voodoo",
    useWith: {
      "cable": {
        result: null,
        message: "You hook the rubber chicken's pulley over the cable and zip across to Meathook's island. It's the most dignified mode of transportation available. Which says a lot about this island.",
        movesPlayer: "meathook_island"
      }
    },
    aliases: ["chicken", "rubber chicken", "pulley chicken"],
    hidden: false,
    takeable: true,
    useAlone: "You squeeze the rubber chicken. It squeaks. The pulley in the middle jiggles. You feel like a true pirate."
  },

  // ═══════════════════════════════════════════════════════════════
  // GOVERNOR'S MANSION ITEMS
  // ═══════════════════════════════════════════════════════════════
  "gopher_repellent": {
    id: "gopher_repellent",
    name: "gopher repellent",
    description: "A can of industrial-strength gopher repellent. It promises to repel gophers, rats, and most forms of civil conversation. Found in the Governor's mansion during that... incident.",
    portable: true,
    location: "mansion_interior",
    useWith: {
      "otis": {
        result: "carrot_cake",
        message: "You give the gopher repellent to Otis. \"Hey, this might work on the rats! Thanks! Here's the cake.\" He hands you a carrot cake from his Aunt Tillie.",
        setsFlag: "otis_has_repellent",
        consumesSelf: true,
        givesItem: "carrot_cake"
      }
    },
    aliases: ["repellent", "rat repellent"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  "idol_of_many_hands": {
    id: "idol_of_many_hands",
    name: "Idol of Many Hands",
    description: "A fabulous golden idol with far too many hands for anyone's comfort. It's beautiful, it's priceless, and you stole it fair and square. The pirate leaders will be impressed.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["idol", "fabulous idol"],
    hidden: true,
    takeable: true,
    useAlone: null,
    notes: "Obtained via file + display case puzzle. Proof of thievery trial."
  },

  // ═══════════════════════════════════════════════════════════════
  // OTIS / JAIL ITEMS
  // ═══════════════════════════════════════════════════════════════
  "carrot_cake": {
    id: "carrot_cake",
    name: "carrot cake",
    description: "A carrot cake from Otis's Aunt Tillie. Otis hates carrot cake. You're beginning to understand why — it's unusually heavy and crunchy for a cake.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["cake"],
    hidden: false,
    takeable: true,
    useAlone: "You take a bite of the carrot cake. Crunch! There's a file inside it! A nail file, but still — it's sharp enough to open a lock. Aunt Tillie is either a terrible baker or an excellent accomplice.",
    useAloneResult: "file",
    useAloneSetsFlag: "got_file",
    consumesSelf: true
  },

  "file": {
    id: "file",
    name: "file",
    description: "A small file that was hidden inside a carrot cake. It's not much to look at, but it's sharp enough to open a display case lock. Thank you, Aunt Tillie.",
    portable: true,
    location: null,
    useWith: {
      "idol_case": {
        result: "idol_of_many_hands",
        message: "You work the file into the lock on the display case. After some careful work... click! The case opens and you grab the Idol of Many Hands. \"It's beautiful!\" you exclaim, before the Sheriff shows up to ruin everything.",
        setsFlag: "got_idol",
        givesItem: "idol_of_many_hands",
        consumesSelf: true,
        triggersEvent: "sheriff_idol_confrontation"
      }
    },
    aliases: ["nail file"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  // ═══════════════════════════════════════════════════════════════
  // TREASURE ITEMS
  // ═══════════════════════════════════════════════════════════════
  "treasure_map": {
    id: "treasure_map",
    name: "treasure map",
    description: "A map to the Legendary Lost Treasure of Mêlée Island. Only one in existence. Rare. Very rare. It looks suspiciously like... dancing lessons? 'DO THE MONKEY!!! Back! Two-three-four! Left! Two-three-four! Right! Two-three-four!'",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["map", "dance instructions"],
    hidden: false,
    takeable: true,
    useAlone: "You study the map. It reads: 'DO THE MONKEY!!! Back! Two-three-four! Left! Two-three-four! Right! Two-three-four! Left! Two-three-four! Right! Two-three-four! Back! Two-three-four! Right! Two-three-four! Left! Two-three-four! Back! Cha-cha-cha!' You think you've been had.",
    price: 100,
    buyMessage: "The citizen takes your money and hands over the map. \"There ya go. You've made a wise decision. Now get lost.\""
  },

  "treasure": {
    id: "treasure",
    name: "Legendary Lost Treasure of Mêlée Island",
    description: "It's a T-shirt! 'I found the Legendary Lost Treasure of Mêlée Island and all I got was this lousy T-shirt.' Not your size, but a nice one nonetheless. This is the treasure generations of pirates have sought.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["t-shirt", "treasure t-shirt", "legendary treasure"],
    hidden: false,
    takeable: true,
    useAlone: null,
    notes: "Proof of treasure huntery trial."
  },

  // ═══════════════════════════════════════════════════════════════
  // SWORDMASTER REWARD
  // ═══════════════════════════════════════════════════════════════
  "cotton_tshirt": {
    id: "cotton_tshirt",
    name: "100% cotton T-shirt",
    description: "A T-shirt that reads 'I defeated the Swordmaster and all I got was this lousy T-shirt.' It's 100% cotton. Stylish proof that you bested Carla in insult sword fighting.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["t-shirt", "swordmaster t-shirt", "tshirt"],
    hidden: false,
    takeable: true,
    useAlone: null,
    notes: "Proof of swordsmanship trial."
  },

  // ═══════════════════════════════════════════════════════════════
  // GROG / MUG ITEMS (Phase 2)
  // ═══════════════════════════════════════════════════════════════
  "mug_1": {
    id: "mug_1",
    name: "mug",
    description: "An empty grog mug. The inside is pitted and scarred from the caustic grog. These things don't last long.",
    portable: true,
    location: "scumm_bar",
    useWith: {
      "grog_barrel": {
        result: "grog_mug",
        message: "You fill the mug with grog from the barrel. The liquid hisses and sizzles. This stuff is eating right through the mug! You'd better hurry.",
        consumesSelf: true,
        givesItem: "grog_mug"
      }
    },
    aliases: ["empty mug"],
    hidden: true,
    takeable: true,
    useAlone: null,
    appearsWhen: "ghost_ship_seen"
  },

  "mug_2": {
    id: "mug_2",
    name: "mug",
    description: "Another empty grog mug, pitted with acid burns.",
    portable: true,
    location: "scumm_bar",
    useWith: {
      "grog_barrel": {
        result: "grog_mug",
        message: "You fill the mug with grog. It immediately starts dissolving.",
        consumesSelf: true,
        givesItem: "grog_mug"
      },
      "grog_mug": {
        result: "grog_mug",
        message: "You pour the grog into the fresh mug just in time! The old mug dissolves into a puddle of slag.",
        consumesSelf: true,
        givesItem: "grog_mug",
        resetsTimer: true
      }
    },
    aliases: ["empty mug"],
    hidden: true,
    takeable: true,
    useAlone: null,
    appearsWhen: "ghost_ship_seen"
  },

  "mug_3": {
    id: "mug_3",
    name: "mug",
    description: "Yet another grog mug. The Scumm Bar goes through these like candy.",
    portable: true,
    location: "scumm_bar",
    useWith: {
      "grog_barrel": {
        result: "grog_mug",
        message: "You fill the mug with grog. It starts hissing immediately.",
        consumesSelf: true,
        givesItem: "grog_mug"
      },
      "grog_mug": {
        result: "grog_mug",
        message: "You quickly transfer the grog. The old mug melts into nothing.",
        consumesSelf: true,
        givesItem: "grog_mug",
        resetsTimer: true
      }
    },
    aliases: ["empty mug"],
    hidden: true,
    takeable: true,
    useAlone: null,
    appearsWhen: "ghost_ship_seen"
  },

  "mug_4": {
    id: "mug_4",
    name: "mug",
    description: "A grog mug. Slightly less corroded than the others.",
    portable: true,
    location: "scumm_bar",
    useWith: {
      "grog_barrel": {
        result: "grog_mug",
        message: "Grog fills the mug. The countdown begins.",
        consumesSelf: true,
        givesItem: "grog_mug"
      },
      "grog_mug": {
        result: "grog_mug",
        message: "You transfer the grog just before the old mug disintegrates. Safe... for now.",
        consumesSelf: true,
        givesItem: "grog_mug",
        resetsTimer: true
      }
    },
    aliases: ["empty mug"],
    hidden: true,
    takeable: true,
    useAlone: null,
    appearsWhen: "ghost_ship_seen"
  },

  "mug_5": {
    id: "mug_5",
    name: "mug",
    description: "The last grog mug. Use it wisely.",
    portable: true,
    location: "scumm_bar",
    useWith: {
      "grog_barrel": {
        result: "grog_mug",
        message: "You fill the last mug with grog. Better make this one count.",
        consumesSelf: true,
        givesItem: "grog_mug"
      },
      "grog_mug": {
        result: "grog_mug",
        message: "You pour the grog into the fresh mug. Another mug sacrificed to the cause.",
        consumesSelf: true,
        givesItem: "grog_mug",
        resetsTimer: true
      }
    },
    aliases: ["empty mug"],
    hidden: true,
    takeable: true,
    useAlone: null,
    appearsWhen: "ghost_ship_seen"
  },

  "grog_mug": {
    id: "grog_mug",
    name: "mug of grog",
    description: "A mug full of grog. It's hissing and bubbling, eating through the mug as you watch. You need to use it quickly or transfer it to another mug before this one dissolves!",
    portable: true,
    location: null,
    useWith: {
      "jail_lock": {
        result: null,
        message: "You pour the grog on the jail cell lock. The caustic liquid hisses, sizzles, and eats right through the metal. The lock melts into a puddle of slag. Otis is free!",
        setsFlag: "jail_lock_melted",
        consumesSelf: true
      },
      "mug_1": {
        result: "grog_mug",
        message: "You transfer the grog to a fresh mug just in time!",
        consumesSelf: false,
        resetsTimer: true
      },
      "mug_2": {
        result: "grog_mug",
        message: "You transfer the grog to a fresh mug just in time!",
        consumesSelf: false,
        resetsTimer: true
      },
      "mug_3": {
        result: "grog_mug",
        message: "You transfer the grog to a fresh mug just in time!",
        consumesSelf: false,
        resetsTimer: true
      },
      "mug_4": {
        result: "grog_mug",
        message: "You transfer the grog to a fresh mug just in time!",
        consumesSelf: false,
        resetsTimer: true
      },
      "mug_5": {
        result: "grog_mug",
        message: "You transfer the grog to a fresh mug just in time!",
        consumesSelf: false,
        resetsTimer: true
      }
    },
    aliases: ["grog", "mug of grog"],
    hidden: false,
    takeable: true,
    useAlone: null,
    timer: 8,
    timerMessage: "The grog eats through the mug and sizzles on the floor. You'll need another one."
  },

  // ═══════════════════════════════════════════════════════════════
  // STAN'S ITEMS
  // ═══════════════════════════════════════════════════════════════
  "business_card": {
    id: "business_card",
    name: "Stan's business card",
    description: "A garish business card reading 'STAN'S PREVIOUSLY OWNED VESSELS — If you can find a better deal, you deserve it!' There's a picture of Stan giving two thumbs up. His arms appear to be moving even in the picture.",
    portable: true,
    location: null,
    useWith: {
      "shopkeeper": {
        result: null,
        message: "You show Stan's business card to the shopkeeper. He sighs the sigh of a man who's dealt with Stan before.",
        triggersPuzzle: "note_of_credit"
      }
    },
    aliases: ["card", "stans card"],
    hidden: false,
    takeable: true,
    useAlone: "You flip the card over. On the back it reads: 'Satisfaction guaranteed! (Guarantee void if customer is satisfied.)'"
  },

  "note_of_credit": {
    id: "note_of_credit",
    name: "note of credit",
    description: "A note of credit from the shopkeeper. It doesn't specify an amount, which is probably an oversight you shouldn't mention to Stan.",
    portable: true,
    location: null,
    useWith: {
      "stan": {
        result: null,
        message: "You present the note of credit to Stan. His eyes light up like a kid on Christmas. \"Hey, of course! Your credit's always good at Stan's!\"",
        triggersPuzzle: "buy_ship"
      }
    },
    aliases: ["credit", "note", "credit note"],
    hidden: false,
    takeable: true,
    useAlone: null
  },

  "magnetic_compass": {
    id: "magnetic_compass",
    name: "magnetic compass",
    description: "An extra strong magnetic compass with Stan's picture on it. It always points directly back to Stan's Previously Owned Vessels. Useful for... well, finding Stan, apparently.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["compass", "stans compass"],
    hidden: false,
    takeable: true,
    useAlone: "The compass needle spins and points back toward Stan's shipyard. You can practically hear his sales pitch from here."
  },

  // ═══════════════════════════════════════════════════════════════
  // MISCELLANEOUS ITEMS
  // ═══════════════════════════════════════════════════════════════
  "minutes": {
    id: "minutes",
    name: "minutes of meeting",
    description: "Minutes of the last meeting of the Mêlée Island PTA. They couldn't even give these away. Actually, they paid YOU to take them.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["minutes", "pta minutes"],
    hidden: false,
    takeable: true,
    useAlone: "You read the PTA minutes. Apparently, there's an ongoing dispute about whether pirate children should be allowed to bring swords to school. The vote was 12-11 in favor."
  },

  "staple_remover": {
    id: "staple_remover",
    name: "staple remover",
    description: "A staple remover. Sharp, small, and surprisingly useful in situations involving tremendous dangerous-looking yaks.",
    portable: true,
    location: null,
    useWith: {},
    aliases: ["remover"],
    hidden: false,
    takeable: true,
    useAlone: null,
    notes: "Obtained during mansion fight scene."
  },

  "lechuck_note": {
    id: "lechuck_note",
    name: "LeChuck's note",
    description: "A threatening note from Captain LeChuck. It reads: 'Attention, pirates of Mêlée: Your governor is alive and well and by my side as she was always meant to be. If you try to find us you will only meet with horrifying disaster. Yours truly, Captain LeChuck.'",
    portable: true,
    location: null,
    useWith: {
      "swordmaster": {
        result: null,
        message: "You show the note to Carla. She reads it and her face darkens. \"Oh, no. This looks bad. Very bad.\"",
        triggersPuzzle: "recruit_swordmaster"
      },
      "meathook": {
        result: null,
        message: "You show the note to Meathook. \"Oh no. This is horrible! What are we going to do?\"",
        triggersPuzzle: "recruit_meathook"
      }
    },
    aliases: ["note", "lechucks note", "threatening note"],
    hidden: false,
    takeable: true,
    useAlone: null
  }
};
