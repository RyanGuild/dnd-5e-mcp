import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { 
  useSecondWind, 
  useActionSurge, 
  useIndomitable,
  getFighterFeatureDescriptions
} from '../utils/fighter';
import { RestManager } from '../utils/rest';
import { saveCharacter } from '../utils/storage';
import { FIGHTING_STYLES, MARTIAL_ARCHETYPES } from '../data/classes';
import { z } from 'zod';

// Input validation schemas
const ShortRestInputSchema = z.object({
  hitDiceToSpend: z.number().min(0).optional(),
});

const LongRestInputSchema = z.object({});

const AddExhaustionInputSchema = z.object({
  amount: z.number().min(1).max(6),
});

const RemoveExhaustionInputSchema = z.object({
  amount: z.number().min(1).max(6),
});

// Class features tool definitions
const classFeaturesTools = [
  {
    name: 'use_second_wind',
    description: 'Use the Fighter\'s Second Wind ability to regain hit points',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'use_action_surge',
    description: 'Use the Fighter\'s Action Surge ability to gain an extra action',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'use_indomitable',
    description: 'Use the Fighter\'s Indomitable ability to reroll a failed saving throw',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_fighting_styles',
    description: 'Get list of available Fighting Styles for Fighters',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_class_features',
    description: 'Get current character\'s class features and abilities',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'short_rest',
    description: 'Take a short rest (1 hour) to spend hit dice and recover class features',
    inputSchema: {
      type: 'object' as const,
      properties: {
        hitDiceToSpend: {
          type: 'number',
          description: 'Number of hit dice to spend for healing (optional)',
        },
      },
    },
  },
  {
    name: 'long_rest',
    description: 'Take a long rest (8 hours) to fully recover hit points, spell slots, and reduce exhaustion',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_martial_archetypes',
    description: 'Get list of available Martial Archetypes (subclasses) for Fighters',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'add_exhaustion',
    description: 'Add exhaustion levels to the character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of exhaustion levels to add (1-6)',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'remove_exhaustion',
    description: 'Remove exhaustion levels from the character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: {
          type: 'number',
          description: 'Amount of exhaustion levels to remove (1-6)',
        },
      },
      required: ['amount'],
    },
  },
  {
    name: 'get_exhaustion_status',
    description: 'Get current exhaustion level and effects',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_hit_dice_status',
    description: 'Get current hit dice available for short rests',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// Class features handlers
const useSecondWindHandler: ToolHandler = {
  name: 'use_second_wind',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    try {
      const result = useSecondWind(context.currentCharacter);
      await saveCharacter(context.currentCharacter);
      
      if (result.success) {
        return createSuccessResult(result.message + '\nCharacter saved to character.json');
      } else {
        return createErrorResult(result.message);
      }
    } catch (error) {
      return createErrorResult(`Error using Second Wind: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const useActionSurgeHandler: ToolHandler = {
  name: 'use_action_surge',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    try {
      const result = useActionSurge(context.currentCharacter);
      await saveCharacter(context.currentCharacter);
      
      if (result.success) {
        return createSuccessResult(result.message + '\nCharacter saved to character.json');
      } else {
        return createErrorResult(result.message);
      }
    } catch (error) {
      return createErrorResult(`Error using Action Surge: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const useIndomitableHandler: ToolHandler = {
  name: 'use_indomitable',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    try {
      const result = useIndomitable(context.currentCharacter);
      await saveCharacter(context.currentCharacter);
      
      if (result.success) {
        return createSuccessResult(result.message + '\nCharacter saved to character.json');
      } else {
        return createErrorResult(result.message);
      }
    } catch (error) {
      return createErrorResult(`Error using Indomitable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getFightingStylesHandler: ToolHandler = {
  name: 'get_fighting_styles',
  handler: async (args: any, context: HandlerContext) => {
    let result = `Available Fighting Styles for Fighters:\n\n`;
    
    FIGHTING_STYLES.forEach(style => {
      result += `**${style.name}:** ${style.description}\n`;
    });

    return createSuccessResult(result);
  }
};

const getClassFeaturesHandler: ToolHandler = {
  name: 'get_class_features',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    let result = `Class Features for ${character.name} (Level ${character.level} ${character.class.name}):\n\n`;
    
    if (character.class.name === 'Fighter') {
      const descriptions = getFighterFeatureDescriptions(character);
      if (descriptions.length === 0) {
        result += `No class features available at this level.`;
      } else {
        descriptions.forEach(desc => {
          result += `${desc}\n\n`;
        });
      }
    } else {
      result += `Class features for ${character.class.name} are not yet implemented.`;
    }

    return createSuccessResult(result);
  }
};

const shortRestHandler: ToolHandler = {
  name: 'short_rest',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = ShortRestInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { hitDiceToSpend } = inputValidation.data;
    const character = context.currentCharacter;
    
    try {
      const restManager = new RestManager(character);
      const result = restManager.shortRest(hitDiceToSpend);
      await saveCharacter(character);
      
      return createSuccessResult(result.message + '\nCharacter saved to character.json');
    } catch (error) {
      return createErrorResult(`Error during short rest: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const longRestHandler: ToolHandler = {
  name: 'long_rest',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    
    try {
      const restManager = new RestManager(character);
      const result = restManager.longRest();
      
      // Restore spell slots if character has spell manager
      if (context.spellManager) {
        context.spellManager.restoreAllSlots();
      }
      
      await saveCharacter(character);
      
      return createSuccessResult(result.message + '\nCharacter saved to character.json');
    } catch (error) {
      return createErrorResult(`Error during long rest: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getMartialArchetypesHandler: ToolHandler = {
  name: 'get_martial_archetypes',
  handler: async (args: any, context: HandlerContext) => {
    let result = `Available Martial Archetypes (Fighter Subclasses):\n\n`;
    
    MARTIAL_ARCHETYPES.forEach(archetype => {
      result += `**${archetype.name}:** ${archetype.description}\n`;
    });

    return createSuccessResult(result);
  }
};

const addExhaustionHandler: ToolHandler = {
  name: 'add_exhaustion',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = AddExhaustionInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    
    const oldLevel = character.exhaustionLevel;
    character.exhaustionLevel = Math.min(6, character.exhaustionLevel + amount);
    const actualAdded = character.exhaustionLevel - oldLevel;
    
    await saveCharacter(character);
    
    return createSuccessResult(
      `Added ${actualAdded} level(s) of exhaustion to ${character.name}.\n` +
      `Current exhaustion level: ${character.exhaustionLevel}`
    );
  }
};

const removeExhaustionHandler: ToolHandler = {
  name: 'remove_exhaustion',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RemoveExhaustionInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { amount } = inputValidation.data;
    const character = context.currentCharacter;
    
    const oldLevel = character.exhaustionLevel;
    character.exhaustionLevel = Math.max(0, character.exhaustionLevel - amount);
    const actualRemoved = oldLevel - character.exhaustionLevel;
    
    await saveCharacter(character);
    
    return createSuccessResult(
      `Removed ${actualRemoved} level(s) of exhaustion from ${character.name}.\n` +
      `Current exhaustion level: ${character.exhaustionLevel}`
    );
  }
};

const getExhaustionStatusHandler: ToolHandler = {
  name: 'get_exhaustion_status',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    const level = character.exhaustionLevel;
    
    let result = `Exhaustion Status for ${character.name}:\n\n`;
    result += `Current Level: ${level}\n\n`;
    
    if (level === 0) {
      result += `No exhaustion effects.`;
    } else {
      const effects = [
        'No effect',
        'Disadvantage on ability checks',
        'Speed halved',
        'Disadvantage on attack rolls and saving throws',
        'Hit point maximum halved',
        'Speed reduced to 0',
        'Death'
      ];
      
      for (let i = 1; i <= level; i++) {
        result += `Level ${i}: ${effects[i]}\n`;
      }
    }

    return createSuccessResult(result);
  }
};

const getHitDiceStatusHandler: ToolHandler = {
  name: 'get_hit_dice_status',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    
    let result = `Hit Dice Status for ${character.name}:\n\n`;
    result += `Available: ${character.hitDice.current}/${character.hitDice.maximum} d${character.hitDice.size}\n`;
    result += `\nHit dice are used during short rests to recover hit points.`;
    result += `\nEach hit die spent heals 1d${character.hitDice.size} + Constitution modifier hit points.`;

    return createSuccessResult(result);
  }
};

// Class features module
export const classFeaturesModule: ToolModule = {
  tools: classFeaturesTools,
  handlers: [
    useSecondWindHandler,
    useActionSurgeHandler,
    useIndomitableHandler,
    getFightingStylesHandler,
    getClassFeaturesHandler,
    shortRestHandler,
    longRestHandler,
    getMartialArchetypesHandler,
    addExhaustionHandler,
    removeExhaustionHandler,
    getExhaustionStatusHandler,
    getHitDiceStatusHandler,
  ],
};
