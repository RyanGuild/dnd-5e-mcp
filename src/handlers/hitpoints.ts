import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { 
  healCharacter, 
  damageCharacter, 
  setCurrentHitPoints, 
  addTemporaryHitPoints, 
  removeTemporaryHitPoints 
} from '../utils/character';
import { saveCharacter } from '../utils/storage';
import { z } from 'zod';

// Input validation schemas
const HealCharacterInputSchema = z.object({
  amount: z.number().min(0),
});

const DamageCharacterInputSchema = z.object({
  amount: z.number().min(0),
});

const SetHitPointsInputSchema = z.object({
  amount: z.number().min(0),
});

const AddTemporaryHitPointsInputSchema = z.object({
  amount: z.number().min(0),
});

const RemoveTemporaryHitPointsInputSchema = z.object({
  amount: z.number().min(0),
});

// Hit points tool definitions
const hitpointsTools = [
  {
    name: 'heal_character',
    description: 'Heal the current character by a specified amount',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of hit points to heal',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'damage_character',
    description: 'Damage the current character by a specified amount',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of damage to deal',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'set_hit_points',
    description: 'Set the current character\'s current hit points to a specific value',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'New current hit points value',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'add_temporary_hit_points',
    description: 'Add temporary hit points to the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of temporary hit points to add',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'remove_temporary_hit_points',
    description: 'Remove temporary hit points from the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of temporary hit points to remove',
        },
      },
      required: ['amount'],
    },
  },
];

// Hit points handlers
const healCharacterHandler: ToolHandler = {
  name: 'heal_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = HealCharacterInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    const result = healCharacter(character, amount);
    await saveCharacter(character);

    return createSuccessResult(
      `${character.name} healed for ${result.healed} hit points.\n` +
      `Current HP: ${result.newCurrent}/${character.hitPoints.maximum}` +
      (character.hitPoints.temporary > 0 ? ` (${character.hitPoints.temporary} temporary)` : '')
    );
  }
};

const damageCharacterHandler: ToolHandler = {
  name: 'damage_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = DamageCharacterInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    const result = damageCharacter(character, amount);
    await saveCharacter(character);

    const status = result.newCurrent === 0 ? ' (UNCONSCIOUS!)' : '';
    
    return createSuccessResult(
      `${character.name} took ${result.damage} damage.\n` +
      `Current HP: ${result.newCurrent}/${character.hitPoints.maximum}` +
      (character.hitPoints.temporary > 0 ? ` (${character.hitPoints.temporary} temporary)` : '') +
      status
    );
  }
};

const setHitPointsHandler: ToolHandler = {
  name: 'set_hit_points',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = SetHitPointsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    const result = setCurrentHitPoints(character, amount);
    await saveCharacter(character);

    return createSuccessResult(
      `Set ${character.name}'s hit points to ${result.newCurrent}.\n` +
      `Current HP: ${result.newCurrent}/${character.hitPoints.maximum}` +
      (character.hitPoints.temporary > 0 ? ` (${character.hitPoints.temporary} temporary)` : '')
    );
  }
};

const addTemporaryHitPointsHandler: ToolHandler = {
  name: 'add_temporary_hit_points',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = AddTemporaryHitPointsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    const result = addTemporaryHitPoints(character, amount);
    await saveCharacter(character);

    return createSuccessResult(
      `${character.name} gained ${result.added} temporary hit points.\n` +
      `Current HP: ${character.hitPoints.current}/${character.hitPoints.maximum} (${result.newTemporary} temporary)`
    );
  }
};

const removeTemporaryHitPointsHandler: ToolHandler = {
  name: 'remove_temporary_hit_points',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RemoveTemporaryHitPointsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    const result = removeTemporaryHitPoints(character, amount);
    await saveCharacter(character);

    return createSuccessResult(
      `${character.name} lost ${result.removed} temporary hit points.\n` +
      `Current HP: ${character.hitPoints.current}/${character.hitPoints.maximum}` +
      (result.newTemporary > 0 ? ` (${result.newTemporary} temporary)` : '')
    );
  }
};

// Hit points module
export const hitpointsModule: ToolModule = {
  tools: hitpointsTools,
  handlers: [
    healCharacterHandler,
    damageCharacterHandler,
    setHitPointsHandler,
    addTemporaryHitPointsHandler,
    removeTemporaryHitPointsHandler,
  ],
};
