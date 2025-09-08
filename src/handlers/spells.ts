import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { SpellManager } from '../utils/spells';
import { ClericSpellManager } from '../utils/cleric-spells';
import { saveCharacter } from '../utils/storage';
import { z } from 'zod';

// Input validation schemas
const PrepareSpellsInputSchema = z.object({
  level: z.number().min(0).max(9),
  spellNames: z.array(z.string()),
});

const GetPreparedSpellsInputSchema = z.object({
  level: z.number().min(0).max(9).optional(),
});

const SearchSpellsInputSchema = z.object({
  query: z.string(),
  level: z.number().min(0).max(9).optional(),
});

const GetSpellDetailsInputSchema = z.object({
  spellName: z.string(),
});

const CastSpellInputSchema = z.object({
  spellName: z.string(),
  level: z.number().min(1).max(9),
});

const RestoreSpellSlotsInputSchema = z.object({
  level: z.number().min(1).max(9).optional(),
});

const LearnSpellInputSchema = z.object({
  spellName: z.string(),
  level: z.number().min(0).max(9),
});

const LearnSpellsInputSchema = z.object({
  spells: z.array(z.object({
    name: z.string(),
    level: z.number().min(0).max(9),
  })),
});

const GetKnownSpellsInputSchema = z.object({
  level: z.number().min(0).max(9).optional(),
});

const GetAvailableToLearnInputSchema = z.object({
  level: z.number().min(0).max(9),
});

// Spells tool definitions
const spellsTools = [
  {
    name: 'get_spell_slots',
    description: 'Get current spell slots for the character',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'prepare_spells',
    description: 'Prepare spells for the day (wizard only)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Spell level (0 for cantrips)',
        },
        spellNames: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of spell names to prepare',
        },
      },
      required: ['level', 'spellNames'],
    },
  },
  {
    name: 'get_prepared_spells',
    description: 'Get currently prepared spells',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Spell level to get (0 for cantrips, omit for all levels)',
        },
      },
    },
  },
  {
    name: 'search_spells',
    description: 'Search for spells by name, school, or description',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        level: {
          type: 'number',
          description: 'Spell level to search (0 for cantrips, omit for all levels)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_spell_details',
    description: 'Get detailed information about a specific spell',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spellName: {
          type: 'string',
          description: 'Name of the spell',
        },
      },
      required: ['spellName'],
    },
  },
  {
    name: 'cast_spell',
    description: 'Cast a spell (expend a spell slot)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spellName: {
          type: 'string',
          description: 'Name of the spell to cast',
        },
        level: {
          type: 'number',
          description: 'Spell level to cast at',
        },
      },
      required: ['spellName', 'level'],
    },
  },
  {
    name: 'restore_spell_slots',
    description: 'Restore spell slots (long rest)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Specific spell level to restore (omit to restore all)',
        },
      },
    },
  },
  {
    name: 'get_spellcasting_info',
    description: 'Get spellcasting ability modifier, save DC, and attack bonus',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_known_spells',
    description: 'Get spells known by the wizard',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Spell level to get (0 for cantrips, omit for all levels)',
        },
      },
    },
  },
  {
    name: 'learn_spell',
    description: 'Learn a new spell (wizard only)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spellName: {
          type: 'string',
          description: 'Name of the spell to learn',
        },
        level: {
          type: 'number',
          description: 'Level of the spell (0 for cantrips)',
        },
      },
      required: ['spellName', 'level'],
    },
  },
  {
    name: 'learn_spells',
    description: 'Learn multiple spells at once (wizard only)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spells: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              level: { type: 'number' },
            },
            required: ['name', 'level'],
          },
          description: 'Array of spells to learn',
        },
      },
      required: ['spells'],
    },
  },
  {
    name: 'get_available_to_learn',
    description: 'Get spells available to learn at a specific level (wizard only)',
    inputSchema: {
      type: 'object' as const,
      properties: {
        level: {
          type: 'number',
          description: 'Spell level (0 for cantrips)',
        },
      },
      required: ['level'],
    },
  },
  {
    name: 'get_spell_learning_info',
    description: 'Get information about spell learning limits and current known spells (wizard only)',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// Spells handlers
const getSpellSlotsHandler: ToolHandler = {
  name: 'get_spell_slots',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const activeSpellManager = context.spellManager;
    const currentSlots = activeSpellManager.getCurrentSlots();
    const maxSlots = activeSpellManager.getMaxSlots();
    
    let result = `Spell Slots for ${context.currentCharacter.name}:\n\n`;
    
    for (let level = 1; level <= 9; level++) {
      const slotKey = `level${level}` as keyof typeof currentSlots;
      const current = currentSlots[slotKey] || 0;
      const max = maxSlots[slotKey] || 0;
      if (max > 0) {
        result += `Level ${level}: ${current}/${max}\n`;
      }
    }
    
    const cantrips = activeSpellManager.getPreparedSpells(0);
    if (cantrips.length > 0) {
      result += `\nCantrips Known: ${cantrips.length}\n`;
      result += `Cantrips: ${cantrips.join(', ')}\n`;
    }

    return createSuccessResult(result);
  }
};

