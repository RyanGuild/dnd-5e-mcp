import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
import { 
  createNPCEntity,
  createMonsterEntity,
  getEntity,
  setActiveEntityById,
  deleteEntityById,
  listAllEntities,
  listEntitiesByType,
  searchEntities
} from '../utils/entities';
import { isCharacter, isNPC, isMonster } from '../types/entity';
import { z } from 'zod';

// Input validation schemas
const ListEntitiesInputSchema = z.object({
  type: z.enum(['character', 'npc', 'monster']).optional(),
});

const CreateNPCInputSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  level: z.number().min(1).max(20).optional(),
  abilityScores: z.object({
    strength: z.number().optional(),
    dexterity: z.number().optional(),
    constitution: z.number().optional(),
    intelligence: z.number().optional(),
    wisdom: z.number().optional(),
    charisma: z.number().optional(),
  }).optional(),
});

const CreateMonsterInputSchema = z.object({
  name: z.string(),
  challengeRating: z.number().min(0).max(30),
  creatureType: z.string(),
  size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']),
  abilityScores: z.object({
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
  }),
  hitPoints: z.object({
    maximum: z.number(),
    hitDice: z.string(),
  }),
  armorClass: z.number(),
  speed: z.object({
    walk: z.number(),
    fly: z.number().optional(),
    swim: z.number().optional(),
    climb: z.number().optional(),
  }),
});

const GetEntityInputSchema = z.object({
  id: z.string(),
});

const SetActiveEntityInputSchema = z.object({
  id: z.string(),
});

const DeleteEntityInputSchema = z.object({
  id: z.string(),
});

const SearchEntitiesInputSchema = z.object({
  query: z.string(),
});

// Entities tool definitions
const entitiesTools = [
  {
    name: 'list_entities',
    description: 'List all entities (characters, NPCs, monsters) or filter by type',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
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
      },
      required: ['name', 'role', 'location'],
    },
  },
  {
    name: 'create_monster',
    description: 'Create a new monster',
    inputSchema: {
      type: 'object' as const,
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
          type: 'object' as const,
          description: 'Ability scores object',
          properties: {
            strength: { type: 'number' },
            dexterity: { type: 'number' },
            constitution: { type: 'number' },
            intelligence: { type: 'number' },
            wisdom: { type: 'number' },
            charisma: { type: 'number' },
          },
          required: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
        },
        hitPoints: {
          type: 'object' as const,
          description: 'Hit points with maximum and hit dice',
          properties: {
            maximum: { type: 'number' },
            hitDice: { type: 'string' },
          },
          required: ['maximum', 'hitDice'],
        },
        armorClass: {
          type: 'number',
          description: 'Armor class',
        },
        speed: {
          type: 'object' as const,
          description: 'Speed object with walk and optional other speeds',
          properties: {
            walk: { type: 'number' },
            fly: { type: 'number' },
            swim: { type: 'number' },
            climb: { type: 'number' },
          },
          required: ['walk'],
        },
      },
      required: ['name', 'challengeRating', 'creatureType', 'size', 'abilityScores', 'hitPoints', 'armorClass', 'speed'],
    },
  },
  {
    name: 'get_entity',
    description: 'Get a specific entity by ID',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
];

