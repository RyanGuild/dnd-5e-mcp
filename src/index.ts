#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { DNDCharacter, AbilityScores } from './types/character.js';
import { 
  createCharacter, 
  calculateAbilityModifier, 
  calculateHitPointsRolled, 
  calculateHitPointsAverage, 
  healCharacter, 
  damageCharacter, 
  setCurrentHitPoints, 
  addTemporaryHitPoints, 
  removeTemporaryHitPoints 
} from './utils/character.js';
import { 
  validateCharacter, 
  formatValidationResult,
  CreateCharacterInputSchema,
  UpdateCharacterInputSchema,
  RollDiceInputSchema,
  AbilityCheckInputSchema,
  AddItemInputSchema,
  RemoveItemInputSchema,
  EquipItemInputSchema
} from './utils/validation.js';
import { saveCharacter, loadCharacter, deleteCharacter, characterExists } from './utils/storage.js';
import {
  addItemToInventory,
  removeItemFromInventory,
  equipItem,
  unequipItem,
  getEquippedWeapons,
  getEquippedArmor,
  getEquippedShield,
  calculateEquipmentStats,
  getWeaponById,
  getArmorById,
  getEquipmentById,
  searchItems,
  calculateMaxWeight,
  calculateCurrentWeight
} from './utils/inventory.js';
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
} from './utils/dice.js';
import { SpellManager, WIZARD_SPELLS, WIZARD_SPELL_SLOTS } from './utils/spells.js';
import { 
  createCharacterEntity, 
  createNPCEntity, 
  createMonsterEntity,
  getEntity,
  getActiveEntity,
  setActiveEntityById,
  deleteEntityById,
  listAllEntities,
  listEntitiesByType,
  searchEntities
} from './utils/entities.js';
import { GameEntity, CharacterEntity, NPCEntity, MonsterEntity, isCharacter, isNPC, isMonster } from './types/entity.js';

// Character storage - will be loaded from file on startup
let currentCharacter: DNDCharacter | null = null;
let spellManager: SpellManager | null = null;

