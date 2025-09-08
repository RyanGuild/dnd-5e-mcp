import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { 
  calculateEquipmentStats,
  getEquippedWeapons,
  getEquippedArmor,
  getEquippedShield
} from '../utils/inventory';
import { saveCharacter } from '../utils/storage';
import { z } from 'zod';

// Input validation schemas
const UpdateSkillsInputSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    proficient: z.boolean(),
    modifier: z.number(),
  })),
  savingThrows: z.array(z.object({
    ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
    proficient: z.boolean(),
    modifier: z.number(),
  })),
});

// Combat tool definitions
const combatTools = [
  {
    name: 'get_equipment_stats',
    description: 'Get calculated equipment stats (AC, attack bonus, etc.)',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'list_attacks',
    description: 'List all available attack options for the current character',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'update_skills',
    description: 'Update character skills and saving throw proficiencies',
    inputSchema: {
      type: 'object' as const,
      properties: {
        skills: {
          type: 'array',
          description: 'Array of skill objects with name, proficient, and modifier',
          items: {
            type: 'object' as const,
            properties: {
              name: { type: 'string' },
              proficient: { type: 'boolean' },
              modifier: { type: 'number' }
            },
            required: ['name', 'proficient', 'modifier']
          }
        },
        savingThrows: {
          type: 'array',
          description: 'Array of saving throw objects with ability, proficient, and modifier',
          items: {
            type: 'object' as const,
            properties: {
              ability: { 
                type: 'string',
                enum: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
              },
              proficient: { type: 'boolean' },
              modifier: { type: 'number' }
            },
            required: ['ability', 'proficient', 'modifier']
          }
        }
      },
      required: ['skills', 'savingThrows'],
    },
  },
];

// Combat handlers
const getEquipmentStatsHandler: ToolHandler = {
  name: 'get_equipment_stats',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    const stats = calculateEquipmentStats(character);
    const equippedWeapons = getEquippedWeapons(character.inventory);
    const equippedArmor = getEquippedArmor(character.inventory);
    const equippedShield = getEquippedShield(character.inventory);
    
    let result = `Equipment Stats for ${character.name}:\n\n`;
    result += `Armor Class: ${stats.armorClass}\n`;
    result += `Attack Bonus: ${stats.attackBonus >= 0 ? '+' : ''}${stats.attackBonus}\n`;
    result += `Damage Bonus: ${stats.damageBonus >= 0 ? '+' : ''}${stats.damageBonus}\n`;
    
    if (stats.speedModifier !== 0) {
      result += `Speed Modifier: ${stats.speedModifier} ft\n`;
    }
    
    if (stats.stealthDisadvantage) {
      result += `Stealth Disadvantage: Yes\n`;
    }
    
    if (stats.strengthRequirement > 0) {
      result += `Strength Requirement: ${stats.strengthRequirement}\n`;
    }
    
    result += `\nEquipped Items:\n`;
    if (equippedArmor) {
      result += `- Armor: ${equippedArmor.name} (AC: ${equippedArmor.ac})\n`;
    } else {
      result += `- Armor: None (AC: 10 + Dex modifier)\n`;
    }
    
    if (equippedShield) {
      result += `- Shield: ${equippedShield.name} (AC Bonus: +${equippedShield.acBonus || 0})\n`;
    } else {
      result += `- Shield: None\n`;
    }
    
    if (equippedWeapons.length > 0) {
      result += `- Weapons: ${equippedWeapons.map(w => w.name).join(', ')}\n`;
    } else {
      result += `- Weapons: None\n`;
    }

    return createSuccessResult(result);
  }
};

const listAttacksHandler: ToolHandler = {
  name: 'list_attacks',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    const equippedWeapons = getEquippedWeapons(character.inventory);
    const stats = calculateEquipmentStats(character);
    
    let result = `Attack Options for ${character.name}:\n\n`;
    
    if (equippedWeapons.length === 0) {
      result += `No weapons equipped. Equip a weapon to see attack options.\n`;
      result += `\nUnarmed Strike:\n`;
      result += `- Attack Bonus: ${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier}\n`;
      result += `- Damage: 1 + ${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier} bludgeoning\n`;
    } else {
      equippedWeapons.forEach(weapon => {
        result += `${weapon.name}:\n`;
        result += `- Attack Bonus: ${stats.attackBonus >= 0 ? '+' : ''}${stats.attackBonus}\n`;
        result += `- Damage: ${weapon.damage.dice}d${weapon.damage.sides} + ${stats.damageBonus >= 0 ? '+' : ''}${stats.damageBonus} ${weapon.damage.type}\n`;
        if (weapon.range) {
          result += `- Range: ${weapon.range.normal}/${weapon.range.long} ft\n`;
        }
        if (weapon.properties && weapon.properties.length > 0) {
          result += `- Properties: ${weapon.properties.join(', ')}\n`;
        }
        result += `\n`;
      });
    }
    
    result += `\nUnarmed Strike (always available):\n`;
    result += `- Attack Bonus: ${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier}\n`;
    result += `- Damage: 1 + ${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier} bludgeoning\n`;

    return createSuccessResult(result);
  }
};

const updateSkillsHandler: ToolHandler = {
  name: 'update_skills',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = UpdateSkillsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { skills, savingThrows } = inputValidation.data;
    const character = context.currentCharacter;

    try {
      // Update skills
      character.skills = skills.map(skill => ({
        name: skill.name,
        ability: character.skills.find(s => s.name === skill.name)?.ability || 'intelligence',
        proficient: skill.proficient,
        modifier: skill.modifier
      }));

      // Update saving throws
      character.savingThrows = savingThrows.map(save => ({
        ability: save.ability,
        proficient: save.proficient,
        modifier: save.modifier
      }));

      await saveCharacter(character);
      
      return createSuccessResult(
        `Updated skills and saving throws for ${character.name}.\n` +
        `Skills: ${skills.length} updated\n` +
        `Saving Throws: ${savingThrows.length} updated`
      );
    } catch (error) {
      return createErrorResult(`Error updating skills: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// Combat module
export const combatModule: ToolModule = {
  tools: combatTools,
  handlers: [
    getEquipmentStatsHandler,
    listAttacksHandler,
    updateSkillsHandler,
  ],
};
