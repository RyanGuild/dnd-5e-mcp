import { z } from 'zod';

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
  type: 'passive' | 'action' | 'bonus_action' | 'reaction' | 'resource';
  uses?: number;
  usesType?: 'per_rest' | 'per_long_rest' | 'per_short_rest' | 'per_day';
  rechargeOn?: 'short_rest' | 'long_rest';
  optional?: boolean;
}

// Zod schema for ClassFeature validation
export const ClassFeatureSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(1).max(20),
  description: z.string().min(1),
  type: z.enum(['passive', 'action', 'bonus_action', 'reaction', 'resource']),
  uses: z.number().min(1).optional(),
  usesType: z.enum(['per_rest', 'per_long_rest', 'per_short_rest', 'per_day']).optional(),
  rechargeOn: z.enum(['short_rest', 'long_rest']).optional(),
  optional: z.boolean().optional()
});

export interface FightingStyle {
  name: string;
  description: string;
  effect: string;
}

export interface ClassData {
  name: string;
  hitDie: number;
  primaryAbility: string[];
  savingThrowProficiencies: string[];
  skillChoices: {
    choose: number;
    from: string[];
  };
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  startingEquipment: {
    choices: Array<{
      choose: number;
      from: string[];
    }>;
    equipment: string[];
  };
  features: ClassFeature[];
  subclasses?: string[];
  spellcasting?: {
    ability: string;
    type: 'full' | 'half' | 'third';
  };
}

// Zod schema for ClassData validation
export const ClassDataSchema = z.object({
  name: z.string().min(1),
  hitDie: z.number().min(4).max(12),
  primaryAbility: z.array(z.string().min(1)),
  savingThrowProficiencies: z.array(z.string().min(1)),
  skillChoices: z.object({
    choose: z.number().min(0),
    from: z.array(z.string().min(1))
  }),
  armorProficiencies: z.array(z.string().min(1)),
  weaponProficiencies: z.array(z.string().min(1)),
  toolProficiencies: z.array(z.string().min(1)),
  startingEquipment: z.object({
    choices: z.array(z.object({
      choose: z.number().min(1),
      from: z.array(z.string().min(1))
    })),
    equipment: z.array(z.string().min(1))
  }),
  features: z.array(ClassFeatureSchema),
  subclasses: z.array(z.string().min(1)).optional(),
  spellcasting: z.object({
    ability: z.string().min(1),
    type: z.enum(['full', 'half', 'third'])
  }).optional()
});

export const FIGHTING_STYLES: FightingStyle[] = [
  {
    name: 'Archery',
    description: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
    effect: '+2 to ranged attack rolls'
  },
  {
    name: 'Defense',
    description: 'While you are wearing armor, you gain a +1 bonus to AC.',
    effect: '+1 AC while wearing armor'
  },
  {
    name: 'Dueling',
    description: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
    effect: '+2 damage when wielding one-handed melee weapon with no other weapons'
  },
  {
    name: 'Great Weapon Fighting',
    description: 'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property.',
    effect: 'Reroll 1s and 2s on damage dice for two-handed weapons'
  },
  {
    name: 'Protection',
    description: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
    effect: 'Use reaction to impose disadvantage on attack against ally within 5 feet (requires shield)'
  },
  {
    name: 'Two-Weapon Fighting',
    description: 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
    effect: 'Add ability modifier to off-hand attack damage'
  }
];

// Zod schema for FightingStyle validation
export const FightingStyleSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  effect: z.string().min(1)
});

export interface MartialArchetype {
  name: string;
  description: string;
  features: Array<{
    level: number;
    name: string;
    description: string;
  }>;
}

// Zod schema for MartialArchetype validation
export const MartialArchetypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.object({
    level: z.number().min(1).max(20),
    name: z.string().min(1),
    description: z.string().min(1)
  }))
});

