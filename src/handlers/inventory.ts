import { ToolModule, ToolHandler, HandlerContext, HandlerResult, createSuccessResult, createErrorResult } from './types';
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
  searchItems
} from '../utils/inventory';
import { saveCharacter } from '../utils/storage';
import { z } from 'zod';

// Input validation schemas
const AddItemInputSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).default(1),
  equipped: z.boolean().default(false),
  notes: z.string().optional(),
});

const RemoveItemInputSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).default(1),
});

const EquipItemInputSchema = z.object({
  itemId: z.string(),
});

const SearchItemsInputSchema = z.object({
  query: z.string(),
});

// Inventory tool definitions
const inventoryTools = [
  {
    name: 'add_item',
    description: 'Add an item to the character\'s inventory',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
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
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'search_items',
    description: 'Search for weapons, armor, or equipment by name or description',
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

// Inventory handlers
const addItemHandler: ToolHandler = {
  name: 'add_item',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = AddItemInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { itemId, quantity, equipped, notes } = inputValidation.data;
    
    // Try to find the item in weapons, armor, or equipment
    let item = getWeaponById(itemId) || getArmorById(itemId) || getEquipmentById(itemId);
    
    if (!item) {
      return createErrorResult(`Item with ID '${itemId}' not found. Use search_items to find available items.`);
    }

    try {
      addItemToInventory(context.currentCharacter.inventory, item, quantity, equipped, notes);
      await saveCharacter(context.currentCharacter);
      
      const equippedText = equipped ? ' and equipped' : '';
      return createSuccessResult(
        `Added ${quantity} ${item.name}${equippedText} to ${context.currentCharacter.name}'s inventory.`
      );
    } catch (error) {
      return createErrorResult(`Error adding item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const removeItemHandler: ToolHandler = {
  name: 'remove_item',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = RemoveItemInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { itemId, quantity } = inputValidation.data;

    try {
      removeItemFromInventory(context.currentCharacter.inventory, itemId, quantity);
      await saveCharacter(context.currentCharacter);
      
      return createSuccessResult(
        `Removed ${quantity} item(s) from ${context.currentCharacter.name}'s inventory.`
      );
    } catch (error) {
      return createErrorResult(`Error removing item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const equipItemHandler: ToolHandler = {
  name: 'equip_item',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = EquipItemInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { itemId } = inputValidation.data;

    try {
      equipItem(context.currentCharacter.inventory, itemId);
      await saveCharacter(context.currentCharacter);
      
      return createSuccessResult(
        `Equipped item in ${context.currentCharacter.name}'s inventory.`
      );
    } catch (error) {
      return createErrorResult(`Error equipping item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const unequipItemHandler: ToolHandler = {
  name: 'unequip_item',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const inputValidation = EquipItemInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { itemId } = inputValidation.data;

    try {
      unequipItem(context.currentCharacter.inventory, itemId);
      await saveCharacter(context.currentCharacter);
      
      return createSuccessResult(
        `Unequipped item in ${context.currentCharacter.name}'s inventory.`
      );
    } catch (error) {
      return createErrorResult(`Error unequipping item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

const getInventoryHandler: ToolHandler = {
  name: 'get_inventory',
  handler: async (args: any, context: HandlerContext) => {
    if (!context.currentCharacter) {
      return createErrorResult('No character created yet. Use create_character to create one.');
    }

    const character = context.currentCharacter;
    const inventory = character.inventory;
    const equippedWeapons = getEquippedWeapons(inventory);
    const equippedArmor = getEquippedArmor(inventory);
    const equippedShield = getEquippedShield(inventory);
    const equipmentStats = calculateEquipmentStats(character);

    let result = `Inventory for ${character.name}:\n\n`;
    
    // Equipped items
    result += `Equipped Items:\n`;
    if (equippedArmor) {
      result += `- Armor: ${equippedArmor.name} (AC: ${equippedArmor.ac})\n`;
    }
    if (equippedShield) {
      result += `- Shield: ${equippedShield.name} (AC Bonus: +${equippedShield.acBonus || 0})\n`;
    }
    if (equippedWeapons.length > 0) {
      result += `- Weapons: ${equippedWeapons.map(w => w.name).join(', ')}\n`;
    }
    if (!equippedArmor && !equippedShield && equippedWeapons.length === 0) {
      result += `- None\n`;
    }
    
    result += `\nEquipment Stats:\n`;
    result += `- Armor Class: ${equipmentStats.armorClass}\n`;
    result += `- Attack Bonus: ${equipmentStats.attackBonus >= 0 ? '+' : ''}${equipmentStats.attackBonus}\n`;
    result += `- Damage Bonus: ${equipmentStats.damageBonus >= 0 ? '+' : ''}${equipmentStats.damageBonus}\n`;
    if (equipmentStats.speedModifier !== 0) {
      result += `- Speed Modifier: ${equipmentStats.speedModifier} ft\n`;
    }
    if (equipmentStats.stealthDisadvantage) {
      result += `- Stealth Disadvantage: Yes\n`;
    }
    
    result += `\nInventory Items:\n`;
    if (inventory.items.length === 0) {
      result += `- Empty\n`;
    } else {
      inventory.items.forEach(item => {
        const equippedText = item.equipped ? ' (equipped)' : '';
        const notesText = item.notes ? ` - ${item.notes}` : '';
        result += `- ${item.item.name} x${item.quantity}${equippedText}${notesText}\n`;
      });
    }
    
    result += `\nWeight: ${inventory.currentWeight}/${inventory.maxWeight} lbs\n`;
    result += `Currency: ${inventory.currency.gold} gp, ${inventory.currency.silver} sp, ${inventory.currency.copper} cp`;

    return createSuccessResult(result);
  }
};

const searchItemsHandler: ToolHandler = {
  name: 'search_items',
  handler: async (args: any, context: HandlerContext) => {
    const inputValidation = SearchItemsInputSchema.safeParse(args);
    if (!inputValidation.success) {
      return createErrorResult(`Invalid input: ${inputValidation.error.message}`);
    }

    const { query } = inputValidation.data;
    const results = searchItems(query);

    if (results.length === 0) {
      return createSuccessResult(`No items found matching "${query}"`);
    }

    let result = `Found ${results.length} item(s) matching "${query}":\n\n`;
    
    results.forEach(item => {
      result += `- ${item.name} (ID: ${item.id})\n`;
      result += `  ${item.description}\n`;
      if ('damage' in item) {
        result += `  Damage: ${item.damage}\n`;
      }
      if ('ac' in item) {
        result += `  AC: ${item.ac}\n`;
      }
      if ('weight' in item) {
        result += `  Weight: ${item.weight} lbs\n`;
      }
      result += `\n`;
    });

    return createSuccessResult(result);
  }
};

// Inventory module
export const inventoryModule: ToolModule = {
  tools: inventoryTools,
  handlers: [
    addItemHandler,
    removeItemHandler,
    equipItemHandler,
    unequipItemHandler,
    getInventoryHandler,
    searchItemsHandler,
  ],
};
