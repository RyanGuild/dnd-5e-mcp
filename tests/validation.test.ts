import { validateCharacter, formatValidationResult } from '../src/utils/validation';
import { DNDCharacter } from '../src/types/character';
import { 
  createCompleteCharacter, 
  testFighter, 
  testWizard, 
  testRogue,
  invalidCharacters,
  createTestAbilityScores 
} from './data/testCharacters';

describe('Character Validation', () => {
  describe('Valid Character Validation', () => {
    it('should validate a complete fighter character', () => {
      const fighter = createCompleteCharacter(testFighter);
      const result = validateCharacter(fighter);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should validate a complete wizard character', () => {
      const wizard = createCompleteCharacter(testWizard);
      const result = validateCharacter(wizard);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a complete rogue character', () => {
      const rogue = createCompleteCharacter(testRogue);
      const result = validateCharacter(rogue);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate characters with different levels', () => {
      const levels = [1, 5, 10, 15, 20];
      
      levels.forEach(level => {
        const character = createCompleteCharacter({
          name: `Level ${level} Character`,
          level,
          class: { name: 'Fighter', level, hitDie: 10 },
          proficiencyBonus: Math.ceil(level / 4) + 1,
        });
        
        const result = validateCharacter(character);
        expect(result.isValid).toBe(true);
      });
    });

    it('should validate characters with different classes', () => {
      const classes = [
        { name: 'Barbarian', hitDie: 12 },
        { name: 'Bard', hitDie: 8 },
        { name: 'Cleric', hitDie: 8 },
        { name: 'Druid', hitDie: 8 },
        { name: 'Fighter', hitDie: 10 },
        { name: 'Monk', hitDie: 8 },
        { name: 'Paladin', hitDie: 10 },
        { name: 'Ranger', hitDie: 10 },
        { name: 'Rogue', hitDie: 8 },
        { name: 'Sorcerer', hitDie: 6 },
        { name: 'Warlock', hitDie: 8 },
        { name: 'Wizard', hitDie: 6 }
      ];

      classes.forEach(({ name, hitDie }) => {
        const character = createCompleteCharacter({
          name: `Test ${name}`,
          class: { name, level: 3, hitDie },
          level: 3,
        });
        
        const result = validateCharacter(character);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('Invalid Character Validation', () => {
    it('should detect invalid level (too high)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 25, // Max is 20
        class: { name: 'Fighter', level: 25, hitDie: 10 },
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('level'))).toBe(true);
    });

    it('should detect invalid level (too low)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 0, // Min is 1
        class: { name: 'Fighter', level: 0, hitDie: 10 },
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('level'))).toBe(true);
    });

    it('should detect level mismatch between character and class', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 5,
        class: { name: 'Fighter', level: 3, hitDie: 10 }, // Mismatch
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('level') && error.includes('class'))).toBe(true);
    });

    it('should detect invalid ability scores (too low)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        abilityScores: createTestAbilityScores(1, 1, 1, 1, 1, 1), // All too low
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('ability'))).toBe(true);
    });

    it('should detect invalid ability scores (too high)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        abilityScores: createTestAbilityScores(25, 25, 25, 25, 25, 25), // All too high for standard array
      });

      const result = validateCharacter(character);
      // This might be a warning rather than an error, depending on implementation
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should detect incorrect ability modifiers', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        abilityScores: {
          strength: { value: 16, modifier: 2 }, // Should be +3
          dexterity: { value: 14, modifier: 2 },
          constitution: { value: 15, modifier: 2 },
          intelligence: { value: 12, modifier: 1 },
          wisdom: { value: 13, modifier: 1 },
          charisma: { value: 10, modifier: 0 },
        },
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('modifier'))).toBe(true);
    });

    it('should detect invalid hit points (negative current)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        hitPoints: { current: -5, maximum: 50, temporary: 0 },
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('hit points'))).toBe(true);
    });

    it('should detect invalid hit points (current > maximum)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        hitPoints: { current: 60, maximum: 50, temporary: 0 },
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('hit points'))).toBe(true);
    });

    it('should detect invalid armor class (too low)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        armorClass: 5, // Unreasonably low
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('armor class'))).toBe(true);
    });

    it('should detect invalid proficiency bonus', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 5,
        proficiencyBonus: 5, // Should be +3 for level 5
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('proficiency'))).toBe(true);
    });

    it('should detect missing required fields', () => {
      const incompleteCharacter = {
        name: 'Incomplete Character',
        // Missing most required fields
      } as any as DNDCharacter;

      const result = validateCharacter(incompleteCharacter);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid character name (empty)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        name: '', // Empty name
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('name'))).toBe(true);
    });

    it('should detect invalid experience points (negative)', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        experiencePoints: -100,
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('experience'))).toBe(true);
    });
  });

  describe('Character Warnings', () => {
    it('should warn about unusual ability score distributions', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        abilityScores: createTestAbilityScores(8, 8, 8, 18, 18, 18), // Unusual distribution
      });

      const result = validateCharacter(character);
      // Might still be valid but should generate warnings
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about low hit points for level', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 10,
        hitPoints: { current: 15, maximum: 15, temporary: 0 }, // Very low for level 10
      });

      const result = validateCharacter(character);
      expect(result.warnings.some(warning => warning.includes('hit points'))).toBe(true);
    });

    it('should warn about mismatched class and ability scores', () => {
      const character = createCompleteCharacter({
        ...testWizard, // Wizard with low intelligence
        abilityScores: createTestAbilityScores(16, 14, 15, 8, 12, 10), // STR-based wizard
      });

      const result = validateCharacter(character);
      expect(result.warnings.some(warning => 
        warning.includes('intelligence') || warning.includes('spellcasting')
      )).toBe(true);
    });

    it('should warn about negative temporary hit points', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        hitPoints: { current: 30, maximum: 50, temporary: -5 }, // Negative temp HP
      });

      const result = validateCharacter(character);
      expect(result.warnings.some(warning => warning.includes('temporary'))).toBe(true);
    });
  });

  describe('Skill and Saving Throw Validation', () => {
    it('should validate skill modifiers', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        skills: [
          { 
            name: 'Athletics', 
            ability: 'strength', 
            proficient: true, 
            modifier: 6 // STR +3 + Prof +3 = +6 for level 5
          },
          {
            name: 'Stealth',
            ability: 'dexterity',
            proficient: false,
            modifier: 2 // DEX +2 only
          }
        ]
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(true);
    });

    it('should detect incorrect skill modifiers', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        skills: [
          { 
            name: 'Athletics', 
            ability: 'strength', 
            proficient: true, 
            modifier: 10 // Way too high
          }
        ]
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('skill'))).toBe(true);
    });

    it('should validate saving throw modifiers', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        savingThrows: [
          { ability: 'strength', proficient: true, modifier: 6 }, // STR +3 + Prof +3
          { ability: 'dexterity', proficient: false, modifier: 2 }, // DEX +2 only
        ]
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(true);
    });

    it('should detect incorrect saving throw modifiers', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        savingThrows: [
          { ability: 'strength', proficient: true, modifier: 15 }, // Way too high
        ]
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('saving throw'))).toBe(true);
    });
  });

  describe('Equipment and Inventory Validation', () => {
    it('should validate inventory weight limits', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        abilityScores: createTestAbilityScores(16, 14, 15, 12, 13, 10), // 16 STR = 240 lbs capacity
        inventory: {
          items: [
            // Add items that would exceed weight limit
            {
              id: 'heavy-item-1',
              item: { id: 'heavy-item', name: 'Heavy Item', type: 'other', weight: 300, cost: 0, description: 'Very heavy' },
              quantity: 1,
              equipped: false
            }
          ],
          currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
          maxWeight: 240,
          currentWeight: 300
        }
      });

      const result = validateCharacter(character);
      expect(result.warnings.some(warning => warning.includes('weight'))).toBe(true);
    });

    it('should validate equipped item consistency', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        inventory: {
          items: [
            {
              id: 'longsword-1',
              item: { id: 'longsword', name: 'Longsword', type: 'other', weight: 3, cost: 1500, description: 'A versatile sword' },
              quantity: 1,
              equipped: true
            }
          ],
          currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
          maxWeight: 240,
          currentWeight: 3
        }
      });

      const result = validateCharacter(character);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Validation Result Formatting', () => {
    it('should format valid character result', () => {
      const character = createCompleteCharacter(testFighter);
      const result = validateCharacter(character);
      const formatted = formatValidationResult(result);

      expect(formatted).toContain('valid');
      expect(formatted).toContain(character.name);
    });

    it('should format invalid character result with errors', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 25, // Invalid level
        hitPoints: { current: -5, maximum: 50, temporary: 0 }, // Invalid HP
      });

      const result = validateCharacter(character);
      const formatted = formatValidationResult(result);

      expect(formatted).toContain('invalid');
      expect(formatted).toContain('error');
      expect(formatted).toContain('level');
      expect(formatted).toContain('hit points');
    });

    it('should format character result with warnings', () => {
      const character = createCompleteCharacter({
        ...testWizard,
        abilityScores: createTestAbilityScores(16, 14, 15, 8, 12, 10), // Low INT for wizard
      });

      const result = validateCharacter(character);
      const formatted = formatValidationResult(result);

      if (result.warnings.length > 0) {
        expect(formatted).toContain('warning');
      }
    });

    it('should format results with multiple errors and warnings', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        name: '', // Error: empty name
        level: 25, // Error: invalid level
        abilityScores: createTestAbilityScores(8, 8, 8, 18, 18, 18), // Warning: unusual distribution
        hitPoints: { current: -5, maximum: 50, temporary: 0 }, // Error: negative HP
      });

      const result = validateCharacter(character);
      const formatted = formatValidationResult(result);

      expect(formatted).toContain('invalid');
      expect(result.errors.length).toBeGreaterThan(1);
      
      // Should list all errors
      result.errors.forEach(error => {
        expect(formatted).toContain(error);
      });
    });
  });

  describe('Edge Cases and Complex Validation', () => {
    it('should handle null or undefined character', () => {
      expect(() => validateCharacter(null as any)).not.toThrow();
      expect(() => validateCharacter(undefined as any)).not.toThrow();
      
      const nullResult = validateCharacter(null as any);
      const undefinedResult = validateCharacter(undefined as any);
      
      expect(nullResult.isValid).toBe(false);
      expect(undefinedResult.isValid).toBe(false);
    });

    it('should validate multiclass characters (if supported)', () => {
      // This is a placeholder for future multiclass support
      const multiclassCharacter = createCompleteCharacter({
        ...testFighter,
        class: { name: 'Fighter/Wizard', level: 5, hitDie: 10 }, // Hypothetical multiclass
      });

      const result = validateCharacter(multiclassCharacter);
      // For now, this might be invalid, but shouldn't crash
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should handle characters with custom/homebrew content', () => {
      const homebrewCharacter = createCompleteCharacter({
        ...testFighter,
        class: { name: 'Blood Hunter', level: 3, hitDie: 10 }, // Homebrew class
        race: { name: 'Dragonborn', size: 'Medium', speed: 30, traits: ['Custom Trait'] },
      });

      const result = validateCharacter(homebrewCharacter);
      // Should not crash, might have warnings about unknown content
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should validate very complex characters', () => {
      const complexCharacter = createCompleteCharacter({
        ...testFighter,
        level: 20,
        experiencePoints: 355000, // Max XP
        abilityScores: createTestAbilityScores(20, 20, 20, 20, 20, 20), // Legendary stats
        hitPoints: { current: 200, maximum: 200, temporary: 25 },
        armorClass: 25,
        equipment: Array(50).fill('Magic Item'), // Lots of equipment
        spells: Array(100).fill('Wish'), // Lots of spells
        features: Array(20).fill('Epic Feature'), // Many features
        languages: ['Common', 'Draconic', 'Celestial', 'Abyssal', 'Primordial'],
      });

      const result = validateCharacter(complexCharacter);
      expect(typeof result.isValid).toBe('boolean');
      // Should handle complexity without crashing
    });

    it('should provide helpful error messages', () => {
      const character = createCompleteCharacter({
        ...testFighter,
        level: 0,
        name: '',
        hitPoints: { current: -10, maximum: -5, temporary: -2 },
      });

      const result = validateCharacter(character);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Error messages should be descriptive
      result.errors.forEach(error => {
        expect(error.length).toBeGreaterThan(10); // Not just single words
        expect(error).toMatch(/[a-zA-Z]/); // Contains actual text
      });
    });
  });
});