export const MARTIAL_ARCHETYPES: MartialArchetype[] = [
  {
    name: 'Champion',
    description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.',
    features: [
      {
        level: 3,
        name: 'Improved Critical',
        description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.'
      },
      {
        level: 7,
        name: 'Remarkable Athlete',
        description: 'You can add half your proficiency bonus (rounded up) to any Strength, Dexterity, or Constitution check that doesn\'t already use your proficiency bonus.'
      },
      {
        level: 10,
        name: 'Additional Fighting Style',
        description: 'You can choose a second option from the Fighting Style class feature.'
      },
      {
        level: 15,
        name: 'Superior Critical',
        description: 'Your weapon attacks score a critical hit on a roll of 18-20.'
      },
      {
        level: 18,
        name: 'Survivor',
        description: 'At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left.'
      }
    ]
  },
  {
    name: 'Battle Master',
    description: 'Those who emulate the archetypal Battle Master employ martial techniques passed down through generations.',
    features: [
      {
        level: 3,
        name: 'Combat Superiority',
        description: 'You learn maneuvers that are fueled by special dice called superiority dice. You have four superiority dice, which are d8s.'
      },
      {
        level: 3,
        name: 'Student of War',
        description: 'You gain proficiency with one type of artisan\'s tools of your choice.'
      },
      {
        level: 7,
        name: 'Know Your Enemy',
        description: 'If you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities.'
      },
      {
        level: 10,
        name: 'Improved Combat Superiority',
        description: 'Your superiority dice turn into d10s. At 18th level, they turn into d12s.'
      },
      {
        level: 15,
        name: 'Relentless',
        description: 'When you roll initiative and have no superiority dice remaining, you regain 1 superiority die.'
      },
      {
        level: 18,
        name: 'Improved Combat Superiority',
        description: 'Your superiority dice turn into d12s.'
      }
    ]
  },
  {
    name: 'Eldritch Knight',
    description: 'The archetypal Eldritch Knight combines the martial mastery common to all fighters with a careful study of magic.',
    features: [
      {
        level: 3,
        name: 'Spellcasting',
        description: 'You augment your martial prowess with the ability to cast spells.'
      },
      {
        level: 3,
        name: 'Weapon Bond',
        description: 'You learn a ritual that creates a magical bond between yourself and one weapon.'
      },
      {
        level: 7,
        name: 'War Magic',
        description: 'When you use your action to cast a cantrip, you can make one weapon attack as a bonus action.'
      },
      {
        level: 10,
        name: 'Eldritch Strike',
        description: 'When you hit a creature with your weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.'
      },
      {
        level: 15,
        name: 'Arcane Charge',
        description: 'When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see.'
      },
      {
        level: 18,
        name: 'Improved War Magic',
        description: 'When you use your action to cast a spell, you can make one weapon attack as a bonus action.'
      }
    ]
  }
];