// Entities handlers
const listEntitiesHandler: ToolHandler = {
  name: 'list_entities',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = ListEntitiesInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { type } = inputValidation.data;
    
    try {
      const entities = type ? await listEntitiesByType(type) : await listAllEntities();
      
      if (entities.length === 0) {
        return createSuccessResult(`No ${type || 'entities'} found.`);
      }

      const entityList = entities.map(entity => {
        if (isCharacter(entity)) {
          return `${entity.name} (Level ${entity.level} ${entity.race.name} ${entity.class.name}) - ID: ${entity.id}`;
        } else if (isNPC(entity)) {
          return `${entity.name} (${entity.role} in ${entity.location}) - ID: ${entity.id}`;
        } else if (isMonster(entity)) {
          return `${entity.name} (CR ${entity.challengeRating} ${entity.creatureType}) - ID: ${entity.id}`;
        }
        return `${(entity as any).name} - ID: ${(entity as any).id}`;
      });

      return createSuccessResult(
        `Found ${entities.length} ${type || 'entities'}:\n\n` +
        entityList.join('\n')
      );
    } catch (error) {
      return createErrorResult(`Error listing entities: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const createNPCHandler: ToolHandler = {
  name: 'create_npc',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = CreateNPCInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { name, role, location, level, abilityScores } = inputValidation.data;
    
    try {
      const npc = await createNPCEntity({
        name,
        role,
        location,
        level,
        abilityScores: abilityScores ? {
          strength: { value: abilityScores.strength || 10, modifier: Math.floor(((abilityScores.strength || 10) - 10) / 2) },
          dexterity: { value: abilityScores.dexterity || 10, modifier: Math.floor(((abilityScores.dexterity || 10) - 10) / 2) },
          constitution: { value: abilityScores.constitution || 10, modifier: Math.floor(((abilityScores.constitution || 10) - 10) / 2) },
          intelligence: { value: abilityScores.intelligence || 10, modifier: Math.floor(((abilityScores.intelligence || 10) - 10) / 2) },
          wisdom: { value: abilityScores.wisdom || 10, modifier: Math.floor(((abilityScores.wisdom || 10) - 10) / 2) },
          charisma: { value: abilityScores.charisma || 10, modifier: Math.floor(((abilityScores.charisma || 10) - 10) / 2) }
        } : undefined
      });

      return createSuccessResult(
        `Created NPC: ${npc.name}\n` +
        `Role: ${npc.role}\n` +
        `Location: ${npc.location}\n` +
        `Level: ${npc.level}\n` +
        `ID: ${npc.id}`
      );
    } catch (error) {
      return createErrorResult(`Error creating NPC: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const createMonsterHandler: ToolHandler = {
  name: 'create_monster',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = CreateMonsterInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { name, challengeRating, creatureType, size, abilityScores, hitPoints, armorClass, speed } = inputValidation.data;
    
    try {
      const monster = await createMonsterEntity({
        name,
        challengeRating,
        creatureType,
        size,
        abilityScores: {
          strength: { value: abilityScores.strength, modifier: Math.floor((abilityScores.strength - 10) / 2) },
          dexterity: { value: abilityScores.dexterity, modifier: Math.floor((abilityScores.dexterity - 10) / 2) },
          constitution: { value: abilityScores.constitution, modifier: Math.floor((abilityScores.constitution - 10) / 2) },
          intelligence: { value: abilityScores.intelligence, modifier: Math.floor((abilityScores.intelligence - 10) / 2) },
          wisdom: { value: abilityScores.wisdom, modifier: Math.floor((abilityScores.wisdom - 10) / 2) },
          charisma: { value: abilityScores.charisma, modifier: Math.floor((abilityScores.charisma - 10) / 2) }
        },
        hitPoints,
        armorClass,
        speed
      });

      return createSuccessResult(
        `Created Monster: ${monster.name}\n` +
        `Challenge Rating: ${monster.challengeRating}\n` +
        `Type: ${monster.creatureType}\n` +
        `Size: ${monster.size}\n` +
        `AC: ${monster.armorClass}\n` +
        `HP: ${monster.hitPoints.maximum}\n` +
        `Speed: ${monster.speed.walk} ft\n` +
        `ID: ${monster.id}`
      );
    } catch (error) {
      return createErrorResult(`Error creating monster: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getEntityHandler: ToolHandler = {
  name: 'get_entity',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = GetEntityInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { id } = inputValidation.data;
    
    try {
      const entity = await getEntity(id);
      
      if (!entity) {
        return createErrorResult(`Entity with ID '${id}' not found.`);
      }

      let result = `Entity Details:\n\n`;
      result += `Name: ${entity.name}\n`;
      result += `ID: ${entity.id}\n`;
      
      if (isCharacter(entity)) {
        result += `Type: Character\n`;
        result += `Level: ${entity.level}\n`;
        result += `Class: ${entity.class.name}\n`;
        result += `Race: ${entity.race.name}\n`;
        result += `AC: ${entity.armorClass}\n`;
        result += `HP: ${entity.hitPoints.current}/${entity.hitPoints.maximum}\n`;
      } else if (isNPC(entity)) {
        result += `Type: NPC\n`;
        result += `Role: ${entity.role}\n`;
        result += `Location: ${entity.location}\n`;
        result += `Level: ${entity.level}\n`;
      } else if (isMonster(entity)) {
        result += `Type: Monster\n`;
        result += `Challenge Rating: ${entity.challengeRating}\n`;
        result += `Creature Type: ${entity.creatureType}\n`;
        result += `Size: ${entity.size}\n`;
        result += `AC: ${entity.armorClass}\n`;
        result += `HP: ${entity.hitPoints.maximum}\n`;
        result += `Speed: ${entity.speed.walk} ft\n`;
      }

      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(`Error getting entity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const setActiveEntityHandler: ToolHandler = {
  name: 'set_active_entity',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = SetActiveEntityInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { id } = inputValidation.data;
    
    try {
      const entity = await getEntity(id);
      if (!entity) {
        return createErrorResult(`Entity with ID '${id}' not found.`);
      }

      await setActiveEntityById(id);
      
      return createSuccessResult(`Set active entity to: ${entity.name} (ID: ${id})`);
    } catch (error) {
      return createErrorResult(`Error setting active entity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const deleteEntityHandler: ToolHandler = {
  name: 'delete_entity',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = DeleteEntityInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { id } = inputValidation.data;
    
    try {
      const entity = await getEntity(id);
      if (!entity) {
        return createErrorResult(`Entity with ID '${id}' not found.`);
      }

      await deleteEntityById(id);
      
      return createSuccessResult(`Deleted entity: ${entity.name} (ID: ${id})`);
    } catch (error) {
      return createErrorResult(`Error deleting entity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const searchEntitiesHandler: ToolHandler = {
  name: 'search_entities',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = SearchEntitiesInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { query } = inputValidation.data;
    
    try {
      const entities = await searchEntities(query);
      
      if (entities.length === 0) {
        return createSuccessResult(`No entities found matching "${query}"`);
      }

      const entityList = entities.map(entity => {
        if (isCharacter(entity)) {
          return `${entity.name} (Level ${entity.level} ${entity.race.name} ${entity.class.name}) - ID: ${entity.id}`;
        } else if (isNPC(entity)) {
          return `${entity.name} (${entity.role} in ${entity.location}) - ID: ${entity.id}`;
        } else if (isMonster(entity)) {
          return `${entity.name} (CR ${entity.challengeRating} ${entity.creatureType}) - ID: ${entity.id}`;
        }
        return `${(entity as any).name} - ID: ${(entity as any).id}`;
      });

      return createSuccessResult(
        `Found ${entities.length} entities matching "${query}":\n\n` +
        entityList.join('\n')
      );
    } catch (error) {
      return createErrorResult(`Error searching entities: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// Entities module
export const entitiesModule: ToolModule = {
  tools: entitiesTools,
  handlers: [
    listEntitiesHandler,
    createNPCHandler,
    createMonsterHandler,
    getEntityHandler,
    setActiveEntityHandler,
    deleteEntityHandler,
    searchEntitiesHandler,
  ],
};
