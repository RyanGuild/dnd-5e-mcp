// D&D 5e Barbarian Class Data and Progression

export interface BarbarianProgression {
  level: number;
  proficiencyBonus: number;
  features: string[];
  rages: number;
  rageDamage: number;
}

export interface PrimalPath {
  name: string;
  description: string;
  features: {
    [level: number]: PathFeature[];
  };
}

export interface PathFeature {
  name: string;
  description: string;
  level: number;
}

export interface BarbarianFeature {
  name: string;
  description: string;
  level: number;
}

// Barbarian Class Progression Table
export const BARBARIAN_PROGRESSION: { [level: number]: BarbarianProgression } = {
  1: {
    level: 1,
    proficiencyBonus: 2,
    features: ['Rage', 'Unarmored Defense'],
    rages: 2,
    rageDamage: 2
  },
  2: {
    level: 2,
    proficiencyBonus: 2,
    features: ['Reckless Attack', 'Danger Sense'],
    rages: 2,
    rageDamage: 2
  },
  3: {
    level: 3,
    proficiencyBonus: 2,
    features: ['Primal Path'],
    rages: 3,
    rageDamage: 2
  },
  4: {
    level: 4,
    proficiencyBonus: 2,
    features: ['Ability Score Improvement'],
    rages: 3,
    rageDamage: 2
  },
  5: {
    level: 5,
    proficiencyBonus: 3,
    features: ['Extra Attack', 'Fast Movement'],
    rages: 3,
    rageDamage: 2
  },
  6: {
    level: 6,
    proficiencyBonus: 3,
    features: ['Path Feature'],
    rages: 4,
    rageDamage: 2
  },
  7: {
    level: 7,
    proficiencyBonus: 3,
    features: ['Feral Instinct'],
    rages: 4,
    rageDamage: 2
  },
  8: {
    level: 8,
    proficiencyBonus: 3,
    features: ['Ability Score Improvement'],
    rages: 4,
    rageDamage: 2
  },
  9: {
    level: 9,
    proficiencyBonus: 4,
    features: ['Brutal Critical (1 die)'],
    rages: 4,
    rageDamage: 3
  },
  10: {
    level: 10,
    proficiencyBonus: 4,
    features: ['Path Feature'],
    rages: 4,
    rageDamage: 3
  },
  11: {
    level: 11,
    proficiencyBonus: 4,
    features: ['Relentless Rage'],
    rages: 4,
    rageDamage: 3
  },
  12: {
    level: 12,
    proficiencyBonus: 4,
    features: ['Ability Score Improvement'],
    rages: 5,
    rageDamage: 3
  },
  13: {
    level: 13,
    proficiencyBonus: 5,
    features: ['Brutal Critical (2 dice)'],
    rages: 5,
    rageDamage: 3
  },
  14: {
    level: 14,
    proficiencyBonus: 5,
    features: ['Path Feature'],
    rages: 5,
    rageDamage: 3
  },
  15: {
    level: 15,
    proficiencyBonus: 5,
    features: ['Persistent Rage'],
    rages: 5,
    rageDamage: 3
  },
  16: {
    level: 16,
    proficiencyBonus: 5,
    features: ['Ability Score Improvement'],
    rages: 5,
    rageDamage: 4
  },
  17: {
    level: 17,
    proficiencyBonus: 6,
    features: ['Brutal Critical (3 dice)'],
    rages: 6,
    rageDamage: 4
  },
  18: {
    level: 18,
    proficiencyBonus: 6,
    features: ['Indomitable Might'],
    rages: 6,
    rageDamage: 4
  },
  19: {
    level: 19,
    proficiencyBonus: 6,
    features: ['Ability Score Improvement'],
    rages: 6,
    rageDamage: 4
  },
  20: {
    level: 20,
    proficiencyBonus: 6,
    features: ['Primal Champion'],
    rages: Infinity,
    rageDamage: 4
  }
};