export const FIGHTER_CLASS: ClassData = {
  name: 'Fighter',
  hitDie: 10,
  primaryAbility: ['Strength', 'Dexterity'],
  savingThrowProficiencies: ['strength', 'constitution'],
  skillChoices: {
    choose: 2,
    from: [
      'Acrobatics',
      'Animal Handling', 
      'Athletics',
      'History',
      'Insight',
      'Intimidation',
      'Perception',
      'Survival'
    ]
  },
  armorProficiencies: ['light', 'medium', 'heavy', 'shield'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  startingEquipment: {
    choices: [
      {
        choose: 1,
        from: ['chain_mail', 'leather_armor_longbow_arrows']
      },
      {
        choose: 1,
        from: ['martial_weapon_shield', 'two_martial_weapons']
      },
      {
        choose: 1,
        from: ['light_crossbow_bolts', 'two_handaxes']
      },
      {
        choose: 1,
        from: ['dungeoneers_pack', 'explorers_pack']
      }
    ],
    equipment: []
  },
  features: [
    {
      name: 'Fighting Style',
      level: 1,
      description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.',
      type: 'passive'
    },
    {
      name: 'Second Wind',
      level: 1,
      description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
      type: 'bonus_action',
      uses: 1,
      usesType: 'per_short_rest',
      rechargeOn: 'short_rest'
    },
    {
      name: 'Action Surge',
      level: 2,
      description: 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.',
      type: 'resource',
      uses: 1,
      usesType: 'per_short_rest',
      rechargeOn: 'short_rest'
    },
    {
      name: 'Martial Archetype',
      level: 3,
      description: 'At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques. The archetype you choose grants you features at 3rd level and again at 7th, 10th, 15th, and 18th level.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Extra Attack',
      level: 5,
      description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 6,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Martial Archetype Feature',
      level: 7,
      description: 'At 7th level, you gain a feature granted by your Martial Archetype.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Indomitable',
      level: 9,
      description: 'Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can\'t use this feature again until you finish a long rest. You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.',
      type: 'resource',
      uses: 1,
      usesType: 'per_long_rest',
      rechargeOn: 'long_rest'
    },
    {
      name: 'Martial Archetype Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Martial Archetype.',
      type: 'passive'
    },
    {
      name: 'Extra Attack (2)',
      level: 11,
      description: 'At 11th level, you can attack three times whenever you take the Attack action on your turn.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Indomitable (2 uses)',
      level: 13,
      description: 'At 13th level, you can use Indomitable twice between long rests.',
      type: 'resource',
      uses: 2,
      usesType: 'per_long_rest',
      rechargeOn: 'long_rest'
    },
    {
      name: 'Ability Score Improvement',
      level: 14,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Martial Archetype Feature',
      level: 15,
      description: 'At 15th level, you gain a feature granted by your Martial Archetype.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Action Surge (2 uses)',
      level: 17,
      description: 'At 17th level, you can use Action Surge twice before a rest, but only once on the same turn.',
      type: 'resource',
      uses: 2,
      usesType: 'per_short_rest',
      rechargeOn: 'short_rest'
    },
    {
      name: 'Indomitable (3 uses)',
      level: 17,
      description: 'At 17th level, you can use Indomitable three times between long rests.',
      type: 'resource',
      uses: 3,
      usesType: 'per_long_rest',
      rechargeOn: 'long_rest'
    },
    {
      name: 'Martial Archetype Feature',
      level: 18,
      description: 'At 18th level, you gain a feature granted by your Martial Archetype.',
      type: 'passive'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'passive'
    },
    {
      name: 'Extra Attack (3)',
      level: 20,
      description: 'At 20th level, you can attack four times whenever you take the Attack action on your turn.',
      type: 'passive'
    }
  ],
  subclasses: ['Champion', 'Battle Master', 'Eldritch Knight']
};

// Helper function to get Fighter features by level
export function getFighterFeaturesByLevel(level: number): ClassFeature[] {
  return FIGHTER_CLASS.features.filter(feature => feature.level <= level);
}

// Helper function to get Fighter proficiencies
export function getFighterProficiencies() {
  return {
    armor: FIGHTER_CLASS.armorProficiencies,
    weapons: FIGHTER_CLASS.weaponProficiencies,
    tools: FIGHTER_CLASS.toolProficiencies,
    savingThrows: FIGHTER_CLASS.savingThrowProficiencies,
    skills: FIGHTER_CLASS.skillChoices
  };
}

// Helper function to calculate uses of Fighter features by level
export function getFighterFeatureUses(featureName: string, level: number): number {
  switch (featureName) {
    case 'Second Wind':
      return 1;
    case 'Action Surge':
      return level >= 17 ? 2 : 1;
    case 'Indomitable':
      if (level >= 17) return 3;
      if (level >= 13) return 2;
      if (level >= 9) return 1;
      return 0;
    default:
      return 0;
  }
}

// Helper function to get number of attacks for Fighter
export function getFighterAttacks(level: number): number {
  if (level >= 20) return 4;
  if (level >= 11) return 3;
  if (level >= 5) return 2;
  return 1;
}