const prepareSpellsHandler: ToolHandler = {
  name: 'prepare_spells',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = PrepareSpellsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level, spellNames } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    try {
      const success = activeSpellManager.prepareSpells(spellNames, level);
      
      if (success) {
        return createSuccessResult(
          `Prepared ${spellNames.length} spell(s) for level ${level}:\n` +
          spellNames.map((name: string) => `- ${name}`).join('\n')
        );
      } else {
        return createErrorResult('Failed to prepare spells. Check if the spells are available for your class and level.');
      }
    } catch (error) {
      return createErrorResult(`Error preparing spells: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getPreparedSpellsHandler: ToolHandler = {
  name: 'get_prepared_spells',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = GetPreparedSpellsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    let result = `Prepared Spells for ${context.currentCharacter.name}:\n\n`;
    
    if (level !== undefined) {
      const spells = activeSpellManager.getPreparedSpells(level);
      if (spells.length === 0) {
        result += `No spells prepared for level ${level}`;
      } else {
        result += `Level ${level} Spells:\n`;
        spells.forEach(spellName => {
          result += `- ${spellName}\n`;
        });
      }
    } else {
      const allPrepared = activeSpellManager.getAllPreparedSpells();
      let hasAnySpells = false;
      
      // Check each level
      for (let i = 0; i <= 9; i++) {
        const levelKey = i === 0 ? 'cantrips' : `level${i}` as keyof typeof allPrepared;
        const spells = allPrepared[levelKey];
        if (spells && spells.length > 0) {
          hasAnySpells = true;
          result += `Level ${i} Spells:\n`;
          spells.forEach(spellName => {
            result += `- ${spellName}\n`;
          });
          result += `\n`;
        }
      }
      
      if (!hasAnySpells) {
        result += `No spells prepared`;
      }
    }

    return createSuccessResult(result);
  }
};

const searchSpellsHandler: ToolHandler = {
  name: 'search_spells',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = SearchSpellsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { query, level } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    try {
      const results = activeSpellManager.searchSpells(query, level);
      
      if (results.length === 0) {
        return createSuccessResult(`No spells found matching "${query}"`);
      }
      
      let result = `Found ${results.length} spell(s) matching "${query}":\n\n`;
      results.forEach(spell => {
        result += `- ${spell.name} (Level ${spell.level})\n`;
        result += `  ${spell.description}\n\n`;
      });
      
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(`Error searching spells: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getSpellDetailsHandler: ToolHandler = {
  name: 'get_spell_details',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = GetSpellDetailsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { spellName } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    try {
      const spell = activeSpellManager.getSpellDetails(spellName);
      
      if (!spell) {
        return createErrorResult(`Spell "${spellName}" not found`);
      }
      
      let result = `${spell.name} (Level ${spell.level})\n\n`;
      result += `Description: ${spell.description}\n`;
      if (spell.range) result += `Range: ${spell.range}\n`;
      if (spell.duration) result += `Duration: ${spell.duration}\n`;
      if (spell.castingTime) result += `Casting Time: ${spell.castingTime}\n`;
      if (spell.components) result += `Components: ${spell.components}\n`;
      if (spell.school) result += `School: ${spell.school}\n`;
      
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(`Error getting spell details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const castSpellHandler: ToolHandler = {
  name: 'cast_spell',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = CastSpellInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { spellName, level } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    try {
      const spell = activeSpellManager.getSpellDetails(spellName);
      if (!spell) {
        return createErrorResult(`Spell "${spellName}" not found`);
      }
      
      const success = activeSpellManager.castSpell(level);
      
      if (success) {
        const currentSlots = activeSpellManager.getCurrentSlots();
        const slotKey = `level${level}` as keyof typeof currentSlots;
        return createSuccessResult(
          `Cast ${spellName} at level ${level}!\n` +
          `Remaining spell slots: ${currentSlots[slotKey] || 0}`
        );
      } else {
        return createErrorResult(`Not enough spell slots of level ${level} to cast ${spellName}`);
      }
    } catch (error) {
      return createErrorResult(`Error casting spell: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const restoreSpellSlotsHandler: ToolHandler = {
  name: 'restore_spell_slots',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const inputValidation = RestoreSpellSlotsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level } = inputValidation.data;
    const activeSpellManager = context.spellManager;
    
    try {
      if (level !== undefined) {
        activeSpellManager.restoreSlot(level);
        return createSuccessResult(`Restored spell slot for level ${level}`);
      } else {
        activeSpellManager.restoreAllSlots();
        return createSuccessResult('Restored all spell slots');
      }
    } catch (error) {
      return createErrorResult(`Error restoring spell slots: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getSpellcastingInfoHandler: ToolHandler = {
  name: 'get_spellcasting_info',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager) {
      return createErrorResult('Spell management is only available for spellcasting classes (Wizard, Cleric).');
    }

    const activeSpellManager = context.spellManager;
    const modifier = activeSpellManager.getSpellcastingModifier();
    const saveDC = activeSpellManager.getSpellSaveDC();
    const attackBonus = activeSpellManager.getSpellAttackBonus();
    
    let result = `Spellcasting Info for ${context.currentCharacter.name}:\n\n`;
    result += `Spellcasting Ability Modifier: ${modifier >= 0 ? '+' : ''}${modifier}\n`;
    result += `Spell Save DC: ${saveDC}\n`;
    result += `Spell Attack Bonus: ${attackBonus >= 0 ? '+' : ''}${attackBonus}\n`;

    return createSuccessResult(result);
  }
};

const getKnownSpellsHandler: ToolHandler = {
  name: 'get_known_spells',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager || !(context.spellManager instanceof SpellManager)) {
      return createErrorResult('Known spells are only available for wizards.');
    }

    const inputValidation = GetKnownSpellsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level } = inputValidation.data;
    const spellManager = context.spellManager as SpellManager;
    
    let result = `Known Spells for ${context.currentCharacter.name}:\n\n`;
    
    if (level !== undefined) {
      const spells = spellManager.getKnownSpells(level);
      if (spells.length === 0) {
        result += `No spells known for level ${level}`;
      } else {
        result += `Level ${level} Spells:\n`;
        spells.forEach(spellName => {
          result += `- ${spellName}\n`;
        });
      }
    } else {
      const allKnown = spellManager.getAllKnownSpells();
      let hasAnySpells = false;
      
      // Check each level
      for (let i = 0; i <= 9; i++) {
        const levelKey = i === 0 ? 'cantrips' : `level${i}` as keyof typeof allKnown;
        const spells = allKnown[levelKey];
        if (spells && spells.length > 0) {
          hasAnySpells = true;
          result += `Level ${i} Spells:\n`;
          spells.forEach(spellName => {
            result += `- ${spellName}\n`;
          });
          result += `\n`;
        }
      }
      
      if (!hasAnySpells) {
        result += `No spells known`;
      }
    }

    return createSuccessResult(result);
  }
};

const learnSpellHandler: ToolHandler = {
  name: 'learn_spell',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager || !(context.spellManager instanceof SpellManager)) {
      return createErrorResult('Learning spells is only available for wizards.');
    }

    const inputValidation = LearnSpellInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { spellName, level } = inputValidation.data;
    const spellManager = context.spellManager as SpellManager;
    
    try {
      const success = spellManager.learnSpell(spellName, level);
      
      if (success) {
        // Update the character's known spells and save
        context.currentCharacter.knownSpells = spellManager.getAllKnownSpells();
        await saveCharacter(context.currentCharacter);
        
        return createSuccessResult(`Successfully learned ${spellName} (Level ${level})!`);
      } else {
        return createErrorResult(`Failed to learn ${spellName}. Check if the spell exists, isn't already known, and you haven't exceeded learning limits.`);
      }
    } catch (error) {
      return createErrorResult(`Error learning spell: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const learnSpellsHandler: ToolHandler = {
  name: 'learn_spells',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager || !(context.spellManager instanceof SpellManager)) {
      return createErrorResult('Learning spells is only available for wizards.');
    }

    const inputValidation = LearnSpellsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { spells } = inputValidation.data;
    const spellManager = context.spellManager as SpellManager;
    
    try {
      const result = spellManager.learnSpells(spells);
      
      // Update the character's known spells and save if any spells were learned
      if (result.learned.length > 0) {
        context.currentCharacter.knownSpells = spellManager.getAllKnownSpells();
        await saveCharacter(context.currentCharacter);
      }
      
      let response = `Learning Results:\n\n`;
      
      if (result.learned.length > 0) {
        response += `Successfully learned ${result.learned.length} spell(s):\n`;
        result.learned.forEach(spellName => {
          response += `- ${spellName}\n`;
        });
        response += `\n`;
      }
      
      if (result.failed.length > 0) {
        response += `Failed to learn ${result.failed.length} spell(s):\n`;
        result.failed.forEach(spellName => {
          response += `- ${spellName}\n`;
        });
      }
      
      return createSuccessResult(response);
    } catch (error) {
      return createErrorResult(`Error learning spells: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getAvailableToLearnHandler: ToolHandler = {
  name: 'get_available_to_learn',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager || !(context.spellManager instanceof SpellManager)) {
      return createErrorResult('Spell learning is only available for wizards.');
    }

    const inputValidation = GetAvailableToLearnInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { level } = inputValidation.data;
    const spellManager = context.spellManager as SpellManager;
    
    try {
      const availableSpells = spellManager.getAvailableToLearn(level);
      
      if (availableSpells.length === 0) {
        return createSuccessResult(`No spells available to learn at level ${level}.`);
      }
      
      let result = `Spells available to learn at level ${level}:\n\n`;
      availableSpells.forEach(spell => {
        result += `- ${spell.name}\n`;
        result += `  ${spell.description}\n\n`;
      });
      
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(`Error getting available spells: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getSpellLearningInfoHandler: ToolHandler = {
  name: 'get_spell_learning_info',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    if (!context.spellManager || !(context.spellManager instanceof SpellManager)) {
      return createErrorResult('Spell learning info is only available for wizards.');
    }

    const spellManager = context.spellManager as SpellManager;
    const limits = spellManager.getSpellLearningLimits();
    
    let result = `Spell Learning Info for ${context.currentCharacter.name}:\n\n`;
    result += `Cantrips Known: ${limits.cantripsKnown}/${limits.cantripsMaximum}\n`;
    result += `Total Spells Known: ${limits.totalSpellsKnown}\n\n`;
    
    // Show known spells by level
    const allKnown = spellManager.getAllKnownSpells();
    for (let level = 0; level <= 9; level++) {
      const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof typeof allKnown;
      const spells = allKnown[levelKey];
      if (spells && spells.length > 0) {
        result += `Level ${level}: ${spells.length} spell(s) known\n`;
      }
    }

    return createSuccessResult(result);
  }
};

// Spells module
export const spellsModule: ToolModule = {
  tools: spellsTools,
  handlers: [
    getSpellSlotsHandler,
    prepareSpellsHandler,
    getPreparedSpellsHandler,
    searchSpellsHandler,
    getSpellDetailsHandler,
    castSpellHandler,
    restoreSpellSlotsHandler,
    getSpellcastingInfoHandler,
    getKnownSpellsHandler,
    learnSpellHandler,
    learnSpellsHandler,
    getAvailableToLearnHandler,
    getSpellLearningInfoHandler,
  ],
};
