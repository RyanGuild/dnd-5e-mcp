import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { 
  rollDice, 
  rollWithAdvantage, 
  rollWithDisadvantage, 
  rollAbilityCheck, 
  rollSavingThrow, 
  rollSkillCheck, 
  rollAttack, 
  rollDamage, 
  rollHitDie 
} from '../utils/dice';
import { getAbilityForSkill } from '../utils/character';
import { z } from 'zod';

// Input validation schemas
const RollDiceInputSchema = z.object({
  dice: z.number().default(1),
  sides: z.number().default(20),
  modifier: z.number().default(0),
  advantage: z.boolean().default(false),
  disadvantage: z.boolean().default(false),
});

const RollAbilityCheckInputSchema = z.object({
  ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
  proficient: z.boolean().default(false),
});

const RollSavingThrowInputSchema = z.object({
  ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
});

const RollSkillCheckInputSchema = z.object({
  skill: z.string(),
});

const RollAttackInputSchema = z.object({
  ability: z.enum(['strength', 'dexterity']),
  proficient: z.boolean().default(true),
  advantage: z.boolean().default(false),
  disadvantage: z.boolean().default(false),
});

const RollDamageInputSchema = z.object({
  dice: z.number(),
  sides: z.number(),
  modifier: z.number().default(0),
});

const RollHitDieInputSchema = z.object({
  hitDie: z.number(),
  constitutionModifier: z.number(),
});

const RollHitPointsInputSchema = z.object({
  level: z.number(),
  hitDie: z.number(),
  constitutionModifier: z.number(),
  useAverage: z.boolean().default(false),
});

// Dice tool definitions
const diceTools = [
  {
    name: 'roll_dice',
    description: 'Roll dice with optional modifiers',
    inputSchema: {
      type: 'object' as const,
      properties: {
        dice: {
          type: 'number',
          description: 'Number of dice to roll',
          default: 1,
        },
        sides: {
          type: 'number',
          description: 'Number of sides on each die',
          default: 20,
        },
        modifier: {
          type: 'number',
          description: 'Modifier to add to the total',
          default: 0,
        },
        advantage: {
          type: 'boolean',
          description: 'Roll with advantage (roll twice, take higher)',
          default: false,
        },
        disadvantage: {
          type: 'boolean',
          description: 'Roll with disadvantage (roll twice, take lower)',
          default: false,
        },
      },
    },
  },
  {
    name: 'roll_ability_check',
    description: 'Roll an ability check for the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ability: {
          type: 'string',
          enum: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
          description: 'Ability to check',
        },
        proficient: {
          type: 'boolean',
          description: 'Whether the character is proficient in this check',
          default: false,
        },
      },
      required: ['ability'],
    },
  },
  {
    name: 'roll_saving_throw',
    description: 'Roll a saving throw for the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ability: {
          type: 'string',
          enum: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
          description: 'Ability for the saving throw',
        },
      },
      required: ['ability'],
    },
  },
  {
    name: 'roll_skill_check',
    description: 'Roll a skill check for the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        skill: {
          type: 'string',
          description: 'Skill name (e.g., Athletics, Stealth, Perception)',
        },
      },
      required: ['skill'],
    },
  },
  {
    name: 'roll_attack',
    description: 'Roll an attack roll for the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ability: {
          type: 'string',
          enum: ['strength', 'dexterity'],
          description: 'Ability used for the attack',
        },
        proficient: {
          type: 'boolean',
          description: 'Whether the character is proficient with the weapon',
          default: true,
        },
        advantage: {
          type: 'boolean',
          description: 'Roll with advantage',
          default: false,
        },
        disadvantage: {
          type: 'boolean',
          description: 'Roll with disadvantage',
          default: false,
        },
      },
      required: ['ability'],
    },
  },
  {
    name: 'roll_damage',
    description: 'Roll damage dice',
    inputSchema: {
      type: 'object' as const,
      properties: {
        dice: {
          type: 'number',
          description: 'Number of dice to roll',
        },
        sides: {
          type: 'number',
          description: 'Number of sides on each die',
        },
        modifier: {
          type: 'number',
          description: 'Modifier to add to the total',
          default: 0,
        },
      },
      required: ['dice', 'sides'],
    },
  },
  {
    name: 'roll_hit_die',
    description: 'Roll hit dice for healing during short rest',
    inputSchema: {
      type: 'object' as const,
      properties: {
        hitDie: {
          type: 'number',
          description: 'Size of hit die (e.g., 8 for d8)',
        },
        constitutionModifier: {
          type: 'number',
          description: 'Constitution modifier',
        },
      },
      required: ['hitDie', 'constitutionModifier'],
    },
  },
  {
    name: 'roll_hit_points',
    description: 'Roll hit points for character level up (roll hit dice or take average)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Character level to calculate hit points for',
        },
        hitDie: {
          type: 'number',
          description: 'Size of hit die (e.g., 8 for d8)',
        },
        constitutionModifier: {
          type: 'number',
          description: 'Constitution modifier',
        },
        useAverage: {
          type: 'boolean',
          description: 'Whether to use average hit points instead of rolling',
          default: false,
        },
      },
      required: ['level', 'hitDie', 'constitutionModifier'],
    },
  },
];

