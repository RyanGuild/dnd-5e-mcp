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
} from '../src/utils/inventory';
import { CharacterInventory, InventoryItem } from '../src/types/equipment';
import { DNDCharacter } from '../src/types/character';
import { createCompleteCharacter, testFighter, createTestAbilityScores } from './data/testCharacters';

describe('Inventory Management', () => {
  let testInventory: CharacterInventory;
  let testCharacter: DNDCharacter;

  beforeEach(() => {
    testInventory = {
      items: [],
      maxWeight: 240,
      currentWeight: 0,
      currency: {
        platinum: 0,
        gold: 10,
        silver: 50,
        copper: 100,
      },
    };

    testCharacter = createCompleteCharacter({
      ...testFighter,
      abilityScores: createTestAbilityScores(16, 14, 15, 12, 13, 10),
      inventory: testInventory,
    });
  });

  describe('Item Database Access', () => {
    it('should find weapons by ID', () => {
      const longsword = getWeaponById('longsword');
      expect(longsword).toBeDefined();
      expect(longsword?.name).toBe('Longsword');
      expect(longsword?.damage.dice).toBe(1);
      expect(longsword?.damage.sides).toBe(8);
    });

    it('should find armor by ID', () => {
      const chainMail = getArmorById('chain_mail');
      expect(chainMail).toBeDefined();
      expect(chainMail?.name).toBe('Chain Mail');
      expect(chainMail?.ac).toBeGreaterThan(10);
    });

    it('should find equipment by ID', () => {
      const rope = getEquipmentById('rope_hempen');
      expect(rope).toBeDefined();
      expect(rope?.name).toContain('Rope');
    });

    it('should return undefined for non-existent items', () => {
      expect(getWeaponById('nonexistent-weapon')).toBeUndefined();
      expect(getArmorById('nonexistent-armor')).toBeUndefined();
      expect(getEquipmentById('nonexistent-equipment')).toBeUndefined();
    });
  });

  describe('Item Search', () => {
    it('should search items by name', () => {
      const swordResults = searchItems('sword');
      expect(swordResults.length).toBeGreaterThan(0);
      
      const containsSword = swordResults.some(item => 
        item.name.toLowerCase().includes('sword')
      );
      expect(containsSword).toBe(true);
    });

    it('should search items by description', () => {
      const results = searchItems('versatile');
      expect(results.length).toBeGreaterThan(0);
      
      // Should find weapons with versatile property
      const hasVersatileWeapon = results.some(item => 
        'properties' in item && item.properties && item.properties.includes('versatile')
      );
      expect(hasVersatileWeapon).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchItems('xyznonexistentitem');
      expect(results).toEqual([]);
    });

    it('should be case insensitive', () => {
      const upperResults = searchItems('SWORD');
      const lowerResults = searchItems('sword');
      expect(upperResults.length).toBe(lowerResults.length);
    });
  });

  describe('Adding Items to Inventory', () => {
    it('should add a weapon to inventory', () => {
      const longsword = getWeaponById('longsword');
      expect(longsword).toBeDefined();

      addItemToInventory(testInventory, longsword!, 1, false);

      expect(testInventory.items).toHaveLength(1);
      expect(testInventory.items[0].item.name).toBe('Longsword');
      expect(testInventory.items[0].quantity).toBe(1);
      expect(testInventory.items[0].equipped).toBe(false);
    });

    it('should add multiple quantities of an item', () => {
      const dart = getEquipmentById('dart');
      if (dart) {
        addItemToInventory(testInventory, dart, 20, false);

        expect(testInventory.items).toHaveLength(1);
        expect(testInventory.items[0].quantity).toBe(20);
      }
    });

    it('should stack identical items', () => {
      const dart = getEquipmentById('dart');
      if (dart) {
        addItemToInventory(testInventory, dart, 10, false);
        addItemToInventory(testInventory, dart, 15, false);

        expect(testInventory.items).toHaveLength(1);
        expect(testInventory.items[0].quantity).toBe(25);
      }
    });

    it('should add item as equipped when specified', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, true);

        expect(testInventory.items[0].equipped).toBe(true);
      }
    });

    it('should add notes to items', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, false, 'Family heirloom');

        expect(testInventory.items[0].notes).toBe('Family heirloom');
      }
    });
  });

  describe('Removing Items from Inventory', () => {
  beforeEach(() => {
    const longsword = getWeaponById('longsword');
    const dart = getWeaponById('dart');
    
    if (longsword) addItemToInventory(testInventory, longsword, 1, false);
    if (dart) addItemToInventory(testInventory, dart, 30, false);
  });

    it('should remove items by ID', () => {
      removeItemFromInventory(testInventory, 'longsword', 1);

      const remainingItems = testInventory.items.filter(item => item.item.id === 'longsword');
      expect(remainingItems).toHaveLength(0);
    });

    it('should reduce quantity when removing partial amounts', () => {
      removeItemFromInventory(testInventory, 'dart', 10);

      const dartItem = testInventory.items.find(item => item.item.id === 'dart');
      expect(dartItem?.quantity).toBe(20);
    });

    it('should remove item completely when quantity reaches zero', () => {
      removeItemFromInventory(testInventory, 'dart', 30);

      const dartItem = testInventory.items.find(item => item.item.id === 'dart');
      expect(dartItem).toBeUndefined();
    });

    it('should throw error when trying to remove more than available', () => {
      expect(() => {
        removeItemFromInventory(testInventory, 'dart', 50);
      }).toThrow();
    });

    it('should throw error when trying to remove non-existent item', () => {
      expect(() => {
        removeItemFromInventory(testInventory, 'nonexistent-item', 1);
      }).toThrow();
    });
  });

  describe('Equipment Management', () => {
    beforeEach(() => {
      const longsword = getWeaponById('longsword');
      const chainMail = getArmorById('chain_mail');
      const shield = getArmorById('shield');
      
      if (longsword) addItemToInventory(testInventory, longsword, 1, false);
      if (chainMail) addItemToInventory(testInventory, chainMail, 1, false);
      if (shield) addItemToInventory(testInventory, shield, 1, false);
    });

    it('should equip items', () => {
      equipItem(testInventory, 'longsword');

      const longswordItem = testInventory.items.find(item => item.item.id === 'longsword');
      expect(longswordItem?.equipped).toBe(true);
    });

    it('should unequip items', () => {
      equipItem(testInventory, 'longsword');
      unequipItem(testInventory, 'longsword');

      const longswordItem = testInventory.items.find(item => item.item.id === 'longsword');
      expect(longswordItem?.equipped).toBe(false);
    });

    it('should throw error when equipping non-existent item', () => {
      expect(() => {
        equipItem(testInventory, 'nonexistent-item');
      }).toThrow();
    });

    it('should throw error when unequipping non-existent item', () => {
      expect(() => {
        unequipItem(testInventory, 'nonexistent-item');
      }).toThrow();
    });
  });

  describe('Equipped Items Retrieval', () => {
    beforeEach(() => {
      const longsword = getWeaponById('longsword');
      const shortbow = getWeaponById('shortbow');
      const chainMail = getArmorById('chain_mail');
      const shield = getArmorById('shield');
      
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, true);
      }
      if (shortbow) {
        addItemToInventory(testInventory, shortbow, 1, true);
      }
      if (chainMail) {
        addItemToInventory(testInventory, chainMail, 1, true);
      }
      if (shield) {
        addItemToInventory(testInventory, shield, 1, true);
      }
    });

    it('should get equipped weapons', () => {
      const equippedWeapons = getEquippedWeapons(testInventory);
      
      expect(equippedWeapons).toHaveLength(2);
      const weaponNames = equippedWeapons.map(w => w.name);
      expect(weaponNames).toContain('Longsword');
      expect(weaponNames).toContain('Shortbow');
    });

    it('should get equipped armor', () => {
      const equippedArmor = getEquippedArmor(testInventory);
      
      expect(equippedArmor?.name).toBe('Chain Mail');
    });

    it('should get equipped shield', () => {
      const equippedShield = getEquippedShield(testInventory);
      
      expect(equippedShield?.name).toBe('Shield');
    });

    it('should return empty array for no equipped weapons', () => {
      const emptyInventory: CharacterInventory = {
        items: [],
        maxWeight: 150,
        currentWeight: 0,
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }
      };
      
      const equippedWeapons = getEquippedWeapons(emptyInventory);
      expect(equippedWeapons).toEqual([]);
    });

    it('should return undefined for no equipped armor', () => {
      const emptyInventory: CharacterInventory = {
        items: [],
        maxWeight: 150,
        currentWeight: 0,
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }
      };
      
      const equippedArmor = getEquippedArmor(emptyInventory);
      expect(equippedArmor).toBeUndefined();
    });
  });

  describe('Equipment Statistics Calculation', () => {
    it('should calculate base AC with no equipment', () => {
      const emptyCharacter = createCompleteCharacter({
        abilityScores: createTestAbilityScores(10, 14, 12, 10, 10, 10),
        inventory: { items: [], maxWeight: 150, currentWeight: 0, currency: { platinum: 0, gold: 0, silver: 0, copper: 0 } }
      });

      const stats = calculateEquipmentStats(emptyCharacter);
      
      expect(stats.armorClass).toBe(12); // 10 + 2 (DEX modifier)
    });

    it('should calculate AC with armor equipped', () => {
      const chainMail = getArmorById('chain_mail');
      if (chainMail) {
        addItemToInventory(testInventory, chainMail, 1, true);
        
        const stats = calculateEquipmentStats(testCharacter);
        
        // Chain mail AC should be used instead of base AC
        expect(stats.armorClass).toBeGreaterThan(10);
      }
    });

    it('should calculate AC with armor and shield', () => {
      const chainMail = getArmorById('chain_mail');
      const shield = getArmorById('shield');
      
      if (chainMail && shield) {
        addItemToInventory(testInventory, chainMail, 1, true);
        addItemToInventory(testInventory, shield, 1, true);
        
        const stats = calculateEquipmentStats(testCharacter);
        
        // Should include shield bonus
        expect(stats.armorClass).toBeGreaterThan(15);
      }
    });

    it('should calculate attack and damage bonuses', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, true);
        
        const stats = calculateEquipmentStats(testCharacter);
        
        // Should have bonuses from equipped weapons
        expect(stats.attackBonus).toBeGreaterThan(0);
        expect(stats.damageBonus).toBeGreaterThan(0);
      }
    });

    it('should detect stealth disadvantage from heavy armor', () => {
      const chainMail = getArmorById('chain_mail');
      if (chainMail) {
        addItemToInventory(testInventory, chainMail, 1, true);
        
        const stats = calculateEquipmentStats(testCharacter);
        
        // Chain mail should impose stealth disadvantage
        expect(stats.stealthDisadvantage).toBe(true);
      }
    });

    it('should calculate strength requirements', () => {
      const chainMail = getArmorById('chain_mail');
      if (chainMail) {
        addItemToInventory(testInventory, chainMail, 1, true);
        
        const stats = calculateEquipmentStats(testCharacter);
        
        // Chain mail should have strength requirement
        expect(stats.strengthRequirement).toBeGreaterThan(0);
      }
    });
  });

  describe('Weight Calculations', () => {
    it('should calculate maximum carrying capacity', () => {
      const maxWeight = calculateMaxWeight(16); // 16 Strength
      
      expect(maxWeight).toBe(240); // 16 * 15 = 240 lbs
    });

    it('should calculate current inventory weight', () => {
      const longsword = getWeaponById('longsword');
      const chainMail = getArmorById('chain_mail');
      
      if (longsword && chainMail) {
        addItemToInventory(testInventory, longsword, 1, false);
        addItemToInventory(testInventory, chainMail, 1, false);
        
        const currentWeight = calculateCurrentWeight(testInventory);
        
        expect(currentWeight).toBeGreaterThan(0);
        expect(currentWeight).toBe(longsword.weight + chainMail.weight);
      }
    });

    it('should handle multiple quantities in weight calculation', () => {
      const dart = getEquipmentById('dart');
      if (dart) {
        addItemToInventory(testInventory, dart, 20, false);
        
        const currentWeight = calculateCurrentWeight(testInventory);
        
        expect(currentWeight).toBe(dart.weight * 20);
      }
    });

    it('should calculate weight for empty inventory', () => {
      const emptyInventory: CharacterInventory = {
        items: [],
        maxWeight: 150,
        currentWeight: 0,
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }
      };
      
      const currentWeight = calculateCurrentWeight(emptyInventory);
      expect(currentWeight).toBe(0);
    });
  });

  describe('Currency Management', () => {
    it('should track different currency types', () => {
      expect(testInventory.currency.platinum).toBe(0);
      expect(testInventory.currency.gold).toBe(10);
      expect(testInventory.currency.silver).toBe(50);
      expect(testInventory.currency.copper).toBe(100);
    });

    it('should allow currency modifications', () => {
      testInventory.currency.gold += 25;
      testInventory.currency.silver -= 10;
      
      expect(testInventory.currency.gold).toBe(35);
      expect(testInventory.currency.silver).toBe(40);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle adding items with zero quantity', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        expect(() => addItemToInventory(testInventory, longsword, 0, false)).toThrow();
      }
    });

    it('should handle negative quantities gracefully', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        expect(() => {addItemToInventory(testInventory, longsword, -1, false)}).toThrow();
      }
    });

    it('should handle equipping the same item multiple times', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, false);
        
        equipItem(testInventory, 'longsword');
        equipItem(testInventory, 'longsword'); // Should not cause error
        
        const longswordItem = testInventory.items.find(item => item.item.id === 'longsword');
        expect(longswordItem?.equipped).toBe(true);
      }
    });

    it('should handle unequipping already unequipped items', () => {
      const longsword = getWeaponById('longsword');
      if (longsword) {
        addItemToInventory(testInventory, longsword, 1, false);
        
        unequipItem(testInventory, 'longsword'); // Should not cause error
        
        const longswordItem = testInventory.items.find(item => item.item.id === 'longsword');
        expect(longswordItem?.equipped).toBe(false);
      }
    });

    it('should handle very high strength scores for weight calculation', () => {
      const maxWeight = calculateMaxWeight(30); // Legendary strength
      
      expect(maxWeight).toBe(450); // 30 * 15 = 450 lbs
    });

    it('should handle very low strength scores for weight calculation', () => {
      const maxWeight = calculateMaxWeight(1); // Minimum strength
      
      expect(maxWeight).toBe(15); // 1 * 15 = 15 lbs
    });
  });

  describe('Complex Inventory Scenarios', () => {
    it('should handle a full adventurer\'s inventory', () => {
      // Add a variety of items
      const items = [
        { id: 'longsword', quantity: 1, equipped: true },
        { id: 'shortbow', quantity: 1, equipped: true },
        { id: 'chain_mail', quantity: 1, equipped: true },
        { id: 'shield', quantity: 1, equipped: true },
        { id: 'dart', quantity: 30, equipped: false },
        { id: 'rope_hempen', quantity: 1, equipped: false },
      ];

      items.forEach(({ id, quantity, equipped }) => {
        const item = getWeaponById(id) || getArmorById(id) || getEquipmentById(id);
        if (item) {
          addItemToInventory(testInventory, item, quantity, equipped);
        }
      });

      expect(testInventory.items.length).toBeGreaterThan(0);
      
      const equippedWeapons = getEquippedWeapons(testInventory);
      const equippedArmor = getEquippedArmor(testInventory);
      const equippedShield = getEquippedShield(testInventory);
      
      expect(equippedWeapons.length).toBeGreaterThan(0);
      expect(equippedArmor).toBeDefined();
      expect(equippedShield).toBeDefined();
      
      const stats = calculateEquipmentStats(testCharacter);
      expect(stats.armorClass).toBeGreaterThan(10);
      
      const currentWeight = calculateCurrentWeight(testInventory);
      const maxWeight = calculateMaxWeight(testCharacter.abilityScores.strength.value);
      expect(currentWeight).toBeLessThan(maxWeight); // Should not be overloaded
    });

    it('should handle inventory reorganization', () => {
      // Add items
      const longsword = getWeaponById('longsword');
      const shortbow = getWeaponById('shortbow');
      
      if (longsword && shortbow) {
        addItemToInventory(testInventory, longsword, 1, true);
        addItemToInventory(testInventory, shortbow, 1, false);
        
        // Reorganize: unequip longsword, equip shortbow
        unequipItem(testInventory, 'longsword');
        equipItem(testInventory, 'shortbow');
        
        const equippedWeapons = getEquippedWeapons(testInventory);
        expect(equippedWeapons).toHaveLength(1);
        expect(equippedWeapons[0].name).toBe('Shortbow');
      }
    });
  });
});