import { ClassData, ClassFeature } from './classes';

// Rogue Class Features
export const ROGUE_FEATURES: ClassFeature[] = [
  {
    name: 'Expertise',
    level: 1,
    description: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
    type: 'passive'
  },
  {
    name: 'Sneak Attack',
    level: 1,
    description: 'Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll, or if another enemy of your target is within 5 feet of it. The extra damage is 1d6 at 1st level and increases as you gain levels.',
    type: 'passive'
  },
  {
    name: 'Thieves\' Cant',
    level: 1,
    description: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.',
    type: 'passive'
  },
  {
    name: 'Cunning Action',
    level: 2,
    description: 'You can take a bonus action on each of your turns to take the Dash, Disengage, or Hide action.',
    type: 'bonus_action'
  },
  {
    name: 'Roguish Archetype',
    level: 3,
    description: 'You choose an archetype that you emulate in the exercise of your rogue abilities.',
    type: 'passive'
  },
  {
    name: 'Steady Aim',
    level: 3,
    description: 'As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven\'t moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.',
    type: 'bonus_action',
    optional: true
  },
  {
    name: 'Ability Score Improvement',
    level: 4,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Uncanny Dodge',
    level: 5,
    description: 'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
    type: 'reaction'
  },
  {
    name: 'Expertise',
    level: 6,
    description: 'Choose two more of your skill proficiencies, or one more of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
    type: 'passive'
  },
  {
    name: 'Evasion',
    level: 7,
    description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
    type: 'passive'
  },
  {
    name: 'Ability Score Improvement',
    level: 8,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Ability Score Improvement',
    level: 10,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Reliable Talent',
    level: 11,
    description: 'Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.',
    type: 'passive'
  },
  {
    name: 'Ability Score Improvement',
    level: 12,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Blindsense',
    level: 14,
    description: 'If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
    type: 'passive'
  },
  {
    name: 'Slippery Mind',
    level: 15,
    description: 'You gain proficiency in Wisdom saving throws.',
    type: 'passive'
  },
  {
    name: 'Ability Score Improvement',
    level: 16,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Elusive',
    level: 18,
    description: 'No attack roll has advantage against you while you aren\'t incapacitated.',
    type: 'passive'
  },
  {
    name: 'Ability Score Improvement',
    level: 19,
    description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
    type: 'passive'
  },
  {
    name: 'Stroke of Luck',
    level: 20,
    description: 'If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
    type: 'resource',
    uses: 1,
    usesType: 'per_short_rest',
    rechargeOn: 'short_rest'
  }
];

// Rogue Class Definition
export const ROGUE_CLASS: ClassData = {
  name: 'Rogue',
  hitDie: 8,
  primaryAbility: ['Dexterity'],
  savingThrowProficiencies: ['dexterity', 'intelligence'],
  skillChoices: {
    choose: 4,
    from: [
      'Acrobatics',
      'Athletics',
      'Deception',
      'Insight',
      'Intimidation',
      'Investigation',
      'Perception',
      'Performance',
      'Persuasion',
      'Sleight of Hand',
      'Stealth'
    ]
  },
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
  toolProficiencies: ['thieves_tools'],
  startingEquipment: {
    choices: [
      {
        choose: 1,
        from: ['rapier', 'shortsword']
      },
      {
        choose: 1,
        from: ['shortbow_arrows', 'shortsword']
      },
      {
        choose: 1,
        from: ['burglars_pack', 'dungeoneers_pack', 'explorers_pack']
      }
    ],
    equipment: ['leather_armor', 'two_daggers', 'thieves_tools']
  },
  features: ROGUE_FEATURES,
  subclasses: [
    'Thief',
    'Assassin',
    'Arcane Trickster',
    'Scout',
    'Soulknife',
    'Swashbuckler',
    'Phantom'
  ]
};

// Helper function to get Rogue features by level
export function getRogueFeaturesByLevel(level: number): ClassFeature[] {
  return ROGUE_FEATURES.filter(feature => feature.level <= level);
}

// Sneak Attack damage by level
export const SNEAK_ATTACK_DAMAGE: { [key: number]: string } = {
  1: '1d6',
  3: '2d6',
  5: '3d6',
  7: '4d6',
  9: '5d6',
  11: '6d6',
  13: '7d6',
  15: '8d6',
  17: '9d6',
  19: '10d6'
};
