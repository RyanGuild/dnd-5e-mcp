import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { DNDCharacter } from '../types/character';
import { createCharacter, calculateAbilityModifier, getHitDieForClass } from '../utils/character';
import { saveCharacter, deleteCharacter } from '../utils/storage';
import { SpellManager } from '../utils/spells';
import { ClericSpellManager } from '../utils/cleric-spells';
import { ClericCharacter } from '../utils/cleric-character';
import { DIVINE_DOMAINS } from '../data/cleric';
import { getEffectiveMaxHitPoints, getEffectiveSpeed, EXHAUSTION_EFFECTS } from '../utils/rest';
import { validateCharacter } from '../utils/validation';
import { z } from 'zod';

// Input validation schemas
const CreateCharacterInputSchema = z.object({
  name: z.string(),
  class: z.string(),
  domain: z.string().optional(),
  race: z.string(),
  level: z.number().default(1),
  abilityScores: z.object({
    strength: z.number().optional(),
    dexterity: z.number().optional(),
    constitution: z.number().optional(),
    intelligence: z.number().optional(),
    wisdom: z.number().optional(),
    charisma: z.number().optional(),
  }).optional(),
  fightingStyle: z.string().optional(),
  subclass: z.string().optional(),
});

const UpdateCharacterInputSchema = z.object({
  field: z.string(),
  value: z.any(),
});