// Load character from file on startup
async function initializeCharacter() {
  try {
    currentCharacter = await loadCharacter();
    if (currentCharacter) {
      console.error(`Loaded character: ${currentCharacter.name} (Level ${currentCharacter.level} ${currentCharacter.race.name} ${currentCharacter.class.name})`);
      
      // Initialize spell manager for wizards
      if (currentCharacter.class.name === 'Wizard') {
        spellManager = new SpellManager(
          currentCharacter.level,
          currentCharacter.abilityScores.intelligence.modifier
        );
      }
    }
  } catch (error) {
    console.error(`Failed to load character: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const server = new Server({
  name: 'dnd-character-mcp',
  version: '1.0.0',
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_character',
        description: 'Create a new D&D 5e character',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Character name',
            },
            class: {
              type: 'string',
              description: 'Character class (e.g., Fighter, Wizard, Rogue)',
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
              type: 'object',
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
          },
          required: ['name', 'class', 'race'],
        },
      },
      {
        name: 'get_character',
        description: 'Get current character information',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'update_character',
        description: 'Update character information',
        inputSchema: {
          type: 'object',
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
        name: 'roll_dice',
        description: 'Roll dice with optional modifiers',
        inputSchema: {
          type: 'object',
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
          required: ['dice', 'sides'],
        },
      },
      {
        name: 'roll_ability_check',
        description: 'Roll an ability check for the current character',
        inputSchema: {
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
      {
        name: 'heal_character',
        description: 'Heal the current character by a specified amount',
        inputSchema: {
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              description: 'Amount of temporary hit points to remove',
            },
          },
          required: ['amount'],
        },
      },
      {
        name: 'delete_character',
        description: 'Delete the current character and remove the character file',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'add_item',
        description: 'Add an item to the character\'s inventory',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              description: 'ID of the item to add (weapon, armor, or equipment)',
            },
            quantity: {
              type: 'number',
              description: 'Quantity to add (default: 1)',
              default: 1,
            },
            equipped: {
              type: 'boolean',
              description: 'Whether to equip the item immediately (default: false)',
              default: false,
            },
            notes: {
              type: 'string',
              description: 'Optional notes about the item',
            },
          },
          required: ['itemId'],
        },
      },
      {
        name: 'remove_item',
        description: 'Remove an item from the character\'s inventory',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              description: 'ID of the item to remove',
            },
            quantity: {
              type: 'number',
              description: 'Quantity to remove (default: 1)',
              default: 1,
            },
          },
          required: ['itemId'],
        },
      },
      {
        name: 'equip_item',
        description: 'Equip an item from the character\'s inventory',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              description: 'ID of the item to equip',
            },
          },
          required: ['itemId'],
        },
      },
      {
        name: 'unequip_item',
        description: 'Unequip an item from the character\'s inventory',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              description: 'ID of the item to unequip',
            },
          },
          required: ['itemId'],
        },
      },
      {
        name: 'get_inventory',
        description: 'Get the character\'s inventory and equipped items',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'search_items',
        description: 'Search for weapons, armor, or equipment by name or description',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_equipment_stats',
        description: 'Get calculated equipment stats (AC, attack bonus, etc.)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_attacks',
        description: 'List all available attack options for the current character',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'update_skills',
        description: 'Update character skills and saving throw proficiencies',
        inputSchema: {
          type: 'object',
          properties: {
            skills: {
              type: 'array',
              description: 'Array of skill objects with name, proficient, and modifier',
              items: {
                type: 'object',
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
                type: 'object',
                properties: {
                  ability: { type: 'string', enum: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] },
                  proficient: { type: 'boolean' },
                  modifier: { type: 'number' }
                },
                required: ['ability', 'proficient', 'modifier']
              }
            }
          },
          required: ['skills', 'savingThrows']
        },
      },
      {
        name: 'validate_character',
        description: 'Validate the current character data for correctness and format issues',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_spell_slots',
        description: 'Get current spell slots for the character',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'prepare_spells',
        description: 'Prepare spells for the day (wizard only)',
        inputSchema: {
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
          type: 'object',
          properties: {},
        },
      },
      // New Entity Management Tools
      {
        name: 'list_entities',
        description: 'List all entities (characters, NPCs, monsters) or filter by type',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['character', 'npc', 'monster'],
              description: 'Filter by entity type (optional)',
            },
          },
        },
      },
      {
        name: 'create_npc',
        description: 'Create a new NPC',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'NPC name',
            },
            role: {
              type: 'string',
              description: 'NPC role (e.g., Shopkeeper, Quest Giver, Guard)',
            },
            location: {
              type: 'string',
              description: 'Where the NPC is located',
            },
            level: {
              type: 'number',
              description: 'NPC level (optional, defaults to 1)',
            },
            abilityScores: {
              type: 'object',
              description: 'Custom ability scores (optional)',
            },
          },
          required: ['name', 'role', 'location'],
        },
      },
      {
        name: 'create_monster',
        description: 'Create a new monster',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Monster name',
            },
            challengeRating: {
              type: 'number',
              description: 'Challenge rating (0-30)',
            },
            creatureType: {
              type: 'string',
              description: 'Creature type (e.g., Beast, Humanoid, Dragon)',
            },
            size: {
              type: 'string',
              enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
              description: 'Monster size',
            },
            abilityScores: {
              type: 'object',
              description: 'Ability scores object',
            },
            hitPoints: {
              type: 'object',
              description: 'Hit points with maximum and hit dice',
            },
            armorClass: {
              type: 'number',
              description: 'Armor class',
            },
            speed: {
              type: 'object',
              description: 'Speed object with walk and optional other speeds',
            },
          },
          required: ['name', 'challengeRating', 'creatureType', 'size', 'abilityScores', 'hitPoints', 'armorClass', 'speed'],
        },
      },
      {
        name: 'get_entity',
        description: 'Get a specific entity by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Entity ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'set_active_entity',
        description: 'Set the active entity for operations',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Entity ID to set as active',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_entity',
        description: 'Delete an entity by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Entity ID to delete',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'search_entities',
        description: 'Search entities by name, class, race, role, or creature type',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_character': {
        // Validate input using Zod schema
        const inputValidation = CreateCharacterInputSchema.safeParse(args);
        
        if (!inputValidation.success) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid input for creating character: ${inputValidation.error.message}`
              }
            ],
            isError: true
          };
        }
        
        const { name: charName, class: className, race, level, abilityScores } = inputValidation.data;
        
        const character = createCharacter({
          name: charName,
          class: { name: className, level, hitDie: getHitDieForClass(className) },
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
        });

        currentCharacter = character;
        
        // Initialize spell manager for wizards
        if (character.class.name === 'Wizard') {
          spellManager = new SpellManager(
            character.level,
            character.abilityScores.intelligence.modifier
          );
        }
        
        await saveCharacter(character);

        return {
          content: [
            {
              type: 'text',
              text: `Created character: ${character.name}\n` +
                    `Level ${character.level} ${character.race.name} ${character.class.name}\n` +
                    `AC: ${character.armorClass}, HP: ${character.hitPoints.maximum}\n` +
                    `Ability Scores: STR ${character.abilityScores.strength.value} (${character.abilityScores.strength.modifier >= 0 ? '+' : ''}${character.abilityScores.strength.modifier}), ` +
                    `DEX ${character.abilityScores.dexterity.value} (${character.abilityScores.dexterity.modifier >= 0 ? '+' : ''}${character.abilityScores.dexterity.modifier}), ` +
                    `CON ${character.abilityScores.constitution.value} (${character.abilityScores.constitution.modifier >= 0 ? '+' : ''}${character.abilityScores.constitution.modifier}), ` +
                    `INT ${character.abilityScores.intelligence.value} (${character.abilityScores.intelligence.modifier >= 0 ? '+' : ''}${character.abilityScores.intelligence.modifier}), ` +
                    `WIS ${character.abilityScores.wisdom.value} (${character.abilityScores.wisdom.modifier >= 0 ? '+' : ''}${character.abilityScores.wisdom.modifier}), ` +
                    `CHA ${character.abilityScores.charisma.value} (${character.abilityScores.charisma.modifier >= 0 ? '+' : ''}${character.abilityScores.charisma.modifier})\n\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'get_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Character: ${currentCharacter.name}\n` +
                    `Level ${currentCharacter.level} ${currentCharacter.race.name} ${currentCharacter.class.name}\n` +
                    `AC: ${currentCharacter.armorClass}, HP: ${currentCharacter.hitPoints.current}/${currentCharacter.hitPoints.maximum}${currentCharacter.hitPoints.temporary > 0 ? ` + ${currentCharacter.hitPoints.temporary} temp` : ''}\n` +
                    `Speed: ${currentCharacter.speed} ft, Initiative: ${currentCharacter.initiative >= 0 ? '+' : ''}${currentCharacter.initiative}\n` +
                    `Proficiency Bonus: +${currentCharacter.proficiencyBonus}\n\n` +
                    `Ability Scores:\n` +
                    `  STR: ${currentCharacter.abilityScores.strength.value} (${currentCharacter.abilityScores.strength.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.strength.modifier})\n` +
                    `  DEX: ${currentCharacter.abilityScores.dexterity.value} (${currentCharacter.abilityScores.dexterity.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.dexterity.modifier})\n` +
                    `  CON: ${currentCharacter.abilityScores.constitution.value} (${currentCharacter.abilityScores.constitution.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.constitution.modifier})\n` +
                    `  INT: ${currentCharacter.abilityScores.intelligence.value} (${currentCharacter.abilityScores.intelligence.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.intelligence.modifier})\n` +
                    `  WIS: ${currentCharacter.abilityScores.wisdom.value} (${currentCharacter.abilityScores.wisdom.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.wisdom.modifier})\n` +
                    `  CHA: ${currentCharacter.abilityScores.charisma.value} (${currentCharacter.abilityScores.charisma.modifier >= 0 ? '+' : ''}${currentCharacter.abilityScores.charisma.modifier})\n\n` +
                    `Saving Throws:\n` +
                    currentCharacter.savingThrows.map(st => 
                      `  ${st.ability.charAt(0).toUpperCase() + st.ability.slice(1)}: ${st.modifier >= 0 ? '+' : ''}${st.modifier}${st.proficient ? ' (proficient)' : ''}`
                    ).join('\n') + '\n\n' +
                    `Skills:\n` +
                    currentCharacter.skills.filter(s => s.proficient).map(s => 
                      `  ${s.name}: ${s.modifier >= 0 ? '+' : ''}${s.modifier} (proficient)`
                    ).join('\n')
            }
          ]
        };
      }

      case 'update_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        // Validate input using Zod schema
        const inputValidation = UpdateCharacterInputSchema.safeParse(args);
        
        if (!inputValidation.success) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid input for updating character: ${inputValidation.error.message}`
              }
            ],
            isError: true
          };
        }

        const { field, value } = inputValidation.data;
        
        // Additional field-specific validation
        if (field === 'level' && (typeof value !== 'number' || value < 1 || value > 20)) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid level: ${value}. Level must be a number between 1 and 20.`
              }
            ],
            isError: true
          };
        }
        
        // Update the character field
        (currentCharacter as any)[field] = value;
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `Updated ${field} to: ${JSON.stringify(value)}\nCharacter saved to character.json`
            }
          ]
        };
      }

      case 'roll_dice': {
        // Validate input using Zod schema
        const inputValidation = RollDiceInputSchema.safeParse(args);
        
        if (!inputValidation.success) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid input for rolling dice: ${inputValidation.error.message}`
              }
            ],
            isError: true
          };
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

        return {
          content: [
            {
              type: 'text',
              text: `Rolled ${dice}d${sides}${modifier ? (modifier >= 0 ? '+' : '') + modifier : ''}${advantage ? ' with advantage' : ''}${disadvantage ? ' with disadvantage' : ''}\n` +
                    `Rolls: [${result.rolls.join(', ')}]\n` +
                    `Total: ${result.total}${result.natural20 ? ' (Natural 20!)' : ''}${result.natural1 ? ' (Natural 1!)' : ''}`
            }
          ]
        };
      }

      case 'roll_ability_check': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        // Validate input using Zod schema
        const inputValidation = AbilityCheckInputSchema.safeParse(args);
        
        if (!inputValidation.success) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid input for ability check: ${inputValidation.error.message}`
              }
            ],
            isError: true
          };
        }

        const { ability, proficient } = inputValidation.data;
        const abilityScore = currentCharacter.abilityScores[ability as keyof typeof currentCharacter.abilityScores];
        const result = rollAbilityCheck(abilityScore.value, currentCharacter.proficiencyBonus, proficient);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} ${ability} check${proficient ? ' (proficient)' : ''}\n` +
                    `Roll: ${result.rolls[0]} + ${abilityScore.modifier}${proficient ? ` + ${currentCharacter.proficiencyBonus}` : ''} = ${result.total}${result.natural20 ? ' (Natural 20!)' : ''}${result.natural1 ? ' (Natural 1!)' : ''}`
            }
          ]
        };
      }

      case 'roll_saving_throw': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { ability } = args as any;
        const savingThrow = currentCharacter.savingThrows.find(st => st.ability === ability);
        if (!savingThrow) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid ability: ${ability}`
              }
            ]
          };
        }

        const abilityScore = currentCharacter.abilityScores[ability as keyof typeof currentCharacter.abilityScores];
        const result = rollSavingThrow(abilityScore.value, currentCharacter.proficiencyBonus, savingThrow.proficient);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} ${ability} saving throw${savingThrow.proficient ? ' (proficient)' : ''}\n` +
                    `Roll: ${result.rolls[0]} + ${savingThrow.modifier} = ${result.total}${result.natural20 ? ' (Natural 20!)' : ''}${result.natural1 ? ' (Natural 1!)' : ''}`
            }
          ]
        };
      }

      case 'roll_skill_check': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { skill } = args as any;
        const skillObj = currentCharacter.skills.find(s => s.name.toLowerCase() === skill.toLowerCase());
        if (!skillObj) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid skill: ${skill}. Available skills: ${currentCharacter.skills.map(s => s.name).join(', ')}`
              }
            ]
          };
        }

        const abilityScore = currentCharacter.abilityScores[skillObj.ability];
        const result = rollSkillCheck(abilityScore.value, currentCharacter.proficiencyBonus, skillObj.proficient);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} ${skillObj.name} check${skillObj.proficient ? ' (proficient)' : ''}\n` +
                    `Roll: ${result.rolls[0]} + ${skillObj.modifier} = ${result.total}${result.natural20 ? ' (Natural 20!)' : ''}${result.natural1 ? ' (Natural 1!)' : ''}`
            }
          ]
        };
      }

      case 'roll_attack': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { ability, proficient = true, advantage = false, disadvantage = false } = args as any;
        const abilityScore = currentCharacter.abilityScores[ability as keyof typeof currentCharacter.abilityScores];
        const result = rollAttack(abilityScore.value, currentCharacter.proficiencyBonus, proficient, advantage, disadvantage);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} ${ability}-based attack${proficient ? ' (proficient)' : ''}${advantage ? ' with advantage' : ''}${disadvantage ? ' with disadvantage' : ''}\n` +
                    `Roll: ${result.rolls[0]} + ${abilityScore.modifier}${proficient ? ` + ${currentCharacter.proficiencyBonus}` : ''} = ${result.total}${result.natural20 ? ' (Natural 20! Critical Hit!)' : ''}${result.natural1 ? ' (Natural 1! Critical Miss!)' : ''}`
            }
          ]
        };
      }

      case 'roll_damage': {
        const { dice, sides, modifier = 0 } = args as any;
        const result = rollDamage(dice, sides, modifier);

        return {
          content: [
            {
              type: 'text',
              text: `Damage roll: ${dice}d${sides}${modifier ? (modifier >= 0 ? '+' : '') + modifier : ''}\n` +
                    `Rolls: [${result.rolls.join(', ')}]\n` +
                    `Total damage: ${result.total}`
            }
          ]
        };
      }

      case 'roll_hit_die': {
        const { hitDie, constitutionModifier } = args as any;
        const result = rollHitDie(hitDie, constitutionModifier);

        return {
          content: [
            {
              type: 'text',
              text: `Hit die roll: d${hitDie}${constitutionModifier ? (constitutionModifier >= 0 ? '+' : '') + constitutionModifier : ''}\n` +
                    `Roll: ${result.rolls[0]} + ${constitutionModifier} = ${result.total} healing`
            }
          ]
        };
      }

      case 'roll_hit_points': {
        const { level, hitDie, constitutionModifier, useAverage = false } = args as any;
        
        let hitPoints: number;
        let method: string;
        
        if (useAverage) {
          hitPoints = calculateHitPointsAverage(level, hitDie, constitutionModifier);
          method = 'average';
        } else {
          // Roll hit dice for each level (except first which is always max)
          const rolls: number[] = [];
          for (let i = 2; i <= level; i++) {
            const roll = Math.floor(Math.random() * hitDie) + 1;
            rolls.push(roll);
          }
          hitPoints = calculateHitPointsRolled(level, hitDie, constitutionModifier, rolls);
          method = 'rolled';
        }

        return {
          content: [
            {
              type: 'text',
              text: `Hit points calculation (${method}):\n` +
                    `Level ${level} character with d${hitDie} hit die and +${constitutionModifier} CON modifier\n` +
                    `Total hit points: ${hitPoints}`
            }
          ]
        };
      }

      case 'heal_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { amount } = args as any;
        const result = healCharacter(currentCharacter, amount);
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} healed for ${result.healed} hit points.\n` +
                    `Current HP: ${result.newCurrent}/${currentCharacter.hitPoints.maximum}${currentCharacter.hitPoints.temporary > 0 ? ` + ${currentCharacter.hitPoints.temporary} temp` : ''}\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'damage_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { amount } = args as any;
        const result = damageCharacter(currentCharacter, amount);
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} took ${result.damage} damage.\n` +
                    `Current HP: ${result.newCurrent}/${currentCharacter.hitPoints.maximum}${currentCharacter.hitPoints.temporary > 0 ? ` + ${currentCharacter.hitPoints.temporary} temp` : ''}\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'set_hit_points': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { amount } = args as any;
        const result = setCurrentHitPoints(currentCharacter, amount);
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name}'s hit points set to ${result.newCurrent}.\n` +
                    `Change: ${result.changed >= 0 ? '+' : ''}${result.changed}\n` +
                    `Current HP: ${result.newCurrent}/${currentCharacter.hitPoints.maximum}${currentCharacter.hitPoints.temporary > 0 ? ` + ${currentCharacter.hitPoints.temporary} temp` : ''}\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'add_temporary_hit_points': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { amount } = args as any;
        const result = addTemporaryHitPoints(currentCharacter, amount);
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} gained ${result.added} temporary hit points.\n` +
                    `Current HP: ${currentCharacter.hitPoints.current}/${currentCharacter.hitPoints.maximum} + ${result.newTemporary} temp\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'remove_temporary_hit_points': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { amount } = args as any;
        const result = removeTemporaryHitPoints(currentCharacter, amount);
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `${currentCharacter.name} lost ${result.removed} temporary hit points.\n` +
                    `Current HP: ${currentCharacter.hitPoints.current}/${currentCharacter.hitPoints.maximum} + ${result.newTemporary} temp\n` +
                    `Character saved to character.json`
            }
          ]
        };
      }

      case 'delete_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character to delete.'
              }
            ]
          };
        }

        const characterName = currentCharacter.name;
        currentCharacter = null;
        await deleteCharacter();

        return {
          content: [
            {
              type: 'text',
              text: `Deleted character: ${characterName}\nCharacter file removed.`
            }
          ]
        };
      }

      case 'add_item': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { itemId, quantity = 1, equipped = false, notes } = args as any;
        
        // Try to find the item in weapons, armor, or equipment
        let item = getWeaponById(itemId) || getArmorById(itemId) || getEquipmentById(itemId);
        
        if (!item) {
          return {
            content: [
              {
                type: 'text',
                text: `Item with ID '${itemId}' not found. Use search_items to find available items.`
              }
            ]
          };
        }

        try {
          addItemToInventory(currentCharacter.inventory, item, quantity, equipped, notes);
          await saveCharacter(currentCharacter);

          return {
            content: [
              {
                type: 'text',
                text: `Added ${quantity}x ${item.name} to inventory${equipped ? ' (equipped)' : ''}.\nCharacter saved to character.json`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error adding item: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }

      case 'remove_item': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { itemId, quantity = 1 } = args as any;

        try {
          removeItemFromInventory(currentCharacter.inventory, itemId, quantity);
          await saveCharacter(currentCharacter);

          return {
            content: [
              {
                type: 'text',
                text: `Removed ${quantity}x of item '${itemId}' from inventory.\nCharacter saved to character.json`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error removing item: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }

      case 'equip_item': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { itemId } = args as any;

        try {
          equipItem(currentCharacter.inventory, itemId);
          await saveCharacter(currentCharacter);

          return {
            content: [
              {
                type: 'text',
                text: `Equipped item '${itemId}'.\nCharacter saved to character.json`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error equipping item: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }

      case 'unequip_item': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { itemId } = args as any;

        try {
          unequipItem(currentCharacter.inventory, itemId);
          await saveCharacter(currentCharacter);

          return {
            content: [
              {
                type: 'text',
                text: `Unequipped item '${itemId}'.\nCharacter saved to character.json`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error unequipping item: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }

      case 'get_inventory': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const inventory = currentCharacter.inventory;
        const maxWeight = calculateMaxWeight(currentCharacter.abilityScores.strength.value);
        const currentWeight = calculateCurrentWeight(inventory);
        
        let inventoryText = `Inventory (${currentWeight}/${maxWeight} lbs):\n\n`;
        
        if (inventory.items.length === 0) {
          inventoryText += 'No items in inventory.';
        } else {
          inventory.items.forEach(item => {
            inventoryText += `• ${item.quantity}x ${item.item.name}${item.equipped ? ' (equipped)' : ''}`;
            if (item.notes) {
              inventoryText += ` - ${item.notes}`;
            }
            inventoryText += '\n';
          });
        }
        
        inventoryText += `\nCurrency: ${inventory.currency.platinum}pp, ${inventory.currency.gold}gp, ${inventory.currency.silver}sp, ${inventory.currency.copper}cp`;

        return {
          content: [
            {
              type: 'text',
              text: inventoryText
            }
          ]
        };
      }

      case 'search_items': {
        const { query } = args as any;
        const results = searchItems(query);
        
        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No items found matching "${query}".`
              }
            ]
          };
        }
        
        let searchText = `Found ${results.length} items matching "${query}":\n\n`;
        
        results.slice(0, 10).forEach(item => {
          searchText += `• ${item.name} (ID: ${item.id})\n`;
          searchText += `  ${item.description}\n`;
          if ('damage' in item) {
            searchText += `  Damage: ${item.damage.dice}d${item.damage.sides} ${item.damage.type}\n`;
          }
          if ('ac' in item) {
            searchText += `  AC: ${item.ac}\n`;
          }
          searchText += `  Weight: ${item.weight} lbs, Cost: ${item.cost} cp\n\n`;
        });
        
        if (results.length > 10) {
          searchText += `... and ${results.length - 10} more items.`;
        }

        return {
          content: [
            {
              type: 'text',
              text: searchText
            }
          ]
        };
      }

      case 'get_equipment_stats': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const stats = calculateEquipmentStats(currentCharacter);
        const equippedWeapons = getEquippedWeapons(currentCharacter.inventory);
        const equippedArmor = getEquippedArmor(currentCharacter.inventory);
        const equippedShield = getEquippedShield(currentCharacter.inventory);
        
        let statsText = `Equipment Stats:\n\n`;
        statsText += `Armor Class: ${stats.armorClass}\n`;
        statsText += `Attack Bonus: ${stats.attackBonus >= 0 ? '+' : ''}${stats.attackBonus}\n`;
        statsText += `Damage Bonus: ${stats.damageBonus >= 0 ? '+' : ''}${stats.damageBonus}\n`;
        statsText += `Speed Modifier: ${stats.speedModifier >= 0 ? '+' : ''}${stats.speedModifier} ft\n`;
        statsText += `Stealth Disadvantage: ${stats.stealthDisadvantage ? 'Yes' : 'No'}\n`;
        if (stats.strengthRequirement > 0) {
          statsText += `Strength Requirement: ${stats.strengthRequirement}\n`;
        }
        
        statsText += `\nEquipped Items:\n`;
        if (equippedArmor) {
          statsText += `• Armor: ${equippedArmor.name}\n`;
        }
        if (equippedShield) {
          statsText += `• Shield: ${equippedShield.name}\n`;
        }
        if (equippedWeapons.length > 0) {
          statsText += `• Weapons: ${equippedWeapons.map(w => w.name).join(', ')}\n`;
        }
        if (!equippedArmor && !equippedShield && equippedWeapons.length === 0) {
          statsText += `• No items equipped\n`;
        }

        return {
          content: [
            {
              type: 'text',
              text: statsText
            }
          ]
        };
      }

      case 'list_attacks': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const equippedWeapons = getEquippedWeapons(currentCharacter.inventory);
        const stats = calculateEquipmentStats(currentCharacter);
        
        let attacksText = `Available Attacks for ${currentCharacter.name}:\n\n`;
        
        // Unarmed Strike (always available for monks)
        if (currentCharacter.class.name === 'Monk') {
          const unarmedDamage = currentCharacter.level >= 5 ? '1d6' : '1d4';
          const unarmedBonus = stats.attackBonus;
          const unarmedDamageBonus = stats.damageBonus;
          
          attacksText += `• Unarmed Strike\n`;
          attacksText += `  Attack Bonus: ${unarmedBonus >= 0 ? '+' : ''}${unarmedBonus}\n`;
          attacksText += `  Damage: ${unarmedDamage} bludgeoning${unarmedDamageBonus ? ` + ${unarmedDamageBonus >= 0 ? '+' : ''}${unarmedDamageBonus}` : ''}\n`;
          attacksText += `  Properties: Finesse, Light\n\n`;
        }
        
        // Equipped weapons
        if (equippedWeapons.length > 0) {
          equippedWeapons.forEach(weapon => {
            attacksText += `• ${weapon.name}\n`;
            attacksText += `  Attack Bonus: ${stats.attackBonus >= 0 ? '+' : ''}${stats.attackBonus}\n`;
            
            // Determine damage based on weapon properties
            let damageText = `${weapon.damage.dice}d${weapon.damage.sides} ${weapon.damage.type}`;
            
            // Handle versatile weapons
            if (weapon.properties.includes('versatile')) {
              const twoHandedDamage = weapon.damage.sides + 2; // Versatile weapons typically do 2 more damage when two-handed
              damageText += ` (one-handed) / ${weapon.damage.dice}d${twoHandedDamage} ${weapon.damage.type} (two-handed)`;
            }
            
            if (stats.damageBonus) {
              damageText += ` + ${stats.damageBonus >= 0 ? '+' : ''}${stats.damageBonus}`;
            }
            
            attacksText += `  Damage: ${damageText}\n`;
            
            // Show weapon properties
            if (weapon.properties.length > 0) {
              attacksText += `  Properties: ${weapon.properties.join(', ')}\n`;
            }
            
            // Show range for ranged weapons
            if (weapon.type === 'ranged' && 'range' in weapon && weapon.range) {
              attacksText += `  Range: ${weapon.range.normal}/${weapon.range.long} ft\n`;
            }
            
            attacksText += '\n';
          });
        } else {
          attacksText += 'No weapons equipped.\n\n';
        }
        
        // Add class-specific attack options
        if (currentCharacter.class.name === 'Monk') {
          attacksText += `Monk Abilities:\n`;
          attacksText += `• Martial Arts: Use Dexterity for unarmed strikes and monk weapons\n`;
          attacksText += `• Flurry of Blows: Spend 1 ki point for 2 unarmed strikes as bonus action\n`;
          attacksText += `• Ki Points: ${currentCharacter.level} available\n`;
        }
        
        attacksText += `\nTo make an attack, use roll_attack with the appropriate ability modifier.`;

        return {
          content: [
            {
              type: 'text',
              text: attacksText
            }
          ]
        };
      }

      case 'update_skills': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const { skills, savingThrows } = args as any;
        
        // Update skills
        currentCharacter.skills = skills.map((skill: any) => ({
          name: skill.name,
          ability: getAbilityForSkill(skill.name),
          proficient: skill.proficient,
          modifier: skill.modifier
        }));
        
        // Update saving throws
        currentCharacter.savingThrows = savingThrows.map((st: any) => ({
          ability: st.ability,
          proficient: st.proficient,
          modifier: st.modifier
        }));
        
        await saveCharacter(currentCharacter);

        return {
          content: [
            {
              type: 'text',
              text: `Updated skills and saving throws for ${currentCharacter.name}.\nCharacter saved to character.json`
            }
          ]
        };
      }

      case 'validate_character': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        const validationResult = validateCharacter(currentCharacter);
        const formattedResult = formatValidationResult(validationResult);

        return {
          content: [
            {
              type: 'text',
              text: formattedResult
            }
          ]
        };
      }

      case 'get_spell_slots': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell management is only available for wizards.'
              }
            ]
          };
        }

        const currentSlots = spellManager.getCurrentSlots();
        const maxSlots = spellManager.getMaxSlots();
        
        let slotsText = `Spell Slots for ${currentCharacter.name} (Level ${currentCharacter.level} Wizard):\n\n`;
        
        for (let level = 1; level <= 9; level++) {
          const current = currentSlots[`level${level}` as keyof typeof currentSlots];
          const max = maxSlots[`level${level}` as keyof typeof maxSlots];
          if (max > 0) {
            slotsText += `Level ${level}: ${current}/${max} slots\n`;
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: slotsText
            }
          ]
        };
      }

      case 'prepare_spells': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell preparation is only available for wizards.'
              }
            ]
          };
        }

        const { level, spellNames } = args as any;
        const success = spellManager.prepareSpells(spellNames, level);

        if (success) {
          return {
            content: [
              {
                type: 'text',
                text: `Prepared ${spellNames.length} spells for level ${level === 0 ? 'cantrips' : level}:\n${spellNames.join(', ')}`
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to prepare spells. Check that all spell names are valid and you haven't exceeded your preparation limit.`
              }
            ],
            isError: true
          };
        }
      }

      case 'get_prepared_spells': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell management is only available for wizards.'
              }
            ]
          };
        }

        const { level } = args as any;
        
        if (level !== undefined) {
          const spells = spellManager.getPreparedSpells(level);
          const levelName = level === 0 ? 'Cantrips' : `Level ${level}`;
          
          return {
            content: [
              {
                type: 'text',
                text: `Prepared ${levelName}:\n${spells.length > 0 ? spells.join(', ') : 'None'}`
              }
            ]
          };
        } else {
          const allPrepared = spellManager.getAllPreparedSpells();
          let spellsText = `All Prepared Spells for ${currentCharacter.name}:\n\n`;
          
          if (allPrepared.cantrips.length > 0) {
            spellsText += `Cantrips: ${allPrepared.cantrips.join(', ')}\n`;
          }
          
          for (let level = 1; level <= 9; level++) {
            const levelKey = `level${level}` as keyof typeof allPrepared;
            const spells = allPrepared[levelKey];
            if (spells.length > 0) {
              spellsText += `Level ${level}: ${spells.join(', ')}\n`;
            }
          }

          return {
            content: [
              {
                type: 'text',
                text: spellsText
              }
            ]
          };
        }
      }

      case 'search_spells': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell search is only available for wizards.'
              }
            ]
          };
        }

        const { query, level } = args as any;
        const results = spellManager.searchSpells(query, level);
        
        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No spells found matching "${query}".`
              }
            ]
          };
        }

        let searchText = `Found ${results.length} spells matching "${query}":\n\n`;
        
        results.slice(0, 10).forEach(spell => {
          searchText += `• ${spell.name} (Level ${spell.level === 0 ? 'Cantrip' : spell.level})\n`;
          searchText += `  School: ${spell.school}\n`;
          searchText += `  Casting Time: ${spell.castingTime}\n`;
          searchText += `  Range: ${spell.range}\n`;
          searchText += `  Duration: ${spell.duration}\n`;
          if (spell.concentration) searchText += `  Concentration: Yes\n`;
          if (spell.ritual) searchText += `  Ritual: Yes\n`;
          searchText += `  Description: ${spell.description.substring(0, 100)}...\n\n`;
        });

        if (results.length > 10) {
          searchText += `... and ${results.length - 10} more spells.`;
        }

        return {
          content: [
            {
              type: 'text',
              text: searchText
            }
          ]
        };
      }

      case 'get_spell_details': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell details are only available for wizards.'
              }
            ]
          };
        }

        const { spellName } = args as any;
        const spell = spellManager.getSpellDetails(spellName);

        if (!spell) {
          return {
            content: [
              {
                type: 'text',
                text: `Spell "${spellName}" not found.`
              }
            ]
          };
        }

        let detailsText = `${spell.name}\n`;
        detailsText += `Level: ${spell.level === 0 ? 'Cantrip' : spell.level}\n`;
        detailsText += `School: ${spell.school}\n`;
        detailsText += `Casting Time: ${spell.castingTime}\n`;
        detailsText += `Range: ${spell.range}\n`;
        detailsText += `Components: ${spell.components}\n`;
        detailsText += `Duration: ${spell.duration}\n`;
        if (spell.concentration) detailsText += `Concentration: Yes\n`;
        if (spell.ritual) detailsText += `Ritual: Yes\n`;
        detailsText += `\nDescription:\n${spell.description}\n`;
        if (spell.higherLevel) {
          detailsText += `\nAt Higher Levels:\n${spell.higherLevel}`;
        }

        return {
          content: [
            {
              type: 'text',
              text: detailsText
            }
          ]
        };
      }

      case 'cast_spell': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell casting is only available for wizards.'
              }
            ]
          };
        }

        const { spellName, level } = args as any;
        const spell = spellManager.getSpellDetails(spellName);

        if (!spell) {
          return {
            content: [
              {
                type: 'text',
                text: `Spell "${spellName}" not found.`
              }
            ]
          };
        }

        const success = spellManager.castSpell(level);
        
        if (success) {
          const currentSlots = spellManager.getCurrentSlots();
          const levelKey = `level${level}` as keyof typeof currentSlots;
          const remaining = currentSlots[levelKey];
          
          return {
            content: [
              {
                type: 'text',
                text: `${currentCharacter.name} cast ${spellName} at level ${level}!\n` +
                      `Remaining level ${level} slots: ${remaining}`
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `Cannot cast ${spellName} - no level ${level} spell slots remaining.`
              }
            ],
            isError: true
          };
        }
      }

      case 'restore_spell_slots': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spell slot restoration is only available for wizards.'
              }
            ]
          };
        }

        const { level } = args as any;
        
        if (level !== undefined) {
          spellManager.restoreSlot(level);
          return {
            content: [
              {
                type: 'text',
                text: `Restored 1 level ${level} spell slot.`
              }
            ]
          };
        } else {
          spellManager.restoreAllSlots();
          return {
            content: [
              {
                type: 'text',
                text: `All spell slots restored (long rest completed).`
              }
            ]
          };
        }
      }

      case 'get_spellcasting_info': {
        if (!currentCharacter) {
          return {
            content: [
              {
                type: 'text',
                text: 'No character created yet. Use create_character to create one.'
              }
            ]
          };
        }

        if (!spellManager) {
          return {
            content: [
              {
                type: 'text',
                text: 'Spellcasting info is only available for wizards.'
              }
            ]
          };
        }

        const modifier = spellManager.getSpellcastingModifier();
        const saveDC = spellManager.getSpellSaveDC();
        const attackBonus = spellManager.getSpellAttackBonus();

        return {
          content: [
            {
              type: 'text',
              text: `Spellcasting Information for ${currentCharacter.name}:\n\n` +
                    `Spellcasting Ability: Intelligence (+${modifier})\n` +
                    `Spell Save DC: ${saveDC}\n` +
                    `Spell Attack Bonus: +${attackBonus}`
            }
          ]
        };
      }

      // New Entity Management Tool Handlers
      case 'list_entities': {
        const { type } = args as any;
        const entities = type ? await listEntitiesByType(type) : await listAllEntities();
        
        if (entities.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No ${type || 'entities'} found.`
              }
            ]
          };
        }

        const entityList = entities.map(entity => {
          if (isCharacter(entity)) {
            return `${entity.name} (Level ${entity.level} ${entity.race.name} ${entity.class.name}) - ID: ${entity.id}`;
          } else if (isNPC(entity)) {
            return `${entity.name} (${entity.role} in ${entity.location}) - ID: ${entity.id}`;
          } else if (isMonster(entity)) {
            return `${entity.name} (CR ${entity.challengeRating} ${entity.creatureType}) - ID: ${entity.id}`;
          }
          return `${(entity as GameEntity).name} - ID: ${(entity as GameEntity).id}`;
        }).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `${type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All'} entities:\n\n${entityList}`
            }
          ]
        };
      }

      case 'create_npc': {
        const { name, role, location, level, abilityScores } = args as any;
        
        const npc = await createNPCEntity({
          name,
          role,
          location,
          level,
          abilityScores
        });

        return {
          content: [
            {
              type: 'text',
              text: `Created NPC: ${npc.name}\n` +
                    `Role: ${npc.role}\n` +
                    `Location: ${npc.location}\n` +
                    `Level: ${npc.level}\n` +
                    `AC: ${npc.armorClass}, HP: ${npc.hitPoints.current}/${npc.hitPoints.maximum}\n` +
                    `ID: ${npc.id}`
            }
          ]
        };
      }

      case 'create_monster': {
        const { name, challengeRating, creatureType, size, abilityScores, hitPoints, armorClass, speed } = args as any;
        
        const monster = await createMonsterEntity({
          name,
          challengeRating,
          creatureType,
          size,
          abilityScores,
          hitPoints,
          armorClass,
          speed
        });

        return {
          content: [
            {
              type: 'text',
              text: `Created Monster: ${monster.name}\n` +
                    `Challenge Rating: ${monster.challengeRating}\n` +
                    `Type: ${monster.creatureType}\n` +
                    `Size: ${monster.size}\n` +
                    `AC: ${monster.armorClass}, HP: ${monster.hitPoints.current}/${monster.hitPoints.maximum}\n` +
                    `ID: ${monster.id}`
            }
          ]
        };
      }

      case 'get_entity': {
        const { id } = args as any;
        const entity = await getEntity(id);
        
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: `Entity with ID ${id} not found.`
              }
            ]
          };
        }

        let entityInfo = `${entity.name} (${entity.type})\n` +
                        `AC: ${entity.armorClass}, HP: ${entity.hitPoints.current}/${entity.hitPoints.maximum}\n` +
                        `Speed: ${entity.speed} ft, Initiative: ${entity.initiative >= 0 ? '+' : ''}${entity.initiative}\n` +
                        `ID: ${entity.id}\n\n`;

        if (isCharacter(entity)) {
          entityInfo += `Level ${entity.level} ${entity.race.name} ${entity.class.name}\n` +
                       `Ability Scores: STR ${entity.abilityScores.strength.value} (${entity.abilityScores.strength.modifier >= 0 ? '+' : ''}${entity.abilityScores.strength.modifier}), ` +
                       `DEX ${entity.abilityScores.dexterity.value} (${entity.abilityScores.dexterity.modifier >= 0 ? '+' : ''}${entity.abilityScores.dexterity.modifier}), ` +
                       `CON ${entity.abilityScores.constitution.value} (${entity.abilityScores.constitution.modifier >= 0 ? '+' : ''}${entity.abilityScores.constitution.modifier}), ` +
                       `INT ${entity.abilityScores.intelligence.value} (${entity.abilityScores.intelligence.modifier >= 0 ? '+' : ''}${entity.abilityScores.intelligence.modifier}), ` +
                       `WIS ${entity.abilityScores.wisdom.value} (${entity.abilityScores.wisdom.modifier >= 0 ? '+' : ''}${entity.abilityScores.wisdom.modifier}), ` +
                       `CHA ${entity.abilityScores.charisma.value} (${entity.abilityScores.charisma.modifier >= 0 ? '+' : ''}${entity.abilityScores.charisma.modifier})`;
        } else if (isNPC(entity)) {
          entityInfo += `Role: ${entity.role}\n` +
                       `Location: ${entity.location}\n` +
                       `Level: ${entity.level}`;
        } else if (isMonster(entity)) {
          entityInfo += `Challenge Rating: ${entity.challengeRating}\n` +
                       `Type: ${entity.creatureType}\n` +
                       `Size: ${entity.size}`;
        }

        return {
          content: [
            {
              type: 'text',
              text: entityInfo
            }
          ]
        };
      }

      case 'set_active_entity': {
        const { id } = args as any;
        const entity = await getEntity(id);
        
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: `Entity with ID ${id} not found.`
              }
            ]
          };
        }

        await setActiveEntityById(id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Set active entity to: ${entity.name} (${entity.type})`
            }
          ]
        };
      }

      case 'delete_entity': {
        const { id } = args as any;
        const entity = await getEntity(id);
        
        if (!entity) {
          return {
            content: [
              {
                type: 'text',
                text: `Entity with ID ${id} not found.`
              }
            ]
          };
        }

        await deleteEntityById(id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Deleted entity: ${entity.name} (${entity.type})`
            }
          ]
        };
      }

      case 'search_entities': {
        const { query } = args as any;
        const entities = await searchEntities(query);
        
        if (entities.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No entities found matching "${query}".`
              }
            ]
          };
        }

        const searchResults = entities.map(entity => {
          if (isCharacter(entity)) {
            return `${entity.name} (Level ${entity.level} ${entity.race.name} ${entity.class.name}) - ID: ${entity.id}`;
          } else if (isNPC(entity)) {
            return `${entity.name} (${entity.role} in ${entity.location}) - ID: ${entity.id}`;
          } else if (isMonster(entity)) {
            return `${entity.name} (CR ${entity.challengeRating} ${entity.creatureType}) - ID: ${entity.id}`;
          }
          return `${(entity as GameEntity).name} - ID: ${(entity as GameEntity).id}`;
        }).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Search results for "${query}":\n\n${searchResults}`
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
});

