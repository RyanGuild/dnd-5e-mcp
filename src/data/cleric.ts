// D&D 5e Cleric Class Data and Progression

export interface ClericProgression {
  level: number;
  proficiencyBonus: number;
  features: string[];
  cantripsKnown: number;
  spellSlots: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    level6: number;
    level7: number;
    level8: number;
    level9: number;
  };
}

export interface DivineDomain {
  name: string;
  description: string;
  domainSpells: {
    [level: number]: string[];
  };
  features: {
    [level: number]: DomainFeature[];
  };
  channelDivinityOptions: ChannelDivinityOption[];
}

export interface DomainFeature {
  name: string;
  description: string;
  level: number;
}

export interface ChannelDivinityOption {
  name: string;
  description: string;
  level: number;
  usage: string;
}

export interface ClericFeature {
  name: string;
  description: string;
  level: number;
}

// Cleric Class Progression Table
export const CLERIC_PROGRESSION: { [level: number]: ClericProgression } = {
  1: {
    level: 1,
    proficiencyBonus: 2,
    features: ['Spellcasting', 'Divine Domain'],
    cantripsKnown: 3,
    spellSlots: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  2: {
    level: 2,
    proficiencyBonus: 2,
    features: ['Channel Divinity (1/rest)', 'Divine Domain feature'],
    cantripsKnown: 3,
    spellSlots: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  3: {
    level: 3,
    proficiencyBonus: 2,
    features: [],
    cantripsKnown: 3,
    spellSlots: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  4: {
    level: 4,
    proficiencyBonus: 2,
    features: ['Ability Score Improvement'],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  5: {
    level: 5,
    proficiencyBonus: 3,
    features: ['Destroy Undead (CR 1/2)'],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  6: {
    level: 6,
    proficiencyBonus: 3,
    features: ['Channel Divinity (2/rest)', 'Divine Domain feature'],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  7: {
    level: 7,
    proficiencyBonus: 3,
    features: [],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 1, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  8: {
    level: 8,
    proficiencyBonus: 3,
    features: ['Ability Score Improvement', 'Destroy Undead (CR 1)', 'Divine Domain feature'],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 2, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  9: {
    level: 9,
    proficiencyBonus: 4,
    features: [],
    cantripsKnown: 4,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 1, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  10: {
    level: 10,
    proficiencyBonus: 4,
    features: ['Divine Intervention'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 0, level7: 0, level8: 0, level9: 0 }
  },
  11: {
    level: 11,
    proficiencyBonus: 4,
    features: ['Destroy Undead (CR 2)'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 }
  },
  12: {
    level: 12,
    proficiencyBonus: 4,
    features: ['Ability Score Improvement'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 }
  },
  13: {
    level: 13,
    proficiencyBonus: 5,
    features: [],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 }
  },
  14: {
    level: 14,
    proficiencyBonus: 5,
    features: ['Destroy Undead (CR 3)'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 }
  },
  15: {
    level: 15,
    proficiencyBonus: 5,
    features: [],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 }
  },
  16: {
    level: 16,
    proficiencyBonus: 5,
    features: ['Ability Score Improvement'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 }
  },
  17: {
    level: 17,
    proficiencyBonus: 6,
    features: ['Destroy Undead (CR 4)', 'Divine Domain feature'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 1 }
  },
  18: {
    level: 18,
    proficiencyBonus: 6,
    features: ['Channel Divinity (3/rest)'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 1, level7: 1, level8: 1, level9: 1 }
  },
  19: {
    level: 19,
    proficiencyBonus: 6,
    features: ['Ability Score Improvement'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 1, level8: 1, level9: 1 }
  },
  20: {
    level: 20,
    proficiencyBonus: 6,
    features: ['Divine Intervention improvement'],
    cantripsKnown: 5,
    spellSlots: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 2, level8: 1, level9: 1 }
  }
};

// Core Cleric Features
export const CLERIC_FEATURES: ClericFeature[] = [
  {
    name: 'Spellcasting',
    description: 'You can cast cleric spells. Wisdom is your spellcasting ability for your cleric spells.',
    level: 1
  },
  {
    name: 'Divine Domain',
    description: 'Choose a domain related to your deity. Your choice grants you domain spells and other features.',
    level: 1
  },
  {
    name: 'Channel Divinity',
    description: 'You can channel divine energy to fuel magical effects. You start with two effects: Turn Undead and an effect determined by your domain.',
    level: 2
  },
  {
    name: 'Ability Score Improvement',
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    level: 4
  },
  {
    name: 'Destroy Undead',
    description: 'When an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold.',
    level: 5
  },
  {
    name: 'Divine Intervention',
    description: 'You can call on your deity to intervene on your behalf when your need is great.',
    level: 10
  }
];

// Divine Domains
export const DIVINE_DOMAINS: { [name: string]: DivineDomain } = {
  Knowledge: {
    name: 'Knowledge',
    description: 'The gods of knowledge value learning and understanding above all.',
    domainSpells: {
      1: ['Command', 'Identify'],
      3: ['Augury', 'Suggestion'],
      5: ['Nondetection', 'Speak with Dead'],
      7: ['Arcane Eye', 'Confusion'],
      9: ['Legend Lore', 'Scrying']
    },
    features: {
      1: [{
        name: 'Blessings of Knowledge',
        description: 'You learn two languages of your choice. You also become proficient in your choice of two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for any ability check you make that uses either of those skills.',
        level: 1
      }],
      2: [{
        name: 'Knowledge of the Ages',
        description: 'You can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.',
        level: 2
      }],
      6: [{
        name: 'Read Thoughts',
        description: 'You can use your Channel Divinity to read a creature\'s thoughts. You can then use your access to the creature\'s mind to command it.',
        level: 6
      }],
      8: [{
        name: 'Potent Spellcasting',
        description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
        level: 8
      }],
      17: [{
        name: 'Visions of the Past',
        description: 'You can call up visions of the past that relate to an object you hold or your immediate surroundings.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Knowledge of the Ages',
        description: 'You can use your Channel Divinity to tap into a divine well of knowledge.',
        level: 2,
        usage: 'Action'
      },
      {
        name: 'Read Thoughts',
        description: 'You can use your Channel Divinity to read a creature\'s thoughts.',
        level: 6,
        usage: 'Action'
      }
    ]
  },

  Life: {
    name: 'Life',
    description: 'The Life domain focuses on the vibrant positive energy that sustains all life.',
    domainSpells: {
      1: ['Bless', 'Cure Wounds'],
      3: ['Lesser Restoration', 'Spiritual Weapon'],
      5: ['Beacon of Hope', 'Revivify'],
      7: ['Death Ward', 'Guardian of Faith'],
      9: ['Mass Cure Wounds', 'Raise Dead']
    },
    features: {
      1: [{
        name: 'Bonus Proficiency',
        description: 'You gain proficiency with heavy armor.',
        level: 1
      }, {
        name: 'Disciple of Life',
        description: 'Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell\'s level.',
        level: 1
      }],
      2: [{
        name: 'Preserve Life',
        description: 'You can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level.',
        level: 2
      }],
      6: [{
        name: 'Blessed Healer',
        description: 'The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell\'s level.',
        level: 6
      }],
      8: [{
        name: 'Divine Strike',
        description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target.',
        level: 8
      }],
      17: [{
        name: 'Supreme Healing',
        description: 'When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Preserve Life',
        description: 'You can use your Channel Divinity to heal the badly injured.',
        level: 2,
        usage: 'Action'
      }
    ]
  },

  Light: {
    name: 'Light',
    description: 'Gods of light promote the ideals of rebirth and renewal, truth, vigilance, and beauty.',
    domainSpells: {
      1: ['Burning Hands', 'Faerie Fire'],
      3: ['Flaming Sphere', 'Scorching Ray'],
      5: ['Daylight', 'Fireball'],
      7: ['Guardian of Faith', 'Wall of Fire'],
      9: ['Flame Strike', 'Scrying']
    },
    features: {
      1: [{
        name: 'Bonus Cantrip',
        description: 'You gain the Light cantrip if you don\'t already know it. This cantrip doesn\'t count against the number of cleric cantrips you know.',
        level: 1
      }, {
        name: 'Warding Flare',
        description: 'You can interpose divine light between yourself and an attacking enemy. When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses.',
        level: 1
      }],
      2: [{
        name: 'Radiance of the Dawn',
        description: 'You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes.',
        level: 2
      }],
      6: [{
        name: 'Improved Flare',
        description: 'You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you.',
        level: 6
      }],
      8: [{
        name: 'Potent Spellcasting',
        description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
        level: 8
      }],
      17: [{
        name: 'Corona of Light',
        description: 'You can use your action to activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Radiance of the Dawn',
        description: 'You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes.',
        level: 2,
        usage: 'Action'
      }
    ]
  },

  Nature: {
    name: 'Nature',
    description: 'Gods of nature are as varied as the natural world itself.',
    domainSpells: {
      1: ['Animal Friendship', 'Speak with Animals'],
      3: ['Barkskin', 'Spike Growth'],
      5: ['Plant Growth', 'Wind Wall'],
      7: ['Dominate Beast', 'Grasping Vine'],
      9: ['Insect Plague', 'Tree Stride']
    },
    features: {
      1: [{
        name: 'Acolyte of Nature',
        description: 'You learn one druid cantrip of your choice. You also gain proficiency in one of the following skills of your choice: Animal Handling, Nature, or Survival.',
        level: 1
      }, {
        name: 'Bonus Proficiency',
        description: 'You gain proficiency with heavy armor.',
        level: 1
      }],
      2: [{
        name: 'Charm Animals and Plants',
        description: 'You can use your Channel Divinity to charm animals and plants.',
        level: 2
      }],
      6: [{
        name: 'Dampen Elements',
        description: 'When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.',
        level: 6
      }],
      8: [{
        name: 'Divine Strike',
        description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice) to the target.',
        level: 8
      }],
      17: [{
        name: 'Master of Nature',
        description: 'You gain the ability to command animals and plant creatures.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Charm Animals and Plants',
        description: 'You can use your Channel Divinity to charm animals and plants.',
        level: 2,
        usage: 'Action'
      }
    ]
  },

  Tempest: {
    name: 'Tempest',
    description: 'Gods whose portfolios include the Tempest domain govern storms, sea, and sky.',
    domainSpells: {
      1: ['Fog Cloud', 'Thunderwave'],
      3: ['Gust of Wind', 'Shatter'],
      5: ['Call Lightning', 'Sleet Storm'],
      7: ['Control Water', 'Ice Storm'],
      9: ['Destructive Wave', 'Insect Plague']
    },
    features: {
      1: [{
        name: 'Bonus Proficiencies',
        description: 'You gain proficiency with martial weapons and heavy armor.',
        level: 1
      }, {
        name: 'Wrath of the Storm',
        description: 'When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one.',
        level: 1
      }],
      2: [{
        name: 'Destructive Wrath',
        description: 'You can use your Channel Divinity to wield the power of the storm with unchecked ferocity.',
        level: 2
      }],
      6: [{
        name: 'Thunderbolt Strike',
        description: 'When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.',
        level: 6
      }],
      8: [{
        name: 'Divine Strike',
        description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 thunder damage to the target.',
        level: 8
      }],
      17: [{
        name: 'Stormborn',
        description: 'You have a flying speed equal to your current walking speed whenever you are not underground or indoors.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Destructive Wrath',
        description: 'You can use your Channel Divinity to wield the power of the storm with unchecked ferocity.',
        level: 2,
        usage: 'Channel Divinity'
      }
    ]
  },

  Trickery: {
    name: 'Trickery',
    description: 'Gods of trickery are mischief-makers and instigators who stand as a constant challenge to the accepted order.',
    domainSpells: {
      1: ['Charm Person', 'Disguise Self'],
      3: ['Mirror Image', 'Pass without Trace'],
      5: ['Blink', 'Dispel Magic'],
      7: ['Dimension Door', 'Polymorph'],
      9: ['Dominate Person', 'Modify Memory']
    },
    features: {
      1: [{
        name: 'Blessing of the Trickster',
        description: 'You can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks. This blessing lasts for 1 hour or until you use this feature again.',
        level: 1
      }],
      2: [{
        name: 'Invoke Duplicity',
        description: 'You can use your Channel Divinity to create an illusory duplicate of yourself.',
        level: 2
      }],
      6: [{
        name: 'Channel Divinity: Cloak of Shadows',
        description: 'You can use your Channel Divinity to vanish.',
        level: 6
      }],
      8: [{
        name: 'Divine Strike',
        description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 poison damage to the target.',
        level: 8
      }],
      17: [{
        name: 'Improved Duplicity',
        description: 'You can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Invoke Duplicity',
        description: 'You can use your Channel Divinity to create an illusory duplicate of yourself.',
        level: 2,
        usage: 'Action'
      },
      {
        name: 'Cloak of Shadows',
        description: 'You can use your Channel Divinity to vanish.',
        level: 6,
        usage: 'Action'
      }
    ]
  },

  War: {
    name: 'War',
    description: 'War has many manifestations. It can make heroes of ordinary people. It can be desperate and horrific, with acts of cruelty and cowardice eclipsing instances of excellence and courage.',
    domainSpells: {
      1: ['Divine Favor', 'Shield of Faith'],
      3: ['Magic Weapon', 'Spiritual Weapon'],
      5: ['Crusader\'s Mantle', 'Spirit Guardians'],
      7: ['Freedom of Movement', 'Stoneskin'],
      9: ['Flame Strike', 'Hold Monster']
    },
    features: {
      1: [{
        name: 'Bonus Proficiencies',
        description: 'You gain proficiency with martial weapons and heavy armor.',
        level: 1
      }, {
        name: 'War Priest',
        description: 'When you use the Attack action, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.',
        level: 1
      }],
      2: [{
        name: 'Guided Strike',
        description: 'You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
        level: 2
      }],
      6: [{
        name: 'War Domain Spells',
        description: 'You gain additional spells at certain levels.',
        level: 6
      }],
      8: [{
        name: 'Divine Strike',
        description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon to the target.',
        level: 8
      }],
      17: [{
        name: 'Avatar of Battle',
        description: 'You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.',
        level: 17
      }]
    },
    channelDivinityOptions: [
      {
        name: 'Guided Strike',
        description: 'You can use your Channel Divinity to strike with supernatural accuracy.',
        level: 2,
        usage: 'Channel Divinity'
      }
    ]
  }
};

// Cleric Proficiencies
export const CLERIC_PROFICIENCIES = {
  armor: ['light', 'medium', 'shield'],
  weapons: ['simple'],
  tools: [],
  savingThrows: ['wisdom', 'charisma'],
  skills: {
    choose: 2,
    from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion']
  }
};

// Channel Divinity uses per rest
export function getChannelDivinityUses(level: number): number {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  if (level >= 2) return 1;
  return 0;
}

// Destroy Undead CR threshold
export function getDestroyUndeadCR(level: number): number {
  if (level >= 17) return 4;
  if (level >= 14) return 3;
  if (level >= 11) return 2;
  if (level >= 8) return 1;
  if (level >= 5) return 0.5;
  return 0;
}

// Calculate spells prepared
export function calculateSpellsPrepared(clericLevel: number, wisdomModifier: number): number {
  return Math.max(1, clericLevel + wisdomModifier);
}