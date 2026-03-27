/**
 * The Secret of Monkey Island — Insult Sword Fighting System
 * All insults and comebacks for Part I: The Three Trials
 */
window.GameData = window.GameData || {};

GameData.insults = {
  // ─────────────────────────────────────────────────────────────
  // Pirate Insults (used by random pirates on the island map)
  // ─────────────────────────────────────────────────────────────
  pirate: [
    {
      id: "p1",
      insult: "This is the END for you, you gutter-crawling cur!",
      comeback_id: "c1"
    },
    {
      id: "p2",
      insult: "Soon you'll be wearing my sword like a shish kebab!",
      comeback_id: "c2"
    },
    {
      id: "p3",
      insult: "My handkerchief will wipe up your blood!",
      comeback_id: "c3"
    },
    {
      id: "p4",
      insult: "People fall at my feet when they see me coming.",
      comeback_id: "c4"
    },
    {
      id: "p5",
      insult: "I once owned a dog that was smarter than you.",
      comeback_id: "c5"
    },
    {
      id: "p6",
      insult: "You make me want to puke.",
      comeback_id: "c6"
    },
    {
      id: "p7",
      insult: "Nobody's ever drawn blood from me and nobody ever will.",
      comeback_id: "c7"
    },
    {
      id: "p8",
      insult: "You fight like a dairy farmer.",
      comeback_id: "c8"
    },
    {
      id: "p9",
      insult: "I got this scar on my face during a mighty struggle!",
      comeback_id: "c9"
    },
    {
      id: "p10",
      insult: "Have you stopped wearing diapers yet?",
      comeback_id: "c10"
    },
    {
      id: "p11",
      insult: "I've heard you were a contemptible sneak.",
      comeback_id: "c11"
    },
    {
      id: "p12",
      insult: "You're no match for my brains, you poor fool.",
      comeback_id: "c12"
    },
    {
      id: "p13",
      insult: "You have the manners of a beggar.",
      comeback_id: "c13"
    },
    {
      id: "p14",
      insult: "I'm not going to take your insolence sitting down!",
      comeback_id: "c14"
    },
    {
      id: "p15",
      insult: "There are no words for how disgusting you are.",
      comeback_id: "c15"
    },
    {
      id: "p16",
      insult: "I've spoken with apes more polite than you.",
      comeback_id: "c16"
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // Swordmaster Insults (Carla uses DIFFERENT insults,
  // but the SAME comebacks — that's the trick!)
  // ─────────────────────────────────────────────────────────────
  swordmaster: [
    {
      id: "sm1",
      insult: "I've got a long, sharp lesson for you to learn today.",
      comeback_id: "c1"
    },
    {
      id: "sm2",
      insult: "My tongue is sharper than any sword.",
      comeback_id: "c2"
    },
    {
      id: "sm3",
      insult: "My name is feared in every dirty corner of this island!",
      comeback_id: "c3"
    },
    {
      id: "sm4",
      insult: "My wisest enemies run away at the first sight of me!",
      comeback_id: "c4"
    },
    {
      id: "sm5",
      insult: "Only once have I met such a coward!",
      comeback_id: "c5"
    },
    {
      id: "sm6",
      insult: "If your brother's like you, better to marry a pig.",
      comeback_id: "c6"
    },
    {
      id: "sm7",
      insult: "No one will ever catch ME fighting as badly as you do.",
      comeback_id: "c7"
    },
    {
      id: "sm8",
      insult: "I will milk every drop of blood from your body!",
      comeback_id: "c8"
    },
    {
      id: "sm9",
      insult: "My last fight ended with my hands covered with blood.",
      comeback_id: "c9"
    },
    {
      id: "sm10",
      insult: "I hope you have a boat ready for a quick escape.",
      comeback_id: "c10"
    },
    {
      id: "sm11",
      insult: "My sword is famous all over the Caribbean!",
      comeback_id: "c11"
    },
    {
      id: "sm12",
      insult: "I've got the courage and skill of a master swordsman!",
      comeback_id: "c12"
    },
    {
      id: "sm13",
      insult: "Every word you say to me is stupid.",
      comeback_id: "c13"
    },
    {
      id: "sm14",
      insult: "You are a pain in the backside, sir!",
      comeback_id: "c14"
    },
    {
      id: "sm15",
      insult: "There are no clever moves that can help you now.",
      comeback_id: "c15"
    },
    {
      id: "sm16",
      insult: "Now I know what filth and stupidity really are.",
      comeback_id: "c16"
    },
    {
      id: "sm17",
      insult: "I usually see people like you passed-out on tavern floors.",
      comeback_id: "c4"
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // Comebacks (shared between pirate and swordmaster fights)
  // ─────────────────────────────────────────────────────────────
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
  },

  // ─────────────────────────────────────────────────────────────
  // Fight configuration
  // ─────────────────────────────────────────────────────────────
  config: {
    pirate: {
      roundsToWin: 3,
      minInsultsKnown: 3,
      maxInsultsKnown: 6,
      winsToChallengeSwordmaster: 5
    },
    swordmaster: {
      roundsToWin: 5,
      knowsAllInsults: true,
      knowsAllComebacks: true
    }
  }
};
