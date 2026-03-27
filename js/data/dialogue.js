/**
 * The Secret of Monkey Island — Dialogue Scripts
 * Conversation trees for all NPCs in Part I: The Three Trials
 * Dialogue lines cross-referenced with Docs/script.txt for verbatim accuracy.
 */
window.GameData = window.GameData || {};

GameData.dialogue = {

  // ═══════════════════════════════════════════════════════════════
  // OLD MAN AT LOOKOUT (Opening Scene)
  // ═══════════════════════════════════════════════════════════════
  "old_man_intro": {
    speaker: "Old Man",
    type: "linear",
    lines: [
      { speaker: "Guybrush", text: "Hi! My name's Guybrush Threepwood, and I want to be a pirate!" },
      { speaker: "Old Man", text: "Yikes! Don't sneak up on me like that!" },
      { speaker: "Guybrush", text: "Er... I'm over this way." },
      { speaker: "Old Man", text: "Ah! Well, then, Triftweed--" },
      { speaker: "Guybrush", text: "THREEPWOOD. Guybrush THREEPWOOD." },
      { speaker: "Old Man", text: "I see. So, you want to be a pirate, eh? You look more like a flooring inspector. But if you're serious about pirating, go talk to the pirate leaders. You'll find them in the Scumm Bar." },
      { speaker: "Guybrush", text: "Gosh, thanks! I'll do that! Bye, now. I'm off to seek my fortune." },
      { speaker: "Old Man", text: "Good luck." }
    ],
    onComplete: null,
    repeatLine: "The SCUMM BAR. Now stop wasting time and get going."
  },

  "old_man_kidnapping": {
    speaker: "Old Man",
    type: "linear",
    conditions: { "ghost_ship_seen": true },
    lines: [
      { speaker: "Old Man", text: "Hey, what are you doing just standing around? The Governor's been kidnapped!" },
      { speaker: "Guybrush", text: "What? By whom?" },
      { speaker: "Old Man", text: "LeChuck's got her on that ship that just sailed off. I'm afraid we've seen the last of her." },
      { speaker: "Guybrush", text: "So where were you this whole time? Sleeping?" },
      { speaker: "Old Man", text: "Hey, I'm a lookout, not a bodyguard." },
      { speaker: "Guybrush", text: "I'll go get a crew and a ship and go rescue her!" },
      { speaker: "Old Man", text: "That's not going to be easy, you know. LeChuck's taken the Governor back to his hideout on Monkey Island. I'm afraid that no pirate on this island is brave enough to follow him there. But, hey, good luck." },
      { speaker: "Old Man", text: "Oh yeah, I almost forgot... They left this note." }
    ],
    onComplete: "give_lechuck_note",
    repeatLine: "Go find a crew and a ship. Monkey Island isn't going to sail to itself."
  },

  // ═══════════════════════════════════════════════════════════════
  // MANCOMB SEEPGOOD (Scumm Bar)
  // ═══════════════════════════════════════════════════════════════
  "mancomb_intro": {
    speaker: "Mancomb Seepgood",
    type: "choice",
    intro: [
      { speaker: "Mancomb", text: "Ahoy there, stranger. New in town?" }
    ],
    choices: [
      {
        text: "My name's Guybrush Threepwood. I'm new in town.",
        response: [
          { speaker: "Mancomb", text: "Guybrush Threepwood? Ha ha ha!!! That's the stupidest name I've ever heard!" },
          { speaker: "Guybrush", text: "I don't know... I kind of like 'Guybrush.'" },
          { speaker: "Mancomb", text: "But it's not even a name!" },
          { speaker: "Guybrush", text: "Well, what's YOUR name?" },
          { speaker: "Mancomb", text: "My name is Mancomb Seepgood." }
        ]
      },
      {
        text: "I want to be a pirate!",
        response: [
          { speaker: "Mancomb", text: "Oh, really? You should go talk to the important-looking pirates in the next room. They're pretty much in charge around here. They can tell you where to go and what to do." }
        ]
      },
      {
        text: "Where can I find the Governor?",
        response: [
          { speaker: "Mancomb", text: "Governor Marley? Her mansion is on the other side of town. But pirates aren't as welcome around her place as they used to be." },
          { speaker: "Guybrush", text: "Why not?" },
          { speaker: "Mancomb", text: "Well, the last time she had a pirate over for dinner, he fell in love with her. It's made things rather uncomfortable for everybody." },
          { speaker: "Guybrush", text: "How's that?" },
          { speaker: "Mancomb", text: "Well, there's a whole big story about what happened next... But I don't believe a word of it. Estevan over there at the other table might tell you about it. He takes the whole thing seriously. VERY seriously." }
        ]
      },
      {
        text: "Nice talking to you.",
        response: [
          { speaker: "Mancomb", text: "Uh-oh, it looks like my grog is going flat, so you'll have to excuse me. Nice talking to you. Have fun on Mêlée Island." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTEVAN (Scumm Bar — LeChuck backstory)
  // ═══════════════════════════════════════════════════════════════
  "estevan_lechuck": {
    speaker: "Estevan",
    type: "choice",
    intro: [
      { speaker: "Estevan", text: "What are you looking at me for?" }
    ],
    choices: [
      {
        text: "I'd like to introduce myself... my name's Guybrush.",
        response: [
          { speaker: "Estevan", text: "Yeah, so what?" }
        ]
      },
      {
        text: "Who's this pirate that's bugging the Governor?",
        response: [
          { speaker: "Estevan", text: "LeChuck? He's the guy that went to the Governor's for dinner and never wanted to leave. He fell for her in a big way, but she told him to drop dead. So he did. Then things really got ugly." }
        ],
        unlocksChoices: ["lechuck_scary", "lechuck_then"]
      },
      {
        id: "lechuck_scary",
        text: "What's so scary about this LeChuck guy?",
        hidden: true,
        response: [
          { speaker: "Estevan", text: "LeChuck was a fearsome pirate. He tried to impress the Governor by sailing off to find the Secret of Monkey Island. But a mysterious storm came up and sank his ship, leaving no survivors. We thought that was the end of the fearsome pirate LeChuck. We were wrong." }
        ]
      },
      {
        id: "lechuck_then",
        text: "What happened then?",
        hidden: true,
        response: [
          { speaker: "Estevan", text: "He still sails the waters between here and Monkey Island. His ghost ship is an unholy terror upon the sea. That's why we're all in here and not out pirating." }
        ]
      },
      {
        text: "What happened to your eye?",
        response: [
          { speaker: "Estevan", text: "Well, I was putting in my contact lens when--Hey, wait a second! That's none of your business!" }
        ]
      },
      {
        text: "Where can I get a drink?",
        response: [
          { speaker: "Estevan", text: "A drink? You could wait for the cook to notice you... but that could take all day. Just find a mug and sneak into the kitchen. That's what we all do." },
          { speaker: "Estevan", text: "Look, this whole LeChuck thing has me pretty shaken up. So if you don't mind..." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LOOM™ PIRATE (Scumm Bar)
  // ═══════════════════════════════════════════════════════════════
  "loom_pirate_dialogue": {
    speaker: "Pirate",
    type: "choice",
    intro: [
      { speaker: "Pirate", text: "Aye!" }
    ],
    choices: [
      {
        text: "Aye, yourself.",
        response: [
          { speaker: "Pirate", text: "Aye." }
        ]
      },
      {
        text: "Nice hat.",
        response: [
          { speaker: "Pirate", text: "Aye." }
        ]
      },
      {
        text: "So, tell me about LOOM.",
        response: [
          { speaker: "Pirate", text: "You mean the latest masterpiece of fantasy storytelling from Lucasfilm's™ Brian Moriarty™? Why it's an extraordinary adventure with an interface of magic... stunning, high-resolution, 3D landscapes... sophisticated score and musical effects. Not to mention the detailed animation and special effects, elegant point 'n' click control of characters, objects, and magic spells. Beat the rush! Go out and buy Loom™ today!" },
          { speaker: "Guybrush", text: "Geeze, what an obvious sales pitch." },
          { speaker: "Pirate", text: "Sorry, but on some topics I just get carried away." }
        ]
      },
      {
        text: "Nice talking to you.",
        response: [
          { speaker: "Pirate", text: "Aye." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // DOG (Scumm Bar)
  // ═══════════════════════════════════════════════════════════════
  "bar_dog_dialogue": {
    speaker: "Dog",
    type: "linear",
    lines: [
      { speaker: "Dog", text: "Grrrrrrrr." },
      { speaker: "Guybrush", text: "Woof." },
      { speaker: "Dog", text: "WOOF? Aruff roof! Woof-woof arf woof... ...warroof, Mêlée Island! ...a-roof wuf: ...LeChuck! Grrrrrrr!" },
      { speaker: "Dog", text: "Worf woof woof ruff-ruff... Wor-roof wuf? Ruff arf-arf, bow-ruff... ...Governor Marley! A-OOOOOOO!" },
      { speaker: "Dog", text: "Arf, oof-oof, Monkey Island! *sniff* *sniff*" }
    ],
    onComplete: null,
    repeatLine: "Grrrrrrrr."
  },

  // ═══════════════════════════════════════════════════════════════
  // PIRATE LEADERS (Three Trials)
  // ═══════════════════════════════════════════════════════════════
  "pirate_leaders_trials": {
    speaker: "Pirate Leaders",
    type: "choice",
    intro: [
      { speaker: "Green Pirate", text: "What be ye wantin' boy?" }
    ],
    choices: [
      {
        text: "I want to be a pirate.",
        response: [
          { speaker: "Blue Pirate", text: "So what?" },
          { speaker: "Green Pirate", text: "Why bother us?" },
          { speaker: "Black Pirate", text: "Hey, don't forget we're short on help because of this whole LeChuck thing." },
          { speaker: "Black Pirate", text: "So, no pirates means no swag, and no swag means no grog, and we're getting dangerously low on grog..." },
          { speaker: "Blue Pirate", text: "Hmm... Do you have any special skills?" },
          { speaker: "Guybrush", text: "I can hold my breath for ten minutes!" },
          { speaker: "Blue Pirate", text: "Well... All right, but you don't become a pirate just by ASKING." },
          { speaker: "Black Pirate", text: "You'll have to go through..." },
          { speaker: "All", text: "The three trials!" }
        ],
        setsFlag: "knows_three_trials",
        unlocksChoices: ["trial_sword_info", "trial_thievery_info", "trial_treasure_info"]
      },
      {
        text: "I want to be a fireman.",
        response: [
          { speaker: "Blue Pirate", text: "Get lost, boy, you bother us." }
        ]
      },
      {
        id: "trial_sword_info",
        text: "Tell me more about mastering the sword.",
        hidden: true,
        response: [
          { speaker: "Blue Pirate", text: "First, get ye a sword. You must seek out and defeat the Sword Master. Someone in town can probably direct you. Oh! You'll want to find someone to train you first." },
          { speaker: "Black Pirate", text: "Ha ha. Imagine trying to take on the Sword Master without any training!" },
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
          { speaker: "Black Pirate", text: "In the Governor's Mansion!" },
          { speaker: "Green Pirate", text: "The Governor keeps the Idol o' Many Hands in a display case in the mansion outside the town." },
          { speaker: "Blue Pirate", text: "You'll have to get past the guards, naturally." },
          { speaker: "Black Pirate", text: "The tricky part will be getting past the dogs outside." },
          { speaker: "Blue Pirate", text: "They're a particularly vicious breed... ...you might be able to drug them or something." }
        ]
      },
      {
        id: "trial_treasure_info",
        text: "Tell me more about treasure hunting.",
        hidden: true,
        response: [
          { speaker: "Black Pirate", text: "Legend has it that there's a treasure buried here on the island..." },
          { speaker: "Blue Pirate", text: "All you must do is find the Legendary Lost Treasure of Mêlée Island and bring it back here." },
          { speaker: "Guybrush", text: "Should I have a map or something?" },
          { speaker: "Blue Pirate", text: "Ye can hardly expect to find a treasure without a map!" },
          { speaker: "Green Pirate", text: "...and don't forget: X marks the spot!" },
          { speaker: "All", text: "Har Har Har" }
        ]
      },
      {
        text: "You're a bunch of foul-smelling, grog-swilling pigs!",
        response: [
          { speaker: "Blue Pirate", text: "To be a pirate ye must also be a foul-smelling, grog-swilling pig." }
        ]
      },
      {
        text: "What's in that grog stuff, anyway?",
        response: [
          { speaker: "Green Pirate", text: "Grog is a secret mixture which contains one or more of the following:" },
          { speaker: "Blue Pirate", text: "Kerosene, propylene glycol, artificial sweeteners, sulphuric acid, rum, acetone, red dye #2, scumm, axle grease, battery acid, and/or pepperoni." },
          { speaker: "Green Pirate", text: "As you can probably imagine, it's one of the most caustic, volatile substances known to man." },
          { speaker: "Blue Pirate", text: "The stuff eats right through these mugs and the cook is losing a fortune replacing them." },
          { speaker: "All", text: "Har Har Har" }
        ]
      },
      {
        text: "I'll just be running along now.",
        response: [
          { speaker: "Blue Pirate", text: "Leave us to our grog." },
          { speaker: "Green Pirate", text: "Come back later and tell us how ye're doing." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // VOODOO LADY
  // ═══════════════════════════════════════════════════════════════
  "voodoo_fortune": {
    speaker: "Voodoo Lady",
    type: "choice",
    intro: [
      { speaker: "Voodoo Lady", text: "What may I help you with, son?" }
    ],
    choices: [
      {
        text: "My name is Guybrush Threepwood and I'm a mighty pirate.",
        response: [
          { speaker: "Voodoo Lady", text: "Wait... ...don't say anything. I can sense your name is... ...is... ...Guybrush... ...Guybrush Nosehair. No... ...Threepwood. Guybrush Threepwood. Am I not right?" },
          { speaker: "Guybrush", text: "Lucky guess. Half the people I know are named Guybrush." },
          { speaker: "Voodoo Lady", text: "I suggest you open your mind. It will help you in your coming journey." }
        ]
      },
      {
        text: "What can you tell me about my journey?",
        response: [
          { speaker: "Voodoo Lady", text: "I am getting a vision... I see you taking a voyage, a long voyage. I see you captaining a ship." },
          { speaker: "Guybrush", text: "Yeah!" },
          { speaker: "Voodoo Lady", text: "I see... a giant monkey." },
          { speaker: "Guybrush", text: "Yikes!" },
          { speaker: "Voodoo Lady", text: "I see you inside the giant monkey." },
          { speaker: "Guybrush", text: "Gross." },
          { speaker: "Voodoo Lady", text: "Wait... it is all becoming clear. Your journey will have many parts. You will see things better left unseen. You will hear things better left unheard. You will learn things better left unlearned." },
          { speaker: "Guybrush", text: "What kind of things? I hate surprises." },
          { speaker: "Voodoo Lady", text: "NO! The time is not right to know. When you know your purpose, come see me... I will let you know then." }
        ]
      },
      {
        text: "How much for this keen-looking chicken?",
        response: [
          { speaker: "Voodoo Lady", text: "Aah... I sense the guilt of stealing my chicken grows. Take it. It's yours." },
          { speaker: "Guybrush", text: "Why don't you want it? Is it jinxed with an ancient voodoo curse?" },
          { speaker: "Voodoo Lady", text: "No... the pulley squeaks." }
        ],
        givesItem: "rubber_chicken"
      },
      {
        text: "I'll be going now.",
        response: [
          { speaker: "Voodoo Lady", text: "Return when you know your purpose." }
        ],
        exits: true
      }
    ]
  },

  "voodoo_phase2": {
    speaker: "Voodoo Lady",
    type: "linear",
    conditions: { "ghost_ship_seen": true },
    lines: [
      { speaker: "Guybrush", text: "Hey! I'm back and I'm ready to know more about the future." },
      { speaker: "Voodoo Lady", text: "So, you have returned to learn the future. You must first find others to help in your cause." },
      { speaker: "Guybrush", text: "I really hate that flashing, it makes me see spots." },
      { speaker: "Voodoo Lady", text: "Quiet! I am getting another vision. You must..." },
      { speaker: "Guybrush", text: "Must what?" },
      { speaker: "Voodoo Lady", text: "You must go to Monkey Island. Once there, you will search for the Ghost Pirate LeChuck. He hides deep... ...deep beneath Monkey Island. There is only one thing powerful enough to destroy LeChuck." },
      { speaker: "Guybrush", text: "What?" },
      { speaker: "Voodoo Lady", text: "It's an ancient root. Once prepared, the root can destroy a ghost with one touch." },
      { speaker: "Voodoo Lady", text: "Now go and find the one that loves you. But be warned..." },
      { speaker: "Guybrush", text: "Don't worry, I'll watch out for LeChuck." },
      { speaker: "Voodoo Lady", text: "Not of LeChuck... of yourself and what you will find. What you will find out about yourself and your world. It will terrify you." }
    ],
    onComplete: null,
    repeatLine: "Go and find your crew. Time is running out."
  },

  // ═══════════════════════════════════════════════════════════════
  // SHERIFF SHINETOP (Dark Alley)
  // ═══════════════════════════════════════════════════════════════
  "sheriff_alley": {
    speaker: "Sheriff Fester Shinetop",
    type: "linear",
    lines: [
      { speaker: "???", text: "Pssssst." },
      { speaker: "Guybrush", text: "Hello? Anybody in here? HELLO???" },
      { speaker: "Sheriff", text: "You know, bad things could happen to a person in a dark, deserted alley like this one. And at this time of night, nobody would be around to see it." },
      { speaker: "Guybrush", text: "Yeah, and bad things happen to people who sneak up on other people from behind." },
      { speaker: "Sheriff", text: "So, you're going to give me a little attitude, eh? I'd better get your name." },
      { speaker: "Guybrush", text: "I'm Guybrush Threepwood, and I'm a mighty pirate." },
      { speaker: "Sheriff", text: "Listen Peepwood--" },
      { speaker: "Guybrush", text: "Threepwood! Guybrush Threepwood!" },
      { speaker: "Sheriff", text: "Whatever your name is, listen: I'm the sheriff around here. Sheriff Fester Shinetop. Take it from me--This is a bad time to be visiting Mêlée Island. A very BAD time. My advice to you is to find somewhere else to take your vacation." },
      { speaker: "Guybrush", text: "Boy, I feel much better knowing there's an officer of the law around." }
    ],
    onComplete: "sheriff_met",
    repeatLine: null
  },

  // ═══════════════════════════════════════════════════════════════
  // OTIS (Jail)
  // ═══════════════════════════════════════════════════════════════
  "otis_jail": {
    speaker: "Otis",
    type: "choice",
    intro: [
      { speaker: "Otis", text: "You gotta get me out of here! I'm a victim of society." },
      { speaker: "Guybrush", text: "Not to mention halitosis." }
    ],
    choices: [
      {
        text: "Who are you?",
        response: [
          { speaker: "Otis", text: "My name is Otis. At least, I think it is. I've been in here so long I can hardly remember. You've got to get me out of here before I lose my mind completely! Can't you see I'm innocent?" },
          { speaker: "Guybrush", text: "But why are you in jail, if you're innocent?" },
          { speaker: "Otis", text: "I was framed! I didn't touch the stupid flowers!" },
          { speaker: "Guybrush", text: "What flowers?" },
          { speaker: "Otis", text: "The yellow Caniche Endormi flowers in the forest--It's against the law to pick them." }
        ]
      },
      {
        text: "Can I get you anything?",
        response: [
          { speaker: "Otis", text: "Yes... YOU CAN GET ME OUT OF HERE! Actually, something to get rid of these rats would be nice. I'd trade you this carrot cake my Aunt Tillie made. I hate carrot cake." }
        ]
      },
      {
        text: "How's the food in there?",
        response: [
          { speaker: "Otis", text: "Oh, you know, the usual... Slop, grog, gruel... Rats, bugs, and body lice if I can catch them. I have a carrot cake my Aunt Tillie made, even though she knows I detest carrot cake." },
          { speaker: "Otis", text: "Actually, the cook at the bar is an old friend of mine, and sometimes he sneaks me food. Like pork trimmings--mostly feet and lips--but once in a while... ...he brings this really odd rump roast..." },
          { speaker: "Guybrush", text: "What was so odd about the rump roast?" },
          { speaker: "Otis", text: "Well, it's the only rump roast I've ever seen with a prehensile tail." }
        ]
      },
      {
        text: "Sheriff Shinetop sure is a jerk, isn't he?",
        response: [
          { speaker: "Otis", text: "No kidding. Fester Shinetop is the meanest man on Mêlée Island. Luckily, the Governor keeps him in check most of the time." }
        ]
      },
      {
        text: "I'll be back later.",
        response: [
          { speaker: "Otis", text: "You'd better go before you get us both in trouble." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SHOPKEEPER
  // ═══════════════════════════════════════════════════════════════
  "shopkeeper_browse": {
    speaker: "Shopkeeper",
    type: "choice",
    intro: [
      { speaker: "Shopkeeper", text: "Ahoy there, fancy pants. Waddya want?" }
    ],
    choices: [
      {
        text: "I could really use a breath mint.",
        response: [
          { speaker: "Shopkeeper", text: "You're telling me! Here take one... ...please. Take a whole roll! That'll be one piece of eight." }
        ],
        requiresMoney: 1,
        givesItem: "breath_mints",
        deductsMoney: 1
      },
      {
        text: "About this sword...",
        response: [
          { speaker: "Shopkeeper", text: "What about it?" },
          { speaker: "Guybrush", text: "How much is it?" },
          { speaker: "Shopkeeper", text: "That's 100 pieces of eight. Take it or leave it." }
        ],
        unlocksChoices: ["buy_sword_choice"]
      },
      {
        id: "buy_sword_choice",
        text: "I'll take the sword.",
        hidden: true,
        oneShot: true,
        response: [
          { speaker: "Shopkeeper", text: "Great. Best 100 pieces of eight you ever spent. What else do you want?" }
        ],
        requiresMoney: 100,
        givesItem: "sword",
        deductsMoney: 100
      },
      {
        text: "About this shovel...",
        response: [
          { speaker: "Shopkeeper", text: "Another would-be treasure hunter, eh? That'll cost you 75 pieces of eight." }
        ],
        unlocksChoices: ["buy_shovel_choice"]
      },
      {
        id: "buy_shovel_choice",
        text: "I'll take the shovel.",
        hidden: true,
        oneShot: true,
        response: [
          { speaker: "Shopkeeper", text: "Great. It'll pay for itself, believe me. You'll dig up 75 pieces of eight in no time. But hey, save some treasure for the rest of us, would ya? Ha ha ha!" }
        ],
        requiresMoney: 75,
        givesItem: "shovel",
        deductsMoney: 75
      },
      {
        text: "I'd like some rat repellent, please.",
        response: [
          { speaker: "Shopkeeper", text: "Hah! I'll bet you would. But I haven't got any. What else do you want?" }
        ]
      },
      {
        text: "I think I'd just like to browse.",
        response: [
          { speaker: "Shopkeeper", text: "Okay, but don't put your lips on anything." }
        ]
      },
      {
        text: "I'm looking for the Sword Master of Mêlée Island.",
        conditions: { "sword_training_done": true },
        response: [
          { speaker: "Shopkeeper", text: "The Sword Master of Mêlée Island? Hmmm... I don't know... Nobody knows the whereabouts of her secret hideout... ...nobody except me. I'd have to go and ask her if it's okay to show you the way." },
          { speaker: "Shopkeeper", text: "Hmmm... I guess I could hike all the way over there... ...ONCE." },
          { speaker: "Shopkeeper", text: "AND DON'T TOUCH ANYTHING!" }
        ],
        setsFlag: "shopkeeper_gone",
        triggersEvent: "shopkeeper_leaves"
      },
      {
        text: "I'm interested in procuring a note of credit.",
        conditions: { "has_business_card": true },
        response: [
          { speaker: "Shopkeeper", text: "You are, are you? Got a job?" },
          { speaker: "Guybrush", text: "Yes, of course I do." },
          { speaker: "Shopkeeper", text: "All right. I'll get one of my notes and we'll fill it out." }
        ],
        setsFlag: "safe_combination_seen",
        triggersEvent: "safe_combination_scene"
      },
      {
        text: "I'll be going now.",
        response: [
          { speaker: "Shopkeeper", text: "Be my guest, fancy pants." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CITIZEN OF MÊLÉE (Street — Map seller)
  // ═══════════════════════════════════════════════════════════════
  "citizen_map": {
    speaker: "Citizen",
    type: "choice",
    intro: [
      { speaker: "Citizen", text: "Excuse me, but do you have a cousin named Sven?" },
      { speaker: "Guybrush", text: "No, but I once had a barber named Dominique." },
      { speaker: "Citizen", text: "Close enough. Let's talk business." }
    ],
    choices: [
      {
        text: "Tell me about the map.",
        response: [
          { speaker: "Citizen", text: "You want to buy a map to the Legendary Lost Treasure of Mêlée Island? Only one in existence. Rare. Very rare. Only 100 pieces of eight..." }
        ],
        unlocksChoices: ["buy_map_choice"]
      },
      {
        id: "buy_map_choice",
        text: "I'll take the map.",
        hidden: true,
        oneShot: true,
        response: [
          { speaker: "Citizen", text: "There ya go. You've made a wise decision. Now get lost." }
        ],
        requiresMoney: 100,
        givesItem: "treasure_map",
        deductsMoney: 100,
        exits: true
      },
      {
        text: "No thanks. I don't have enough money.",
        response: [
          { speaker: "Citizen", text: "Well then, buzz off kid, it's bad for business." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // STREET PIRATES (Men of Low Moral Fiber)
  // ═══════════════════════════════════════════════════════════════
  "street_pirates_dialogue": {
    speaker: "Pirates",
    type: "choice",
    intro: [
      { speaker: "Barrel Pirate", text: "What do you want?" }
    ],
    choices: [
      {
        text: "Hey, nice rat!",
        response: [
          { speaker: "Barrel Pirate", text: "Do you like rats?" },
          { speaker: "Guybrush", text: "Yes, I love rats!" },
          { speaker: "Barrel Pirate", text: "They're very intelligent creatures!" },
          { speaker: "Barrel Pirate", text: "Why, there's a story around these parts that a bunch of rats actually crewed a ship here from fabled Monkey Island." },
          { speaker: "Tall Pirate", text: "No, that's not right. It was actually a group of monkeys." }
        ]
      },
      {
        text: "Say, are you guys pirates?",
        response: [
          { speaker: "Tall Pirate", text: "No, we're a wandering circus troupe." },
          { speaker: "Barrel Pirate", text: "But this rat scared away the elephant." },
          { speaker: "Tall Pirate", text: "Shut up!" },
          { speaker: "Tall Pirate", text: "Of course we're pirates! You can't buy clothes like these off the rack!" }
        ]
      },
      {
        text: "I'll take some minutes if you give me 2 pieces of eight.",
        response: [
          { speaker: "Tall Pirate", text: "OK, that's fair." }
        ],
        givesItem: "minutes",
        addsMoney: 2
      },
      {
        text: "I'll be going now.",
        response: [
          { speaker: "Tall Pirate", text: "Now you've depressed us. Go home." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // FETTUCCINI BROTHERS (Circus)
  // ═══════════════════════════════════════════════════════════════
  "fettuccini_cannon": {
    speaker: "Fettuccini Brothers",
    type: "choice",
    intro: [
      { speaker: "Alfredo", text: "Say there, son, how'd you like a chance--" },
      { speaker: "Bill", text: "--A once in a lifetime chance--" },
      { speaker: "Alfredo", text: "--To perform an amazing feat--" },
      { speaker: "Bill", text: "--A death-defying feat--" },
      { speaker: "Alfredo", text: "--Well, not so death-defying, really--" },
      { speaker: "Bill", text: "--An easy feat--" },
      { speaker: "Alfredo", text: "--But exciting!--" },
      { speaker: "Bill", text: "--With the Amazing, Adventurous, Acrobatic and Exceedingly Well-Known Fabulous, Flying Fettuccini Brothers!" },
      { speaker: "Alfredo", text: "That's us." }
    ],
    choices: [
      {
        text: "How much will you pay me?",
        response: [
          { speaker: "Alfredo", text: "How about 478 pieces of eight?" }
        ],
        unlocksChoices: ["accept_cannon"]
      },
      {
        id: "accept_cannon",
        text: "OK, sounds good.",
        hidden: true,
        response: [
          { speaker: "Alfredo", text: "Have you got a helmet?" }
        ],
        unlocksChoices: ["show_helmet", "no_helmet"]
      },
      {
        id: "no_helmet",
        text: "Er... no, I don't have a helmet. Will I need one?",
        hidden: true,
        response: [
          { speaker: "Bill", text: "No helmet?" },
          { speaker: "Alfredo", text: "Oh, you've got to have a helmet--" },
          { speaker: "Bill", text: "--Can't do the cannon trick without a helmet--" },
          { speaker: "Alfredo", text: "--Nosiree!" },
          { speaker: "Bill", text: "Go get a helmet, and then we can do the trick." }
        ],
        exits: true
      },
      {
        id: "show_helmet",
        text: "Of course I have a helmet. What sort of idiot do you take me for?",
        hidden: true,
        conditions: { hasItem: "pot" },
        response: [
          { speaker: "Bill", text: "Ah, that will work as a helmet!" },
          { speaker: "Alfredo", text: "Now we can do the trick." }
        ],
        triggersPuzzle: "cannon_trick"
      },
      {
        text: "Why are you guys dressed up in those ridiculous outfits?",
        response: [
          { speaker: "Alfredo", text: "These are our professional performance costumes, thank you very much." }
        ]
      },
      {
        text: "No thanks.",
        response: [
          { speaker: "Alfredo", text: "Your loss! We'll just continue arguing about who gets in the cannon." },
          { speaker: "Bill", text: "YOU get in the cannon!" },
          { speaker: "Alfredo", text: "No, YOU get in the cannon!" }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // TROLL (Bridge)
  // ═══════════════════════════════════════════════════════════════
  "troll_dialogue": {
    speaker: "Troll",
    type: "choice",
    intro: [
      { speaker: "Troll", text: "STOP!! You must pay a toll!" }
    ],
    choices: [
      {
        text: "How much is the toll?",
        response: [
          { speaker: "Troll", text: "Well, what have you got?" },
          { speaker: "Troll", text: "I want something that will attract attention, but have no real importance." },
          { speaker: "Troll", text: "Don't be silly. You have three chances to give me what I want. Then... ...I eat ya!" }
        ]
      },
      {
        text: "Stand aside, troll, I'm a mighty pirate.",
        response: [
          { speaker: "Troll", text: "You're no pirate! Why, the town drunk could out-insult you on his back. (...and probably would.)" }
        ]
      },
      {
        text: "Look behind you! A mouse!",
        response: [
          { speaker: "Troll", text: "I'm not falling for that! Scuttle along, you scurvy sea slug!" }
        ]
      },
      {
        text: "Give the fish to the troll.",
        conditions: { hasItem: "fish" },
        response: [
          { speaker: "Troll", text: "Ah! A red herring! Pass." }
        ],
        triggersPuzzle: "bridge_troll"
      },
      {
        text: "I'll come back later.",
        response: [
          { speaker: "Troll", text: "NONE SHALL PASS!!" }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CAPTAIN SMIRK (Sword Training)
  // ═══════════════════════════════════════════════════════════════
  "smirk_training": {
    speaker: "Captain Smirk",
    type: "choice",
    intro: [
      { speaker: "Captain Smirk", text: "What do you want, you wimpy little spineless maggot?" }
    ],
    choices: [
      {
        text: "Could you train me to be better than the Sword Master?",
        response: [
          { speaker: "Captain Smirk", text: "Better than the Sword Master? You? Ha ha ha! You could never be HALF the sword fighter Carla is. Even with hours of hard work and sweatin' blood." },
          { speaker: "Guybrush", text: "I do so have what it takes!" },
          { speaker: "Captain Smirk", text: "You do not!" },
          { speaker: "Guybrush", text: "I do so!" },
          { speaker: "Captain Smirk", text: "I like your spirit. I'll do what I can. Of course... ...it'll cost you. What have you got?" }
        ],
        unlocksChoices: ["pay_smirk"]
      },
      {
        text: "Do you know where the Sword Master lives?",
        response: [
          { speaker: "Captain Smirk", text: "Forget it, kid. She'd cut your head clean off. Unless, of course, you got some training first..." }
        ]
      },
      {
        id: "pay_smirk",
        text: "I've got 30 pieces of eight.",
        hidden: true,
        conditions: { hasMoney: 30 },
        response: [
          { speaker: "Captain Smirk", text: "Say no more, say no more. Let's see your sword." }
        ],
        unlocksChoices: ["show_sword_smirk"]
      },
      {
        id: "show_sword_smirk",
        text: "OK, check it out.",
        hidden: true,
        conditions: { hasItem: "sword" },
        response: [
          { speaker: "Captain Smirk", text: "Yes, this is a nice one. Let's get to it." }
        ],
        triggersPuzzle: "sword_training"
      },
      {
        text: "Maybe I'll just leave instead.",
        response: [
          { speaker: "Captain Smirk", text: "Good idea." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SWORDMASTER CARLA
  // ═══════════════════════════════════════════════════════════════
  "swordmaster_dialogue": {
    speaker: "Swordmaster Carla",
    type: "choice",
    intro: [
      { speaker: "Carla", text: "How dare you approach the Sword Master without permission... Which I surely didn't give you." }
    ],
    choices: [
      {
        text: "Hi, I'm selling these fine leather jackets.",
        response: [
          { speaker: "Carla", text: "Do you have one in size 3? Of course you don't! Because you're not really a jacket salesman! Let's be honest: you're here to prove yourself to the Pirate Leaders, in hopes of one day being as immoral as they are." },
          { speaker: "Guybrush", text: "Yep, nailed right on the head... gee, you're smart." },
          { speaker: "Carla", text: "I can tell by the sarcastic expression on your face that you've been fully trained by Captain Smirk. Let's get this over with." }
        ],
        triggersEvent: "swordmaster_fight"
      },
      {
        text: "I want to challenge you to a sword fight!",
        conditions: { "sword_wins": 5 },
        response: [
          { speaker: "Carla", text: "You again? Fine. Let's get this over with." }
        ],
        triggersEvent: "swordmaster_fight"
      },
      {
        text: "Never mind.",
        response: [
          { speaker: "Carla", text: "That's what I thought." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // COOK (Post-kidnapping)
  // ═══════════════════════════════════════════════════════════════
  "cook_kidnapping": {
    speaker: "Cook",
    type: "choice",
    intro: [
      { speaker: "Cook", text: "The Governor is gone! LeChuck and his spectral crew came and got her! They put her on the ghost ship and spirited her away!" },
      { speaker: "Cook", text: "She was so good to me... ...always conveniently losing those Health Board reports... ...for a small consideration, of course." }
    ],
    choices: [
      {
        text: "What can I do to save her?",
        response: [
          { speaker: "Cook", text: "You must get a ship and go after her! The ghost pirate's lair is on Monkey Island, everybody knows that. All you need to do is find a way there." }
        ]
      },
      {
        text: "Where can I get a ship?",
        response: [
          { speaker: "Cook", text: "Why, at Smilin' Stan's Used Shipyard, same as everybody else. Tell him I sent you, we're old friends." }
        ]
      },
      {
        text: "Will you join me?",
        response: [
          { speaker: "Cook", text: "Er... alas, I cannot go to sea. An old war injury. I'm sure you understand." }
        ]
      },
      {
        text: "Right! I'm off!",
        response: [
          { speaker: "Cook", text: "Good luck! Be sure and wear your mittens. And your galoshes. And don't forget to write. Bye now." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // STAN (Used Ship Salesman)
  // ═══════════════════════════════════════════════════════════════
  "stan_ships": {
    speaker: "Stan",
    type: "choice",
    intro: [
      { speaker: "Stan", text: "Howdy! I'm Stan of Stan's Previously Owned Vessels. ...and I'd stand on my head to make you a deal." },
      { speaker: "Stan", text: "What sort of craft are you looking for? Big? Little? Fast? Slow? You want it, I got it. And if I don't got it, I'll get it." },
      { speaker: "Stan", text: "I want to make you a deal that YOU'RE happy with. Because if YOU'RE not happy, I'M not happy. But I KNOW you're going to leave here happy today." }
    ],
    choices: [
      {
        text: "Let me see the best ship you've got.",
        response: [
          { speaker: "Stan", text: "Hey, it's nice to meet a man who appreciates quality. I've got JUST the boat for you!" },
          { speaker: "Stan", text: "Now this... This is a ship fit for a king! We're talking fifteen staterooms--a fireplace in every one. We're talking two pools--one indoor, one outdoor. We're talking rotating ballroom." },
          { speaker: "Stan", text: "Let's talk about money--YOUR money." },
          { speaker: "Guybrush", text: "Money is no object!" },
          { speaker: "Stan", text: "Well, it is with me. How much you got?" }
        ]
      },
      {
        text: "Something not too expensive, but built to last.",
        response: [
          { speaker: "Stan", text: "Affordable quality? Hey, that's my motto!" },
          { speaker: "Stan", text: "She comes from a land far to the North... where the sea is as unforgiving as the men are tough." }
        ]
      },
      {
        text: "I really don't have that much to spend.",
        response: [
          { speaker: "Stan", text: "Have no fear! Every ship I sell is a bargain! But if you're looking for a real steal..." },
          { speaker: "Stan", text: "This here is the famous 'Sea Monkey.' The only ship ever to make it to Monkey Island... and come back with anyone aboard left alive. Or, should I say, anyTHING." },
          { speaker: "Stan", text: "Some claim it was sailed back by a crew of chimps." },
          { speaker: "Guybrush", text: "Chimps? There aren't any chimps in the Caribbean!" },
          { speaker: "Stan", text: "Oh, shut up. It makes a good story." }
        ]
      },
      {
        text: "I was hoping to get one on credit.",
        response: [
          { speaker: "Stan", text: "Sorry, kid. Neither a borrower nor a lender be. That's just old Stan's philosophy." },
          { speaker: "Stan", text: "If you've got a job, the storekeeper in town might extend you some credit. Then we'd have something to talk about." }
        ]
      },
      {
        text: "I got credit from the storekeeper. Will you take it?",
        conditions: { hasItem: "note_of_credit" },
        response: [
          { speaker: "Stan", text: "Hey, of course! Your credit's always good at Stan's... It doesn't matter if you've had credit problems in the past... Divorce... Bankruptcy... Chronic gambling mishaps..." },
          { speaker: "Stan", text: "Let's get down to brass tacks, shall we? I know you want it... you know you want it... and I know that you know that I want to sell it." }
        ],
        triggersPuzzle: "buy_ship_bargaining"
      },
      {
        text: "I'd like to go think about it some more.",
        response: [
          { speaker: "Stan", text: "Sure, sure. Think it over. I don't want you to feel pressured or anything. Bye now." },
          { speaker: "Stan", text: "I forgot to give you my card." },
          { speaker: "Stan", text: "And here's something else to remember me by." },
          { speaker: "Guybrush", text: "A compass?" },
          { speaker: "Stan", text: "An extra strong magnetic compass--" },
          { speaker: "Guybrush", text: "With your picture on it..." },
          { speaker: "Stan", text: "That's right! It always points directly back here. I'll be right here when you come back. But I can't guarantee that any of these ships will!" }
        ],
        givesItems: ["business_card", "magnetic_compass"],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MEATHOOK
  // ═══════════════════════════════════════════════════════════════
  "meathook_intro": {
    speaker: "Meathook",
    type: "choice",
    intro: [
      { speaker: "Meathook", text: "Hey! I don't like visitors! Who are you?" }
    ],
    choices: [
      {
        text: "I'm a pirate, cannonball-head. Who are you?",
        response: [
          { speaker: "Meathook", text: "My name's Meathook... ...and I think you've got a little attitude problem." },
          { speaker: "Guybrush", text: "I'm sorry. I didn't mean to call you cannonball-head." },
          { speaker: "Meathook", text: "That's okay. I'd rather have a cannonball-head than a pony tail. Ha ha ha!" }
        ]
      },
      {
        text: "The Governor's been KIDNAPPED!",
        conditions: { "ghost_ship_seen": true },
        response: [
          { speaker: "Meathook", text: "What? That's preposterous!" },
          { speaker: "Guybrush", text: "Oh really? Take a look at this note they left." },
          { speaker: "Meathook", text: "Oh no. This is horrible! What are we going to do?" },
          { speaker: "Guybrush", text: "We could get a crew together and sail off after them." },
          { speaker: "Meathook", text: "What an idea! Now, if only we had a captain..." },
          { speaker: "Guybrush", text: "What about me?" },
          { speaker: "Meathook", text: "YOU? HA HA HA HA! That's a good one." },
          { speaker: "Guybrush", text: "Hey, I'm serious." },
          { speaker: "Meathook", text: "Really?" },
          { speaker: "Guybrush", text: "Really." },
          { speaker: "Meathook", text: "Okay, let's see you prove it. Walk this way." }
        ],
        unlocksChoices: ["touch_beast"],
        triggersEvent: "beast_challenge"
      },
      {
        id: "touch_beast",
        text: "I'm ready to face the beast.",
        hidden: true,
        response: [
          { speaker: "Meathook", text: "There's something in here that I want to show you. ...something horrible. Something so horrible that I stay awake at night just thinking about it..." },
          { speaker: "Meathook", text: "I'll let you open this last door yourself. Just let me get out of your way." }
        ],
        triggersEvent: "open_beast_door"
      },
      {
        text: "Excuse me, but the sign said there were restrooms in here?",
        response: [
          { speaker: "Meathook", text: "Sorry, but that sign's a little out of date. I used to have a thriving tourist business here. I had animal acts, tattoo demonstrations, souvenirs..." },
          { speaker: "Meathook", text: "But there was a little accident with one of the trained animals... one of our guests was hurt very badly. So I was shut down, put out of business." },
          { speaker: "Meathook", text: "And since then I've lived here all alone... and the only company I have is the same beast that mauled that unlucky tourist." }
        ]
      },
      {
        text: "I'll be going now.",
        response: [
          { speaker: "Meathook", text: "Can't you just leave me alone now?" }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // GOVERNOR MARLEY (Dock scene after underwater)
  // ═══════════════════════════════════════════════════════════════
  "governor_dialogue": {
    speaker: "Governor Elaine Marley",
    type: "linear",
    lines: [
      { speaker: "Governor", text: "You're alive!" },
      { speaker: "Guybrush", text: "Governor!" },
      { speaker: "Governor", text: "Hey, you can talk! Who'd have known?" },
      { speaker: "Guybrush", text: "What are YOU doing here? Come to finish the job?" },
      { speaker: "Governor", text: "No, I came down here to save your life. Fester wasn't acting on MY orders when he threw you in there." },
      { speaker: "Guybrush", text: "You came down here to rescue me? I didn't even think you liked me." },
      { speaker: "Governor", text: "Well, our first meeting was a little awkward... You seemed to have trouble forming complete sentences. But, then again, so do most of my citizens." },
      { speaker: "Guybrush", text: "Oh, Governor..." },
      { speaker: "Governor", text: "Oh, Threepwood..." },
      { speaker: "Guybrush", text: "Oh, Elaine!" },
      { speaker: "Governor", text: "Oh, Guybrush!" },
      { speaker: "Guybrush", text: "Honey pumpkin!" },
      { speaker: "Governor", text: "Plunder bunny!" },
      { speaker: "Guybrush", text: "Kiss me!" },
      { speaker: "Governor", text: "No! We mustn't! Not here, where everyone can see us." },
      { speaker: "Governor", text: "But finish your trials first. I don't want you to be... preoccupied." },
      { speaker: "Guybrush", text: "I feel this sudden urge to complete the trials... quickly." }
    ],
    onComplete: null,
    repeatLine: "Finish your trials, Threepwood."
  },

  // ═══════════════════════════════════════════════════════════════
  // PIRATE FIGHT INTRO (Random encounters)
  // ═══════════════════════════════════════════════════════════════
  "pirate_fight_intro": {
    speaker: "Wandering Pirate",
    type: "choice",
    intro: [
      { speaker: "Pirate", text: "Aye! This better be importan'." }
    ],
    choices: [
      {
        text: "My name is Guybrush Threepwood. Prepare to die!",
        response: [],
        triggersEvent: "insult_sword_fight"
      },
      {
        text: "Nice night we're having, isn't it?",
        response: [
          { speaker: "Pirate", text: "I sure hopes ya had sumpting more importan' ta stop me for?" }
        ]
      },
      {
        text: "How do you guys talk so funny?",
        response: [
          { speaker: "Pirate", text: "Pirate Lingo! It's how everybody talked back then. Come on Guybrush, play along." }
        ]
      },
      {
        text: "Ever notice how all these roads start to look the same?",
        response: [
          { speaker: "Pirate", text: "Yeah! Now that you mention it, they do. It's probably just that we're tired." }
        ]
      },
      {
        text: "Sorry, wrong person.",
        response: [
          { speaker: "Pirate", text: "Hmph." }
        ],
        exits: true
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // COOK (Kitchen — pre-kidnapping)
  // ═══════════════════════════════════════════════════════════════
  "cook_dialogue": {
    speaker: "Cook",
    type: "linear",
    lines: [
      { speaker: "Cook", text: "Hey! What are you doing in my kitchen? Get out!" },
      { speaker: "Guybrush", text: "I was just looking for a snack." },
      { speaker: "Cook", text: "A snack?! This is a professional kitchen, not a buffet! Now get out before I hit you with this ladle!" }
    ],
    onComplete: null,
    repeatLine: "Get out of my kitchen!"
  }
};