// Core Barbarian Features
export const BARBARIAN_FEATURES: BarbarianFeature[] = [
  {
    name: 'Rage',
    description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, bonus damage to melee weapon attacks using Strength, and resistance to bludgeoning, piercing, and slashing damage. Your rage lasts for 1 minute and ends early if you are knocked unconscious or if your turn ends and you haven\'t attacked a hostile creature or taken damage since your last turn.',
    level: 1
  },
  {
    name: 'Unarmored Defense',
    description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.',
    level: 1
  },
  {
    name: 'Reckless Attack',
    description: 'When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.',
    level: 2
  },
  {
    name: 'Danger Sense',
    description: 'You gain advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can\'t be blinded, deafened, or incapacitated.',
    level: 2
  },
  {
    name: 'Primal Path',
    description: 'You choose a path that shapes the nature of your rage. Your choice grants you features at 3rd level and again at 6th, 10th, and 14th levels.',
    level: 3
  },
  {
    name: 'Extra Attack',
    description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
    level: 5
  },
  {
    name: 'Fast Movement',
    description: 'Your speed increases by 10 feet while you aren\'t wearing heavy armor.',
    level: 5
  },
  {
    name: 'Feral Instinct',
    description: 'You have advantage on initiative rolls. Additionally, if you are surprised at the beginning of combat and aren\'t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.',
    level: 7
  },
  {
    name: 'Brutal Critical',
    description: 'You can roll additional weapon damage dice when determining the extra damage for a critical hit with a melee attack. One additional die at 9th level, two additional dice at 13th level, and three additional dice at 17th level.',
    level: 9
  },
  {
    name: 'Relentless Rage',
    description: 'When you are reduced to 0 hit points but not killed outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead. Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.',
    level: 11
  },
  {
    name: 'Persistent Rage',
    description: 'Your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
    level: 15
  },
  {
    name: 'Indomitable Might',
    description: 'If your total for a Strength check is less than your Strength score, you can use that score in place of the total.',
    level: 18
  },
  {
    name: 'Primal Champion',
    description: 'Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.',
    level: 20
  }
];

// Primal Paths (Subclasses)
export const PRIMAL_PATHS: { [name: string]: PrimalPath } = {
  Berserker: {
    name: 'Path of the Berserker',
    description: 'For some barbarians, rage is a means to an end—that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood.',
    features: {
      3: [{
        name: 'Frenzy',
        description: 'You can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
        level: 3
      }],
      6: [      {
        name: 'Mindless Rage',
        description: 'You can\'t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.',
        level: 6
      }],
      10: [{
        name: 'Intimidating Presence',
        description: 'You can use your action to frighten someone with your menacing presence. Choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn.',
        level: 10
      }],
      14: [{
        name: 'Retaliation',
        description: 'When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
        level: 14
      }]
    }
  },
  'Totem Warrior': {
    name: 'Path of the Totem Warrior',
    description: 'The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration.',
    features: {
      3: [{
        name: 'Spirit Seeker',
        description: 'You gain the ability to cast the beast sense and speak with animals spells, but only as rituals.',
        level: 3
      },
      {
        name: 'Totem Spirit',
        description: 'Choose a totem spirit and gain its feature: Bear (resistance to all damage except psychic while raging), Eagle (others have disadvantage on opportunity attacks against you, and you can use Dash as a bonus action), or Wolf (friends have advantage on melee attacks against enemies within 5 feet of you).',
        level: 3
      }],
      6: [{
        name: 'Aspect of the Beast',
        description: 'You gain a magical benefit based on the totem animal of your choice: Bear (carry capacity doubles, advantage on Strength checks), Eagle (you can see up to 1 mile away, no disadvantage on Perception checks in dim light), or Wolf (you can track while traveling at a fast pace, and move stealthily at a normal pace).',
        level: 6
      }],
      10: [{
        name: 'Spirit Walker',
        description: 'You can cast the commune with nature spell, but only as a ritual.',
        level: 10
      }],
      14: [{
        name: 'Totemic Attunement',
        description: 'You gain a magical benefit based on your totem spirit: Bear (while raging, enemies within 5 feet have disadvantage on attacks against others), Eagle (while raging, you can fly at your walking speed), or Wolf (while raging, you can knock Large or smaller creatures prone when you hit with melee attacks).',
        level: 14
      }]
    }
  }
};

// Barbarian Proficiencies
export const BARBARIAN_PROFICIENCIES = {
  armor: ['light', 'medium', 'shield'],
  weapons: ['simple', 'martial'],
  tools: [],
  savingThrows: ['strength', 'constitution'],
  skills: {
    choose: 2,
    from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival']
  }
};

// Helper Functions
export function getRageCount(level: number): number {
  return BARBARIAN_PROGRESSION[level].rages;
}

export function getRageDamage(level: number): number {
  return BARBARIAN_PROGRESSION[level].rageDamage;
}

export function getBrutalCriticalDice(level: number): number {
  if (level >= 17) return 3;
  if (level >= 13) return 2;
  if (level >= 9) return 1;
  return 0;
}