// Helper function to get hit die for class
function getHitDieForClass(className: string): number {
  const hitDieMap: { [key: string]: number } = {
    'Barbarian': 12,
    'Bard': 8,
    'Cleric': 8,
    'Druid': 8,
    'Fighter': 10,
    'Monk': 8,
    'Paladin': 10,
    'Ranger': 10,
    'Rogue': 8,
    'Sorcerer': 6,
    'Warlock': 8,
    'Wizard': 6
  };
  
  return hitDieMap[className] || 8;
}

// Helper function to get ability for skill
function getAbilityForSkill(skillName: string): keyof AbilityScores {
  const skillAbilityMap: { [key: string]: keyof AbilityScores } = {
    'Athletics': 'strength',
    'Acrobatics': 'dexterity',
    'Sleight of Hand': 'dexterity',
    'Stealth': 'dexterity',
    'Arcana': 'intelligence',
    'History': 'intelligence',
    'Investigation': 'intelligence',
    'Nature': 'intelligence',
    'Religion': 'intelligence',
    'Animal Handling': 'wisdom',
    'Insight': 'wisdom',
    'Medicine': 'wisdom',
    'Perception': 'wisdom',
    'Survival': 'wisdom',
    'Deception': 'charisma',
    'Intimidation': 'charisma',
    'Performance': 'charisma',
    'Persuasion': 'charisma'
  };
  
  return skillAbilityMap[skillName] || 'intelligence';
}

// Start the server
async function main() {
  // Initialize character from file
  await initializeCharacter();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('D&D Character MCP server running on stdio');
}

main().catch(console.error);
