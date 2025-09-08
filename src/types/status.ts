import { z } from 'zod';

// D&D 5e Condition Types
export const ConditionType = z.enum([
  'blinded',
  'charmed',
  'deafened',
  'exhaustion',
  'frightened',
  'grappled',
  'incapacitated',
  'invisible',
  'paralyzed',
  'petrified',
  'poisoned',
  'prone',
  'restrained',
  'stunned',
  'unconscious'
]);

export type ConditionType = z.infer<typeof ConditionType>;

// Status Effect Schema
export const StatusEffect = z.object({
  id: z.string(),
  type: ConditionType,
  name: z.string(),
  description: z.string(),
  source: z.string().optional(), // What caused this condition (spell, ability, etc.)
  duration: z.object({
    type: z.enum(['permanent', 'rounds', 'minutes', 'hours', 'until_long_rest', 'until_short_rest', 'concentration', 'custom']),
    remaining: z.number().optional(), // For timed effects
    endCondition: z.string().optional() // Custom end condition description
  }),
  level: z.number().optional(), // For exhaustion levels
  saveType: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']).optional(),
  saveDC: z.number().optional(),
  canRepeatSave: z.boolean().default(false),
  appliedAt: z.date(),
  metadata: z.record(z.string(), z.any()).optional() // Additional condition-specific data
});

export type StatusEffect = z.infer<typeof StatusEffect>;

// Entity Status Schema - tracks all active conditions on an entity
export const EntityStatus = z.object({
  entityId: z.string(),
  activeConditions: z.array(StatusEffect),
  immunities: z.array(ConditionType).default([]),
  resistances: z.array(ConditionType).default([]),
  lastUpdated: z.date(),
  originalStats: z.record(z.string(), z.any()).optional() // Store original stats before modifications
});

export type EntityStatus = z.infer<typeof EntityStatus>;

// Status Effect Templates for each condition
export const StatusEffectTemplates: Record<ConditionType, Omit<StatusEffect, 'id' | 'appliedAt' | 'source'>> = {
  blinded: {
    type: 'blinded',
    name: 'Blinded',
    description: 'Can\'t see, automatically fails sight-based ability checks, attack rolls have disadvantage, attacks against you have advantage.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  charmed: {
    type: 'charmed',
    name: 'Charmed',
    description: 'Can\'t attack the charmer or target them with harmful abilities/spells, charmer has advantage on social interactions with you.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  deafened: {
    type: 'deafened',
    name: 'Deafened',
    description: 'Can\'t hear, automatically fails hearing-based ability checks.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  exhaustion: {
    type: 'exhaustion',
    name: 'Exhaustion',
    description: 'Has levels of increasing severity, from disadvantage on ability checks (level 1) to death (level 6).',
    duration: { type: 'until_long_rest' },
    level: 1,
    canRepeatSave: false
  },
  frightened: {
    type: 'frightened',
    name: 'Frightened',
    description: 'Disadvantage on ability checks and attack rolls while the source of fear is within line of sight, can\'t willingly move closer to the source.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  grappled: {
    type: 'grappled',
    name: 'Grappled',
    description: 'Speed becomes 0, can\'t benefit from bonuses to speed, ends if grappler is incapacitated or moved away.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  incapacitated: {
    type: 'incapacitated',
    name: 'Incapacitated',
    description: 'Can\'t take actions or reactions.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  invisible: {
    type: 'invisible',
    name: 'Invisible',
    description: 'Considered heavily obscured for hiding purposes, attack rolls have advantage, attacks against you have disadvantage.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  paralyzed: {
    type: 'paralyzed',
    name: 'Paralyzed',
    description: 'Incapacitated and can\'t move or speak, automatically fails Strength and Dexterity saves, attacks have advantage and are critical hits if made within 5 feet.',
    duration: { type: 'custom' },
    saveType: 'constitution',
    canRepeatSave: true
  },
  petrified: {
    type: 'petrified',
    name: 'Petrified',
    description: 'Transformed into stone along with possessions, incapacitated, can\'t move or speak, resistant to all damage, immune to poison and disease.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  poisoned: {
    type: 'poisoned',
    name: 'Poisoned',
    description: 'Disadvantage on attack rolls and ability checks.',
    duration: { type: 'custom' },
    saveType: 'constitution',
    canRepeatSave: true
  },
  prone: {
    type: 'prone',
    name: 'Prone',
    description: 'Can only crawl or use action to stand, disadvantage on attack rolls, attacks have advantage if within 5 feet (disadvantage if farther).',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  restrained: {
    type: 'restrained',
    name: 'Restrained',
    description: 'Speed becomes 0, attacks have disadvantage, attacks against you have advantage, disadvantage on Dexterity saves.',
    duration: { type: 'custom' },
    canRepeatSave: false
  },
  stunned: {
    type: 'stunned',
    name: 'Stunned',
    description: 'Incapacitated, can\'t move, can speak falteringly, automatically fails Strength and Dexterity saves, attacks against you have advantage.',
    duration: { type: 'custom' },
    saveType: 'constitution',
    canRepeatSave: true
  },
  unconscious: {
    type: 'unconscious',
    name: 'Unconscious',
    description: 'Incapacitated and prone, can\'t move or speak, unaware of surroundings, automatically fails Strength and Dexterity saves, attacks have advantage and are critical hits within 5 feet.',
    duration: { type: 'custom' },
    canRepeatSave: false
  }
};

// Status Application Result
export const StatusApplicationResult = z.object({
  success: z.boolean(),
  message: z.string(),
  appliedEffect: StatusEffect.optional(),
  removedEffects: z.array(StatusEffect).default([]),
  warnings: z.array(z.string()).default([])
});

export type StatusApplicationResult = z.infer<typeof StatusApplicationResult>;