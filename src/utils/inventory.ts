import { CharacterInventory, InventoryItem, EquipmentStats, Weapon, Armor, Equipment } from '../types/equipment';
import { DNDCharacter } from '../types/character';
import { WEAPONS } from '../data/weapons';
import { ARMOR } from '../data/armor';
import { EQUIPMENT } from '../data/equipment';

export function createEmptyInventory(): CharacterInventory {
  return {
    items: [],
    maxWeight: 0, // Will be calculated based on strength
    currentWeight: 0,
    currency: {
      copper: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    }
  };
}

export function calculateMaxWeight(strength: number): number {
  return strength * 15; // 15 pounds per point of strength
}

export function calculateCurrentWeight(inventory: CharacterInventory): number {
  return inventory.items.reduce((total, item) => {
    return total + (item.item.weight * item.quantity);
  }, 0);
}

export function addItemToInventory(
  inventory: CharacterInventory,
  item: Weapon | Armor | Equipment,
  quantity: number = 1,
  equipped: boolean = false,
  notes?: string
): CharacterInventory {
  // Validate quantity
  if (quantity <= 0) {
    return inventory; // Don't add items with zero or negative quantity
  }
  
  const existingItem = inventory.items.find(i => i.item.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem: InventoryItem = {
      id: generateId(),
      item,
      quantity,
      equipped,
      notes
    };
    inventory.items.push(newItem);
  }
  
  inventory.currentWeight = calculateCurrentWeight(inventory);
  return inventory;
}

export function removeItemFromInventory(
  inventory: CharacterInventory,
  itemId: string,
  quantity: number = 1
): CharacterInventory {
  const itemIndex = inventory.items.findIndex(i => i.item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in inventory');
  }
  
  const item = inventory.items[itemIndex];
  
  if (item.quantity < quantity) {
    throw new Error('Not enough items in inventory');
  }
  
  if (item.quantity <= quantity) {
    inventory.items.splice(itemIndex, 1);
  } else {
    item.quantity -= quantity;
  }
  
  inventory.currentWeight = calculateCurrentWeight(inventory);
  return inventory;
}

export function equipItem(inventory: CharacterInventory, itemId: string): CharacterInventory {
  const item = inventory.items.find(i => i.item.id === itemId);
  
  if (!item) {
    throw new Error('Item not found in inventory');
  }
  
  // Unequip other items of the same type
  if ('type' in item.item && (item.item.type === 'light' || item.item.type === 'medium' || item.item.type === 'heavy')) {
    inventory.items.forEach(i => {
      if ('type' in i.item && (i.item.type === 'light' || i.item.type === 'medium' || i.item.type === 'heavy') && i.item.id !== itemId) {
        i.equipped = false;
      }
    });
  } else if ('type' in item.item && item.item.type === 'shield') {
    inventory.items.forEach(i => {
      if ('type' in i.item && i.item.type === 'shield' && i.item.id !== itemId) {
        i.equipped = false;
      }
    });
  }
  
  item.equipped = true;
  return inventory;
}

export function unequipItem(inventory: CharacterInventory, itemId: string): CharacterInventory {
  const item = inventory.items.find(i => i.item.id === itemId);
  
  if (!item) {
    throw new Error('Item not found in inventory');
  }
  
  item.equipped = false;
  return inventory;
}

export function getEquippedWeapons(inventory: CharacterInventory): Weapon[] {
  return inventory.items
    .filter(i => 'type' in i.item && (i.item.type === 'melee' || i.item.type === 'ranged') && i.equipped)
    .map(i => i.item as Weapon);
}

export function getEquippedArmor(inventory: CharacterInventory): Armor | undefined {
  const armorItem = inventory.items.find(i => 
    'type' in i.item && 
    (i.item.type === 'light' || i.item.type === 'medium' || i.item.type === 'heavy') && 
    i.equipped
  );
  
  return armorItem ? armorItem.item as Armor : undefined;
}

export function getEquippedShield(inventory: CharacterInventory): Armor | null {
  const shieldItem = inventory.items.find(i => 
    'type' in i.item && i.item.type === 'shield' && i.equipped
  );
  
  return shieldItem ? shieldItem.item as Armor : null;
}

export function calculateEquipmentStats(character: DNDCharacter): EquipmentStats {
  const inventory = character.inventory;
  const equippedArmor = getEquippedArmor(inventory);
  const equippedShield = getEquippedShield(inventory);
  const equippedWeapons = getEquippedWeapons(inventory);
  
  // Calculate Armor Class
  let armorClass = 10; // Base AC
  let stealthDisadvantage = false;
  let strengthRequirement = 0;
  
  if (equippedArmor) {
    armorClass = equippedArmor.ac;
    stealthDisadvantage = equippedArmor.stealthDisadvantage;
    strengthRequirement = equippedArmor.strengthRequirement || 0;
    
    // Apply Dexterity bonus based on armor type
    if (equippedArmor.dexBonus === 'unlimited') {
      armorClass += character.abilityScores.dexterity.modifier;
    } else if (equippedArmor.dexBonus === 'limited') {
      armorClass += Math.min(character.abilityScores.dexterity.modifier, 2);
    }
  } else {
    // No armor - use Dexterity modifier
    armorClass += character.abilityScores.dexterity.modifier;
  }
  
  // Add shield bonus
  if (equippedShield) {
    armorClass += equippedShield.acBonus || 0;
  }
  
  // Calculate attack bonus (using first equipped weapon)
  let attackBonus = 0;
  let damageBonus = 0;
  
  if (equippedWeapons.length > 0) {
    const weapon = equippedWeapons[0];
    const isProficient = character.equipmentProficiencies?.includes(weapon.category) || false;
    
    if (weapon.type === 'melee') {
      attackBonus = character.abilityScores.strength.modifier;
      damageBonus = character.abilityScores.strength.modifier;
    } else {
      attackBonus = character.abilityScores.dexterity.modifier;
      damageBonus = character.abilityScores.dexterity.modifier;
    }
    
    if (isProficient) {
      attackBonus += character.proficiencyBonus;
    }
  }
  
  // Calculate speed modifier
  let speedModifier = 0;
  if (equippedArmor && character.abilityScores.strength.value < (equippedArmor.strengthRequirement || 0)) {
    speedModifier = -10; // Speed reduced by 10 feet
  }
  
  return {
    armorClass,
    attackBonus,
    damageBonus,
    speedModifier,
    stealthDisadvantage,
    strengthRequirement
  };
}

export function getWeaponById(id: string): Weapon | undefined {
  return WEAPONS.find(w => w.id === id);
}

export function getArmorById(id: string): Armor | undefined {
  return ARMOR.find(a => a.id === id);
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT.find(e => e.id === id);
}

export function searchItems(query: string): (Weapon | Armor | Equipment)[] {
  const allItems = [...WEAPONS, ...ARMOR, ...EQUIPMENT];
  const lowerQuery = query.toLowerCase();
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