// Character tool definitions
const characterTools = [
  {
    name: 'create_character',
    description: 'Create a new D&D 5e character',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Character name',
        },
        class: {
          type: 'string',
          description: 'Character class (e.g., Fighter, Wizard, Rogue, Cleric)',
        },
        domain: {
          type: 'string',
          description: 'Divine domain for Cleric (e.g., Life, Light, War, Knowledge, Nature, Tempest, Trickery). Required if class is Cleric.',
        },
        race: {
          type: 'string',
          description: 'Character race (e.g., Human, Elf, Dwarf)',
        },
        level: {
          type: 'number',
          description: 'Character level (default: 1)',
          default: 1,
        },
        abilityScores: {
          type: 'object' as const,
          description: 'Custom ability scores (optional)',
          properties: {
            strength: { type: 'number' },
            dexterity: { type: 'number' },
            constitution: { type: 'number' },
            intelligence: { type: 'number' },
            wisdom: { type: 'number' },
            charisma: { type: 'number' },
          },
        },
        fightingStyle: {
          type: 'string',
          description: 'Fighting Style for Fighter class (Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting)',
          enum: ['Archery', 'Defense', 'Dueling', 'Great Weapon Fighting', 'Protection', 'Two-Weapon Fighting'],
        },
        subclass: {
          type: 'string',
          description: 'Subclass for Fighter (Champion, Battle Master, Eldritch Knight)',
          enum: ['Champion', 'Battle Master', 'Eldritch Knight'],
        },
      },
      required: ['name', 'class', 'race'],
    },
  },
  {
    name: 'get_character',
    description: 'Get current character information',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'update_character',
    description: 'Update character information',
    inputSchema: {
      type: 'object' as const,
      properties: {
        field: {
          type: 'string',
          description: 'Field to update (e.g., hitPoints, equipment, spells)',
        },
        value: {
          description: 'New value for the field',
        },
      },
      required: ['field', 'value'],
    },
  },
  {
    name: 'delete_character',
    description: 'Delete the current character and remove the character file',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'validate_character',
    description: 'Validate the current character data for correctness and format issues',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// Character handlers
const createCharacterHandler: ToolHandler = {
  name: 'create_character',
  handler: async (args: any, context: HandlerContext) => {
    // Validate input using Zod schema
    const inputValidation = CreateCharacterInputSchema.safeParse(args);
    
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input for creating character: ${inputValidation.error.message}`);
    }
    
    const { name: charName, class: className, race, level, abilityScores, domain, fightingStyle } = inputValidation.data;
    
    // Validate domain for clerics
    if (className === 'Cleric' && !domain) {
      return createErrorResult('Domain is required for Cleric characters. Available domains: ' + Object.keys(DIVINE_DOMAINS).join(', '));
    }
    
    if (className === 'Cleric' && domain && !DIVINE_DOMAINS[domain]) {
      return createErrorResult(`Unknown domain: ${domain}. Available domains: ` + Object.keys(DIVINE_DOMAINS).join(', '));
    }
    
    const character = createCharacter({
      name: charName,
      class: { 
        name: className, 
        level, 
        hitDie: getHitDieForClass(className),
        spellcastingAbility: className === 'Cleric' ? 'wisdom' : className === 'Wizard' ? 'intelligence' : undefined
      },
      race: { name: race, size: 'Medium', speed: 30, traits: [] },
      level,
      abilityScores: abilityScores ? {
        strength: { value: abilityScores.strength || 10, modifier: calculateAbilityModifier(abilityScores.strength || 10) },
        dexterity: { value: abilityScores.dexterity || 10, modifier: calculateAbilityModifier(abilityScores.dexterity || 10) },
        constitution: { value: abilityScores.constitution || 10, modifier: calculateAbilityModifier(abilityScores.constitution || 10) },
        intelligence: { value: abilityScores.intelligence || 10, modifier: calculateAbilityModifier(abilityScores.intelligence || 10) },
        wisdom: { value: abilityScores.wisdom || 10, modifier: calculateAbilityModifier(abilityScores.wisdom || 10) },
        charisma: { value: abilityScores.charisma || 10, modifier: calculateAbilityModifier(abilityScores.charisma || 10) },
      } : undefined,
      fightingStyle: fightingStyle,
    });

    context.setCurrentCharacter(character);
    
    // Initialize spell manager for wizards
    if (character.class.name === 'Wizard') {
      const spellManager = new SpellManager(
        character.level,
        character.abilityScores.intelligence.modifier,
        character.knownSpells
      );
      
      // Save the known spells back to the character
      character.knownSpells = spellManager.getAllKnownSpells();
      
      context.setSpellManager(spellManager);
    }
    
    // Initialize cleric character and spell manager for clerics
    if (character.class.name === 'Cleric' && domain) {
      try {
        const clericCharacter = new ClericCharacter(character, domain);
        const clericSpellManager = clericCharacter.getSpellManager();
        context.setSpellManager(clericSpellManager);
      } catch (error) {
        return createErrorResult(`Error creating cleric character: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    await saveCharacter(character);

    return createSuccessResult(
      `Created character: ${character.name}\n` +
      `Level ${character.level} ${character.race.name} ${character.class.name}${character.class.name === 'Cleric' && domain ? ` (${domain} Domain)` : ''}\n` +
      `AC: ${character.armorClass}, HP: ${character.hitPoints.maximum}\n` +
      `Ability Scores: STR ${character.abilityScores.strength.value} (${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier}), ` +
      `DEX ${character.abilityScores.dexterity.value} (${character.abilityScores.dexterity.modifier >= 0 ? '+' : ''}${character.abilityScores.dexterity.modifier}), ` +
      `CON ${character.abilityScores.constitution.value} (${character.abilityScores.constitution.modifier >= 0 ? '+' : ''}${character.abilityScores.constitution.modifier}), ` +
      `INT ${character.abilityScores.intelligence.value} (${character.abilityScores.intelligence.modifier >= 0 ? '+' : ''}${character.abilityScores.intelligence.modifier}), ` +
      `WIS ${character.abilityScores.wisdom.value} (${character.abilityScores.wisdom.modifier >= 0 ? '+' : ''}${character.abilityScores.wisdom.modifier}), ` +
      `CHA ${character.abilityScores.charisma.value} (${character.abilityScores.charisma.modifier >= 0 ? '+' : ''}${character.abilityScores.charisma.modifier})\n` +
      `Speed: ${character.speed} ft\n` +
      `Proficiency Bonus: +${character.proficiencyBonus}`
    );
  }
};

const getCharacterHandler: ToolHandler = {
  name: 'get_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    const effectiveMaxHP = getEffectiveMaxHitPoints(character);
    const effectiveSpeed = getEffectiveSpeed(character);
    const exhaustionInfo = EXHAUSTION_EFFECTS[character.exhaustionLevel];

    return createSuccessResult(
      `Character: ${character.name}\n` +
      `Level ${character.level} ${character.race.name} ${character.class.name}\n` +
      `AC: ${character.armorClass}, HP: ${character.hitPoints.current}/${effectiveMaxHP}\n` +
      `Ability Scores: STR ${character.abilityScores.strength.value} (${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier}), ` +
      `DEX ${character.abilityScores.dexterity.value} (${character.abilityScores.dexterity.modifier >= 0 ? '+' : ''}${character.abilityScores.dexterity.modifier}), ` +
      `CON ${character.abilityScores.constitution.value} (${character.abilityScores.constitution.modifier >= 0 ? '+' : ''}${character.abilityScores.constitution.modifier}), ` +
      `INT ${character.abilityScores.intelligence.value} (${character.abilityScores.intelligence.modifier >= 0 ? '+' : ''}${character.abilityScores.intelligence.modifier}), ` +
      `WIS ${character.abilityScores.wisdom.value} (${character.abilityScores.wisdom.modifier >= 0 ? '+' : ''}${character.abilityScores.wisdom.modifier}), ` +
      `CHA ${character.abilityScores.charisma.value} (${character.abilityScores.charisma.modifier >= 0 ? '+' : ''}${character.abilityScores.charisma.modifier})\n` +
      `Speed: ${effectiveSpeed} ft\n` +
      `Proficiency Bonus: +${character.proficiencyBonus}\n` +
      `Exhaustion Level: ${character.exhaustionLevel}${exhaustionInfo ? ` (${exhaustionInfo})` : ''}\n` +
      `Hit Dice: ${character.hitDice.current}/${character.hitDice.maximum} d${character.class.hitDie}`
    );
  }
};

