/**
 * The Secret of Monkey Island — Puzzle Definitions
 * All puzzle chains for Part I: The Three Trials
 */
window.GameData = window.GameData || {};

GameData.puzzles = {

  // ═══════════════════════════════════════════════════════════════
  // P1: CIRCUS CANNON TRICK
  // ═══════════════════════════════════════════════════════════════
  "cannon_trick": {
    id: "cannon_trick",
    name: "Cannon Trick",
    description: "Perform the Fettuccini Brothers' death-defying cannon trick.",
    completed: false,
    triggered: false,
    conditions: {
      hasItem: "pot",
      inRoom: "circus"
    },
    trigger: "show pot to brothers",
    triggerRoom: "circus",
    effects: {
      setsFlags: { "cannon_trick_done": true },
      addsMoney: 478,
      removesItem: "pot",
      message: [
        "You show the pot to the brothers.",
        "Alfredo: \"Ah, that will work as a helmet!\"",
        "Bill: \"Now we can do the trick.\"",
        "You put on the pot and climb into the cannon.",
        "Guybrush: \"ECHO... echo...\"",
        "BOOM! You're launched across the tent!",
        "SMACK! You hit the support pillar head-first.",
        "Guybrush: \"I'm Bobbin. Are you my mother?\"",
        "Alfredo: \"He's all right!\"",
        "Bill: \"Hooray! We are spared an embarrassing and financially debilitating lawsuit!\"",
        "They hand you 478 pieces of eight."
      ]
    },
    oneShot: true,
    hints: [
      "The Fettuccini Brothers need someone to get in their cannon.",
      "They require a helmet for safety reasons.",
      "That pot from the kitchen looks helmet-shaped..."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P2: BUY TREASURE MAP
  // ═══════════════════════════════════════════════════════════════
  "buy_treasure_map": {
    id: "buy_treasure_map",
    name: "Buy Treasure Map",
    description: "Purchase the map to the Legendary Lost Treasure of Mêlée Island.",
    completed: false,
    triggered: false,
    conditions: {
      hasMoney: 100,
      inRoom: "town_street",
      npcPresent: "citizen"
    },
    trigger: "buy map",
    triggerRoom: "town_street",
    effects: {
      deductsMoney: 100,
      givesItem: "treasure_map",
      message: [
        "Citizen: \"Only 100 pieces of eight...\"",
        "You hand over the money.",
        "Citizen: \"There ya go. You've made a wise decision. Now get lost.\"",
        "You examine the map. It looks like... dancing lessons?",
        "\"DO THE MONKEY!!! Back! Two-three-four! Left! Two-three-four!\"",
        "Guybrush: \"I think I've been had!\""
      ]
    },
    oneShot: true,
    hints: [
      "The sneaky citizen on the street has a map for sale.",
      "It costs 100 pieces of eight.",
      "The map's directions might actually work if you follow them in the forest."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P3: BUY SWORD & SHOVEL
  // ═══════════════════════════════════════════════════════════════
  "buy_sword": {
    id: "buy_sword",
    name: "Buy Sword",
    description: "Purchase a sword from the shopkeeper.",
    completed: false,
    triggered: false,
    conditions: {
      hasMoney: 100,
      inRoom: "town_shop"
    },
    trigger: "buy sword",
    triggerRoom: "town_shop",
    effects: {
      deductsMoney: 100,
      givesItem: "sword",
      message: [
        "Shopkeeper: \"That's 100 pieces of eight. Take it or leave it.\"",
        "You hand over the money.",
        "Shopkeeper: \"Great. Best 100 pieces of eight you ever spent.\""
      ]
    },
    oneShot: true,
    hints: [
      "The shopkeeper sells swords.",
      "You'll need 100 pieces of eight."
    ]
  },

  "buy_shovel": {
    id: "buy_shovel",
    name: "Buy Shovel",
    description: "Purchase a shovel from the shopkeeper.",
    completed: false,
    triggered: false,
    conditions: {
      hasMoney: 75,
      inRoom: "town_shop"
    },
    trigger: "buy shovel",
    triggerRoom: "town_shop",
    effects: {
      deductsMoney: 75,
      givesItem: "shovel",
      message: [
        "Shopkeeper: \"Another would-be treasure hunter, eh? That'll cost you 75 pieces of eight.\"",
        "You hand over the money.",
        "Shopkeeper: \"Great. It'll pay for itself, believe me. You'll dig up 75 pieces of eight in no time.\""
      ]
    },
    oneShot: true,
    hints: [
      "The shopkeeper sells shovels for treasure hunting.",
      "You'll need 75 pieces of eight."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P4: BRIDGE TROLL
  // ═══════════════════════════════════════════════════════════════
  "bridge_troll": {
    id: "bridge_troll",
    name: "Bridge Troll",
    description: "Get past the troll blocking the bridge.",
    completed: false,
    triggered: false,
    conditions: {
      hasItem: "fish",
      inRoom: "map_bridge"
    },
    trigger: "give fish to troll",
    triggerRoom: "map_bridge",
    effects: {
      setsFlags: { "troll_paid": true },
      removesItem: "fish",
      removesNpc: "troll",
      message: [
        "You offer the fish to the troll.",
        "Troll: \"Ah! A red herring! Pass.\"",
        "The troll steps aside and lets you cross.",
        "When you're not looking, the troll removes its head — it was a costume! The man inside looks suspiciously like a famous film director. He eats the fish and puts his mask back on."
      ]
    },
    oneShot: true,
    hints: [
      "The troll wants something that will attract attention but have no real importance.",
      "What you need is a classic literary device... a red herring, perhaps?",
      "The fish from the Scumm Bar kitchen is distinctly reddish."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P5: SWORD TRAINING
  // ═══════════════════════════════════════════════════════════════
  "sword_training": {
    id: "sword_training",
    name: "Sword Training",
    description: "Train with Captain Smirk to learn insult sword fighting.",
    completed: false,
    triggered: false,
    conditions: {
      hasItem: "sword",
      hasMoney: 30,
      inRoom: "sword_trainer"
    },
    trigger: "talk to captain",
    triggerRoom: "sword_trainer",
    effects: {
      setsFlags: { "sword_training_done": true },
      deductsMoney: 30,
      message: [
        "Smirk: \"OK, ya maggot... why don't you whip that sword out and let's see what you can do with it.\"",
        "You swing the sword clumsily.",
        "Smirk: \"Boy! You fight like a dairy farmer!\"",
        "",
        "Hours of training later...",
        "",
        "Smirk: \"Sword fighting is kinda like making love. It's not always what you do, but what you say.\"",
        "Smirk: \"Your wit's got to be twice as sharp as your sword.\"",
        "Smirk: \"'You fight like a dairy farmer.' You respond with?\"",
        "Guybrush: \"You must be thinking of someone else, I am not a farmer.\"",
        "Smirk: \"You should have responded with something like... 'How appropriate. You fight like a cow.'\"",
        "",
        "More hours later...",
        "",
        "Smirk: \"Now I suggest you go out there and learn some insults.\"",
        "You leave feeling slightly ripped off, but at least you know the basics."
      ]
    },
    oneShot: true,
    hints: [
      "Captain Smirk will train you in sword fighting.",
      "You need a sword (buy one from the shopkeeper) and 30 pieces of eight.",
      "Cross the bridge first — give the troll something fishy."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P6: INSULT SWORD FIGHTING → SWORDMASTER
  // ═══════════════════════════════════════════════════════════════
  "insult_fighting": {
    id: "insult_fighting",
    name: "Insult Sword Fighting",
    description: "Fight random pirates to learn insults and comebacks, then defeat the Swordmaster.",
    completed: false,
    triggered: false,
    autoCheck: true,
    conditions: {
      flagIsTrue: "sword_training_done"
    },
    trigger: "automatic_encounter",
    triggerRoom: null,
    effects: {
      message: [
        "A pirate stops you on the path!",
        "Pirate: \"Aye! This better be importan'.\"",
        "Guybrush: \"My name is Guybrush Threepwood. Prepare to die!\""
      ]
    },
    subPuzzles: {
      "defeat_swordmaster": {
        conditions: {
          flagValue: { "sword_wins": 5 },
          inRoom: "swordmaster_clearing"
        },
        effects: {
          setsFlags: {
            "swordmaster_defeated": true,
            "trial_sword": true
          },
          givesItem: "cotton_tshirt",
          message: [
            "After five rounds of razor-sharp wit, Carla admits defeat.",
            "Carla: \"OK, you win. Well, I hope you're happy. You can go back and brag to all your friends about how you beat the Sword Master.\"",
            "Carla: \"You'll need proof... Here, this should convince them.\"",
            "You receive a 100% cotton T-shirt!"
          ]
        }
      }
    },
    oneShot: false,
    hints: [
      "Fight pirates wandering near the fork in the road.",
      "Learn their insults and the correct comebacks.",
      "You need to win at least 5 fights before the Swordmaster will fight you.",
      "The Swordmaster uses DIFFERENT insults but the SAME comebacks work!",
      "Ask the shopkeeper about the Swordmaster's location."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P7: DRUG THE POODLES
  // ═══════════════════════════════════════════════════════════════
  "drug_poodles": {
    id: "drug_poodles",
    name: "Drug the Piranha Poodles",
    description: "Create drugged meat and neutralize the poodles guarding the Governor's Mansion.",
    completed: false,
    triggered: false,
    conditions: {
      hasItem: "drugged_meat",
      inRoom: "mansion_exterior"
    },
    trigger: "give meat to poodles",
    triggerRoom: "mansion_exterior",
    effects: {
      setsFlags: { "dogs_drugged": true },
      removesItem: "drugged_meat",
      message: [
        "You toss the drugged meat to the piranha poodles.",
        "They sniff it, devour it greedily, and within moments are snoring peacefully.",
        "",
        "  ╔══════════════════════════════════════════╗",
        "  ║           IMPORTANT NOTICE               ║",
        "  ║          These dogs are not               ║",
        "  ║         dead, they are only               ║",
        "  ║              SLEEPING.                    ║",
        "  ║       No animals were harmed              ║",
        "  ║       during the production               ║",
        "  ║            of this game.                  ║",
        "  ╚══════════════════════════════════════════╝"
      ]
    },
    oneShot: true,
    hints: [
      "The poodles guard the mansion entrance.",
      "You need drugged meat — combine yellow flowers with the hunk of meat.",
      "Yellow flowers grow in the forest. The meat is in the Scumm Bar kitchen."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P8: GET THE IDOL (Multi-step)
  // ═══════════════════════════════════════════════════════════════
  "get_idol": {
    id: "get_idol",
    name: "Get the Idol of Many Hands",
    description: "Multi-step puzzle to steal the Idol of Many Hands from the Governor's Mansion.",
    completed: false,
    triggered: false,
    steps: [
      {
        id: "step_mints",
        description: "Give breath mints to Otis",
        conditions: { hasItem: "breath_mints", inRoom: "town_jail" },
        trigger: "give mints to otis",
        effects: {
          setsFlags: { "otis_has_mints": true },
          removesItem: "breath_mints",
          message: [
            "Otis: \"Ooooh! Grog-o-Mint! How refreshing! Thanks.\"",
            "His breath improves from 'biological weapon' to merely 'unpleasant.'"
          ]
        }
      },
      {
        id: "step_mansion",
        description: "Enter the Governor's Mansion (fight scene)",
        conditions: { flagIsTrue: "dogs_drugged", inRoom: "mansion_exterior" },
        trigger: "enter mansion",
        effects: {
          setsFlags: { "mansion_entered": true, "governor_met": true },
          givesItems: ["gopher_repellent", "staple_remover"],
          message: [
            "You enter the mansion. The fight scene happens automatically...",
            "THOK! SMAK! KRASH!",
            ":: Hypnotize quarrelsome rhinoceros ::",
            ":: Push red button ::",
            "Sheriff: \"Not the red button!\"",
            "KABOOM!",
            "After the chaos, you find yourself with gopher repellent and a staple remover.",
            "Guybrush: \"That should hold him for a while! If only I had a file I could get the idol!\""
          ]
        }
      },
      {
        id: "step_repellent",
        description: "Give gopher repellent to Otis for carrot cake",
        conditions: { hasItem: "gopher_repellent", flagIsTrue: "otis_has_mints", inRoom: "town_jail" },
        trigger: "give repellent to otis",
        effects: {
          setsFlags: { "otis_has_repellent": true, "got_carrot_cake": true },
          removesItem: "gopher_repellent",
          givesItem: "carrot_cake",
          message: [
            "Otis: \"Hey, this might work on the rats! Thanks! Here's the cake.\"",
            "You receive Aunt Tillie's carrot cake."
          ]
        }
      },
      {
        id: "step_cake",
        description: "Eat the carrot cake to find the file",
        conditions: { hasItem: "carrot_cake" },
        trigger: "use cake",
        effects: {
          setsFlags: { "got_file": true },
          removesItem: "carrot_cake",
          givesItem: "file",
          message: [
            "You take a bite of the carrot cake. CRUNCH!",
            "Guybrush: \"There's a file in it!\"",
            "Aunt Tillie is either a terrible baker or an excellent accomplice."
          ]
        }
      },
      {
        id: "step_file_idol",
        description: "Use the file to open the idol's display case",
        conditions: { hasItem: "file", flagIsTrue: "mansion_entered", inRoom: "mansion_interior" },
        trigger: "use file on lock",
        effects: {
          setsFlags: { "got_idol": true },
          removesItem: "file",
          givesItem: "idol_of_many_hands",
          triggersEvent: "sheriff_confrontation",
          message: [
            "You work the file into the lock on the display case. Click!",
            "Guybrush: \"It's beautiful!\"",
            "You grab the Idol of Many Hands!",
            "Guybrush: \"Phew! That was a close one. At least I got the idol.\"",
            "",
            "Sheriff: \"But I'm not done with you yet!\"",
            "The Sheriff confronts you. The Governor intervenes.",
            "But as you try to leave...",
            "Sheriff: \"Where do you think you're going, Threeword?\"",
            "Sheriff: \"Davey Jones' Locker!!!\"",
            "",
            "You're thrown into the sea, tied to the idol."
          ]
        }
      },
      {
        id: "step_underwater",
        description: "Retrieve the idol underwater and escape",
        conditions: { inRoom: "underwater" },
        trigger: "take idol",
        effects: {
          setsFlags: { "trial_thievery": true, "thrown_in_sea": true },
          message: [
            "You pick up the Idol of Many Hands. The rope goes slack!",
            "You're free! You climb the ladder back to the dock.",
            "",
            "Governor Marley appears!",
            "Governor: \"You're alive!\"",
            "Guybrush: \"Governor!\"",
            "Governor: \"Hey, you can talk! Who'd have known?\"",
            "",
            "A romantic moment ensues. Somewhat.",
            "Guybrush: \"Honey pumpkin!\"",
            "Governor: \"Plunder bunny!\"",
            "Governor: \"But finish your trials first.\""
          ]
        }
      }
    ],
    hints: [
      "To get the idol, you'll need a file.",
      "Otis in jail has a carrot cake from his Aunt Tillie.",
      "Give Otis breath mints first, then gopher repellent for the cake.",
      "The file is hidden inside the carrot cake!",
      "Gopher repellent can be found inside the Governor's Mansion."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P9: TREASURE HUNT
  // ═══════════════════════════════════════════════════════════════
  "treasure_hunt": {
    id: "treasure_hunt",
    name: "Treasure Hunt",
    description: "Follow the treasure map and dig up the Legendary Lost Treasure of Mêlée Island.",
    completed: false,
    triggered: false,
    conditions: {
      hasItem: "treasure_map",
      hasItem2: "shovel",
      inRoom: "treasure_x"
    },
    trigger: "use shovel",
    triggerRoom: "treasure_x",
    effects: {
      setsFlags: { "got_treasure": true, "trial_treasure": true },
      givesItem: "treasure",
      message: [
        "You jam the shovel into the X and start digging.",
        "Guybrush: \"This shouldn't take too long.\"",
        "",
        "Hours pass...",
        "",
        "Guybrush: \"Hey, I think I hit something!\"",
        "You pull out... a T-shirt!",
        "\"Not my size, but a nice one nonetheless.\"",
        "You've found the Legendary Lost Treasure of Mêlée Island!",
        "Guybrush: \"Well, I guess I should put all this dirt back now.\"",
        "",
        "More hours pass..."
      ]
    },
    oneShot: true,
    mapDirections: "Back, Left, Right, Left, Right, Back, Right, Left, Back (Cha-cha-cha!)",
    hints: [
      "Buy the treasure map from the citizen on the street (100 po8).",
      "Buy a shovel from the shopkeeper (75 po8).",
      "The map looks like dancing instructions — follow the directions in the forest!",
      "The directions are: Back, Left, Right, Left, Right, Back, Right, Left, Back.",
      "Dig at the X with the shovel."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P10: GROG MUG RELAY (Timed Puzzle)
  // ═══════════════════════════════════════════════════════════════
  "grog_relay": {
    id: "grog_relay",
    name: "Grog Mug Relay",
    description: "Get grog from the Scumm Bar to the jail to melt Otis's cell lock. The grog dissolves mugs — transfer between mugs before they dissolve!",
    completed: false,
    triggered: false,
    conditions: {
      flagIsTrue: "ghost_ship_seen",
      hasItem: "grog_mug",
      inRoom: "town_jail"
    },
    trigger: "use grog on lock",
    triggerRoom: "town_jail",
    effects: {
      setsFlags: { "jail_lock_melted": true },
      removesItem: "grog_mug",
      message: [
        "You pour the grog on the cell lock.",
        "The caustic liquid hisses, sizzles, and eats right through the metal!",
        "The lock melts into a puddle of slag.",
        "Otis: \"Yiiikes!\"",
        "Otis: \"Wow. And to think I used to drink that stuff...\"",
        "Otis: \"I'm free!\"",
        "Otis walks out of the cell."
      ]
    },
    timedMechanic: {
      turnsPerMug: 8,
      onExpire: "The grog eats through the mug and sizzles on the floor. You'll need another one.",
      transferCommand: "use grog with mug",
      requiredMugs: 5
    },
    oneShot: true,
    hints: [
      "After the ghost ship cutscene, empty mugs appear on the Scumm Bar tables.",
      "Fill a mug with grog from the barrel in the kitchen.",
      "The grog dissolves the mug! Transfer to a fresh mug before it melts.",
      "Each mug lasts about 8 turns. Plan your route from bar to jail!",
      "You need multiple mugs — pick them all up first."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P11: STAN'S SHIP DEAL
  // ═══════════════════════════════════════════════════════════════
  "stans_ship_deal": {
    id: "stans_ship_deal",
    name: "Buy a Ship from Stan",
    description: "Navigate Stan's sales tactics, get a note of credit, and buy the Sea Monkey.",
    completed: false,
    triggered: false,
    steps: [
      {
        id: "step_visit_stan",
        description: "Visit Stan and learn about ships and credit",
        conditions: { inRoom: "stans_shipyard" },
        trigger: "talk to stan",
        effects: {
          givesItems: ["business_card", "magnetic_compass"],
          message: [
            "Stan gives you a whirlwind tour of his inventory.",
            "None of the ships are in your price range.",
            "Stan: \"If you've got a job, the storekeeper in town might extend you some credit.\"",
            "Stan gives you his business card and a magnetic compass with his picture on it."
          ]
        }
      },
      {
        id: "step_safe_combination",
        description: "Watch the shopkeeper open his safe",
        conditions: { hasItem: "business_card", inRoom: "town_shop" },
        trigger: "ask shopkeeper about credit",
        effects: {
          setsFlags: { "safe_combination_seen": true },
          message: [
            "Shopkeeper: \"You are, are you? Got a job?\"",
            "The shopkeeper walks upstairs and opens the safe.",
            "You carefully memorize the combination as he works the dial.",
            "Shopkeeper: \"What did you say your occupation was?\"",
            "Guybrush: \"I'm a grog-swilling, foul-smelling pirate.\"",
            "Shopkeeper: \"A pirate? Don't make me laugh. Come back when you've got some tattoos or a pegleg or at least an eyepatch.\""
          ]
        }
      },
      {
        id: "step_distract_shopkeeper",
        description: "Get the shopkeeper to leave the shop",
        conditions: { flagIsTrue: "safe_combination_seen", inRoom: "town_shop" },
        trigger: "ask about swordmaster",
        effects: {
          setsFlags: { "shopkeeper_gone": true },
          message: [
            "Guybrush: \"I'm looking for the Sword Master of Mêlée Island.\"",
            "Shopkeeper: \"Hmmm... I guess I could hike all the way over there... ONCE.\"",
            "He puts a notice on the desk and heads for the door.",
            "Shopkeeper: \"AND DON'T TOUCH ANYTHING!\""
          ]
        }
      },
      {
        id: "step_open_safe",
        description: "Open the safe and take the note of credit",
        conditions: { flagIsTrue: "shopkeeper_gone", flagIsTrue2: "safe_combination_seen" },
        trigger: "open safe",
        effects: {
          setsFlags: { "safe_opened": true, "got_note_of_credit": true },
          givesItem: "note_of_credit",
          message: [
            "You open the safe using the combination you memorized.",
            "Guybrush: \"Hmmm... There's nothing in here but this note.\"",
            "You take the note of credit."
          ]
        }
      },
      {
        id: "step_buy_ship",
        description: "Buy the Sea Monkey from Stan with the note of credit",
        conditions: { hasItem: "note_of_credit", inRoom: "stans_shipyard" },
        trigger: "give note to stan",
        effects: {
          setsFlags: { "ship_bought": true },
          removesItem: "note_of_credit",
          message: [
            "Stan: \"Hey, of course! Your credit's always good at Stan's!\"",
            "After some spirited bargaining (and removing ALL the extras)...",
            "Stan: \"Five thousand pieces of eight?!? Okay! Okay! It's killing me, but okay!\"",
            "Stan: \"I've got to run these numbers by my boss... he'll think I'm nuts.\"",
            "Stan: \"You meet me at the dock with your crew. I'll bring the ship and the papers.\"",
            "Stan: \"(Sucker.) See you at the dock, and don't forget your crew. All three of them.\""
          ]
        }
      }
    ],
    hints: [
      "Talk to Stan at his shipyard to learn about buying on credit.",
      "Show Stan's business card to the shopkeeper to start the credit process.",
      "Watch the shopkeeper CAREFULLY when he opens the safe. Memorize the combination.",
      "Ask the shopkeeper to check on the Swordmaster — he'll leave the shop.",
      "Open the safe while he's gone and take the note of credit.",
      "Return to Stan with the note of credit to buy the Sea Monkey."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P12: RECRUIT CREW
  // ═══════════════════════════════════════════════════════════════
  "recruit_otis": {
    id: "recruit_otis",
    name: "Recruit Otis",
    description: "Free Otis from jail and recruit him for the crew.",
    completed: false,
    triggered: false,
    conditions: {
      flagIsTrue: "jail_lock_melted",
      inRoom: "town_jail"
    },
    trigger: "ask otis to join crew",
    triggerRoom: "town_jail",
    effects: {
      setsFlags: { "crew_otis": true },
      message: [
        "Guybrush: \"I'm looking for brave people to join my crew and sail off to Monkey Island with me to rescue the Governor.\"",
        "Otis: \"I see... Well, yes, hmmm... LeChuck, you say?\"",
        "Otis: \"HEY! LOOK BEHIND YOU! A THREE-HEADED MONKEY!\"",
        "You turn around. When you look back, Otis is gone.",
        "Guybrush: \"I can't believe I fell for that. Pretty good trick, though.\"",
        "",
        "He'll meet you at the dock. Probably."
      ]
    },
    oneShot: true,
    hints: [
      "First, free Otis by melting his cell lock with grog.",
      "Then ask him to join your crew."
    ]
  },

  "recruit_swordmaster": {
    id: "recruit_swordmaster",
    name: "Recruit Swordmaster Carla",
    description: "Ask the Swordmaster to join your crew.",
    completed: false,
    triggered: false,
    conditions: {
      flagIsTrue: "swordmaster_defeated",
      flagIsTrue2: "ghost_ship_seen",
      hasItem: "lechuck_note"
    },
    trigger: "talk to carla about kidnapping",
    triggerRoom: "swordmaster_clearing",
    effects: {
      setsFlags: { "crew_swordmaster": true },
      message: [
        "Guybrush: \"The Governor's been KIDNAPPED!\"",
        "Carla: \"What? That's ridiculous.\"",
        "You show her LeChuck's note.",
        "Carla: \"Oh, no. This looks bad. Very bad.\"",
        "Guybrush: \"I'm getting a ship and a crew together to rescue her.\"",
        "Carla: \"Hmmm... I have a feeling I'm going to regret this, but count me in. I'll meet you at the dock.\""
      ]
    },
    oneShot: true,
    hints: [
      "You must have already defeated Carla in insult sword fighting.",
      "Show her LeChuck's note to convince her to join.",
      "She'll meet you at the dock."
    ]
  },

  "recruit_meathook": {
    id: "recruit_meathook",
    name: "Recruit Meathook",
    description: "Reach Meathook's island and prove your bravery by touching the beast.",
    completed: false,
    triggered: false,
    steps: [
      {
        id: "step_zipline",
        description: "Use rubber chicken on cable to reach the island",
        conditions: { hasItem: "rubber_chicken", inRoom: "map_shore" },
        trigger: "use chicken on cable",
        effects: {
          movesPlayer: "meathook_island",
          message: [
            "You hook the rubber chicken's pulley over the cable and zip across to Meathook's island.",
            "It's... surprisingly effective."
          ]
        }
      },
      {
        id: "step_touch_beast",
        description: "Touch the dreaded beast to prove bravery",
        conditions: { inRoom: "meathook_island", flagIsTrue: "ghost_ship_seen" },
        trigger: "touch beast",
        effects: {
          setsFlags: { "crew_meathook": true },
          message: [
            "Meathook opens the series of doors with great trepidation.",
            "Behind the last door is... a green parrot.",
            "You touch it.",
            "Parrot: \"Braaaak!\"",
            "Meathook: \"I don't believe it. You are a brave man after all.\"",
            "Meathook: \"You had the guts to do what I never could.\"",
            "Guybrush: \"You can swab my decks any time!\"",
            "Meathook: \"Just pack your stuff and meet me at the dock.\"",
            "Meathook: \"Hey, maybe I'll get the chance to show you my whole tattoo routine when we're at sea!\""
          ]
        }
      }
    ],
    hints: [
      "You need a rubber chicken with a pulley in the middle. The Voodoo Lady has one.",
      "Use it on the cable at the shore to zip across to Meathook's island.",
      "Meathook will ask you to touch the beast. It's not as scary as it sounds."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // P13: FOREST BRIDGE (Signpost)
  // ═══════════════════════════════════════════════════════════════
  "forest_bridge": {
    id: "forest_bridge",
    name: "Lower the Forest Bridge",
    description: "Push the signpost to lower the bridge in the forest.",
    completed: false,
    triggered: false,
    conditions: {
      inRoom: "forest_3"
    },
    trigger: "push signpost",
    triggerRoom: "forest_3",
    effects: {
      setsFlags: { "bridge_lowered": true },
      message: [
        "You push the signpost. With a groaning creak, the bridge mechanism activates.",
        "The drawbridge lowers, revealing a path to the east.",
        "You can now reach the Swordmaster's clearing."
      ]
    },
    oneShot: true,
    hints: [
      "There's a signpost in the forest that seems connected to a bridge mechanism.",
      "Try pushing it."
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // KITCHEN SNEAK
  // ═══════════════════════════════════════════════════════════════
  "kitchen_sneak": {
    id: "kitchen_sneak",
    name: "Sneak Into Kitchen",
    description: "Get into the kitchen while the cook is distracted serving pirates.",
    completed: false,
    triggered: false,
    conditions: {
      inRoom: "scumm_bar"
    },
    trigger: "go east while cook serves",
    triggerRoom: "scumm_bar",
    effects: {
      message: [
        "You sneak into the kitchen while the cook is busy serving the pirates.",
        "He doesn't notice. Stealth: 10/10."
      ]
    },
    oneShot: false,
    hints: [
      "Wait for the cook to leave the kitchen to serve the pirates.",
      "Then sneak in while he's not looking."
    ]
  }
};