// Dice handlers
const rollDiceHandler: ToolHandler = {
  name: 'roll_dice',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = RollDiceInputSchema.safeParse(args);
    
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input for rolling dice: ${inputValidation.error.message}`);
    }
    
    const { dice, sides, modifier, advantage, disadvantage } = inputValidation.data;
    
    let result;
    if (advantage && !disadvantage) {
      result = rollWithAdvantage(dice, sides, modifier);
    } else if (disadvantage && !advantage) {
      result = rollWithDisadvantage(dice, sides, modifier);
    } else {
      result = rollDice(dice, sides, modifier);
    }

    const advantageText = advantage ? ' (with advantage)' : '';
    const disadvantageText = disadvantage ? ' (with disadvantage)' : '';
    const modifierText = modifier !== 0 ? ` + ${modifier}` : '';
    
    return createSuccessResult(
      `Rolled ${dice}d${sides}${modifierText}${advantageText}${disadvantageText}: ` +
      `[${result.rolls.join(', ')}] = ${result.total}` +
      (result.natural20 ? ' (Natural 20!)' : '') +
      (result.natural1 ? ' (Natural 1!)' : '')
    );
  }
};

const rollAbilityCheckHandler: ToolHandler = {
  name: 'roll_ability_check',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RollAbilityCheckInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { ability, proficient } = inputValidation.data;
    const character = context.currentCharacter;
    const abilityScore = character.abilityScores[ability].value;
    const proficiencyBonus = character.proficiencyBonus;
    
    const result = rollAbilityCheck(abilityScore, proficiencyBonus, proficient);
    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const totalModifier = abilityModifier + (proficient ? proficiencyBonus : 0);
    
    return createSuccessResult(
      `${ability.charAt(0).toUpperCase() + ability.slice(1)} check${proficient ? ' (proficient)' : ''}: ` +
      `d20 + ${totalModifier} = [${result.rolls.join(', ')}] + ${totalModifier} = ${result.total}` +
      (result.natural20 ? ' (Natural 20!)' : '') +
      (result.natural1 ? ' (Natural 1!)' : '')
    );
  }
};

const rollSavingThrowHandler: ToolHandler = {
  name: 'roll_saving_throw',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RollSavingThrowInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { ability } = inputValidation.data;
    const character = context.currentCharacter;
    const abilityScore = character.abilityScores[ability].value;
    const proficiencyBonus = character.proficiencyBonus;
    
    // Check if character is proficient in this saving throw
    const proficient = character.savingThrows.some(st => st.ability === ability && st.proficient);
    
    const result = rollSavingThrow(abilityScore, proficiencyBonus, proficient);
    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const totalModifier = abilityModifier + (proficient ? proficiencyBonus : 0);
    
    return createSuccessResult(
      `${ability.charAt(0).toUpperCase() + ability.slice(1)} saving throw${proficient ? ' (proficient)' : ''}: ` +
      `d20 + ${totalModifier} = [${result.rolls.join(', ')}] + ${totalModifier} = ${result.total}` +
      (result.natural20 ? ' (Natural 20!)' : '') +
      (result.natural1 ? ' (Natural 1!)' : '')
    );
  }
};

const rollSkillCheckHandler: ToolHandler = {
  name: 'roll_skill_check',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RollSkillCheckInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { skill } = inputValidation.data;
    const character = context.currentCharacter;
    
    // Find the skill in the character's skills
    const skillData = character.skills.find(s => s.name.toLowerCase() === skill.toLowerCase());
    if (!skillData) {
      return createErrorResult(`Unknown skill: ${skill}`);
    }
    
    const abilityScore = character.abilityScores[skillData.ability].value;
    const proficiencyBonus = character.proficiencyBonus;
    
    const result = rollSkillCheck(abilityScore, proficiencyBonus, skillData.proficient);
    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const totalModifier = abilityModifier + (skillData.proficient ? proficiencyBonus : 0);
    
    return createSuccessResult(
      `${skill} check${skillData.proficient ? ' (proficient)' : ''}: ` +
      `d20 + ${totalModifier} = [${result.rolls.join(', ')}] + ${totalModifier} = ${result.total}` +
      (result.natural20 ? ' (Natural 20!)' : '') +
      (result.natural1 ? ' (Natural 1!)' : '')
    );
  }
};

const rollAttackHandler: ToolHandler = {
  name: 'roll_attack',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RollAttackInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { ability, proficient, advantage, disadvantage } = inputValidation.data;
    const character = context.currentCharacter;
    const abilityScore = character.abilityScores[ability].value;
    const proficiencyBonus = character.proficiencyBonus;
    
    const result = rollAttack(abilityScore, proficiencyBonus, proficient, advantage, disadvantage);
    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const totalModifier = abilityModifier + (proficient ? proficiencyBonus : 0);
    
    const advantageText = advantage ? ' (with advantage)' : '';
    const disadvantageText = disadvantage ? ' (with disadvantage)' : '';
    
    return createSuccessResult(
      `${ability.charAt(0).toUpperCase() + ability.slice(1)} attack${proficient ? ' (proficient)' : ''}${advantageText}${disadvantageText}: ` +
      `d20 + ${totalModifier} = [${result.rolls.join(', ')}] + ${totalModifier} = ${result.total}` +
      (result.natural20 ? ' (Natural 20!)' : '') +
      (result.natural1 ? ' (Natural 1!)' : '')
    );
  }
};

const rollDamageHandler: ToolHandler = {
  name: 'roll_damage',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = RollDamageInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { dice, sides, modifier } = inputValidation.data;
    const result = rollDamage(dice, sides, modifier);
    const modifierText = modifier !== 0 ? ` + ${modifier}` : '';
    
    return createSuccessResult(
      `Rolled ${dice}d${sides}${modifierText} damage: ` +
      `[${result.rolls.join(', ')}] + ${modifier} = ${result.total}`
    );
  }
};

const rollHitDieHandler: ToolHandler = {
  name: 'roll_hit_die',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = RollHitDieInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { hitDie, constitutionModifier } = inputValidation.data;
    const result = rollHitDie(hitDie, constitutionModifier);
    const modifierText = constitutionModifier !== 0 ? ` + ${constitutionModifier}` : '';
    
    return createSuccessResult(
      `Rolled d${hitDie}${modifierText} for healing: ` +
      `[${result.rolls.join(', ')}] + ${constitutionModifier} = ${result.total} HP`
    );
  }
};

const rollHitPointsHandler: ToolHandler = {
  name: 'roll_hit_points',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = RollHitPointsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level, hitDie, constitutionModifier, useAverage } = inputValidation.data;
    
    if (useAverage) {
      const averageHP = Math.floor(hitDie / 2) + 1 + constitutionModifier;
      const totalHP = averageHP * level;
      return createSuccessResult(
        `Average hit points for level ${level} (d${hitDie} + ${constitutionModifier}): ` +
        `${averageHP} × ${level} = ${totalHP} HP`
      );
    } else {
      const result = rollHitDie(hitDie, constitutionModifier);
      const modifierText = constitutionModifier !== 0 ? ` + ${constitutionModifier}` : '';
      return createSuccessResult(
        `Rolled hit points for level ${level} (d${hitDie}${modifierText}): ` +
        `[${result.rolls.join(', ')}] + ${constitutionModifier} = ${result.total} HP`
      );
    }
  }
};

// Dice module
export const diceModule: ToolModule = {
  tools: diceTools,
  handlers: [
    rollDiceHandler,
    rollAbilityCheckHandler,
    rollSavingThrowHandler,
    rollSkillCheckHandler,
    rollAttackHandler,
    rollDamageHandler,
    rollHitDieHandler,
    rollHitPointsHandler,
  ],
};