const updateCharacterHandler: ToolHandler = {
  name: 'update_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = UpdateCharacterInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { field, value } = inputValidation.data;
    const character = context.currentCharacter;

    try {
      // Update the character based on the field
      switch (field) {
        case 'hitPoints':
          if (typeof value === 'number') {
            character.hitPoints.current = Math.max(0, Math.min(value, character.hitPoints.maximum));
          }
          break;
        case 'level':
          if (typeof value === 'number' && value > 0) {
            character.level = value;
            character.class.level = value;
            character.proficiencyBonus = Math.ceil(character.level / 4) + 1;
          }
          break;
        default:
          return createErrorResult(`Unknown field: ${field}`);
      }

      await saveCharacter(character);
      return createSuccessResult(`Updated character ${field} to ${value}`);
    } catch (error) {
      return createErrorResult(`Error updating character: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const deleteCharacterHandler: ToolHandler = {
  name: 'delete_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    try {
      await deleteCharacter();
      context.setCurrentCharacter(null);
      context.setSpellManager(null);
      return createSuccessResult('Character deleted successfully');
    } catch (error) {
      return createErrorResult(`Error deleting character: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const validateCharacterHandler: ToolHandler = {
  name: 'validate_character',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    try {
      const validationResult = validateCharacter(context.currentCharacter);
      if (validationResult.isValid) {
        return createSuccessResult('Character data is valid');
      } else {
        return createErrorResult(`Character validation failed: ${validationResult.errors.join(', ')}`);
      }
    } catch (error) {
      return createErrorResult(`Error validating character: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// Character module
export const characterModule: ToolModule = {
  tools: characterTools,
  handlers: [
    createCharacterHandler,
    getCharacterHandler,
    updateCharacterHandler,
    deleteCharacterHandler,
    validateCharacterHandler,
  ],
};
