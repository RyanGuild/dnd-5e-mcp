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
} from '../src/utils/dice.js';

// Mock Math.random for predictable testing
const mockRandom = (values: number[]) => {
  let index = 0;
  jest.spyOn(Math, 'random').mockImplementation(() => {
    const value = values[index % values.length];
    index++;
    return value;
  });
};

const restoreRandom = () => {
  (Math.random as jest.Mock).mockRestore();
};

describe('Dice Rolling Mechanics', () => {
  afterEach(() => {
    restoreRandom();
  });

  describe('rollDice', () => {
    it('should roll dice correctly with no modifier', () => {
      mockRandom([0.5]); // Will roll 11 on d20 (0.5 * 20 + 1 = 11)
      const result = rollDice(1, 20, 0);

      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(11);
      expect(result.natural20).toBe(false);
      expect(result.natural1).toBe(false);
    });

    it('should roll multiple dice', () => {
      mockRandom([0.5, 0.25, 0.75]); // Will roll 3, 2, 4 on d4
      const result = rollDice(3, 4, 0);

      expect(result.rolls).toEqual([3, 2, 4]);
      expect(result.total).toBe(9);
    });

    it('should add modifier correctly', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollDice(1, 20, 5);

      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(16); // 11 + 5
    });

    it('should detect natural 20', () => {
      mockRandom([0.95]); // Will roll 20 on d20
      const result = rollDice(1, 20, 0);

      expect(result.rolls).toEqual([20]);
      expect(result.total).toBe(20);
      expect(result.natural20).toBe(true);
      expect(result.natural1).toBe(false);
    });

    it('should detect natural 1', () => {
      mockRandom([0.0]); // Will roll 1 on d20
      const result = rollDice(1, 20, 0);

      expect(result.rolls).toEqual([1]);
      expect(result.total).toBe(1);
      expect(result.natural20).toBe(false);
      expect(result.natural1).toBe(true);
    });

    it('should handle negative modifiers', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollDice(1, 20, -3);

      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(8); // 11 - 3
    });

    it('should handle different die sizes', () => {
      const dieSizes = [4, 6, 8, 10, 12, 20];
      
      dieSizes.forEach(sides => {
        mockRandom([0.5]); // Middle value
        const result = rollDice(1, sides, 0);
        
        expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
        expect(result.rolls[0]).toBeLessThanOrEqual(sides);
        restoreRandom();
      });
    });
  });

  describe('rollWithAdvantage', () => {
    it('should roll twice and take the higher value', () => {
      mockRandom([0.25, 0.75]); // Will roll 6 and 16 on d20
      const result = rollWithAdvantage(1, 20, 2);

      expect(result.rolls).toEqual([6, 16]);
      expect(result.total).toBe(18); // 16 + 2 (takes higher roll)
    });

    it('should detect natural 20 with advantage', () => {
      mockRandom([0.5, 0.95]); // Will roll 11 and 20 on d20
      const result = rollWithAdvantage(1, 20, 0);

      expect(result.rolls).toEqual([11, 20]);
      expect(result.total).toBe(20);
      expect(result.natural20).toBe(true);
    });

    it('should handle multiple dice with advantage', () => {
      mockRandom([0.25, 0.75, 0.5, 0.9]); // Two sets of rolls
      const result = rollWithAdvantage(2, 6, 1);

      expect(result.rolls).toHaveLength(4); // 2 dice * 2 rolls each
      expect(result.total).toBeGreaterThan(2); // Should be sum of higher rolls + modifier
    });
  });

  describe('rollWithDisadvantage', () => {
    it('should roll twice and take the lower value', () => {
      mockRandom([0.25, 0.75]); // Will roll 6 and 16 on d20
      const result = rollWithDisadvantage(1, 20, 2);

      expect(result.rolls).toEqual([6, 16]);
      expect(result.total).toBe(8); // 6 + 2 (takes lower roll)
    });

    it('should detect natural 1 with disadvantage', () => {
      mockRandom([0.0, 0.5]); // Will roll 1 and 11 on d20
      const result = rollWithDisadvantage(1, 20, 0);

      expect(result.rolls).toEqual([1, 11]);
      expect(result.total).toBe(1);
      expect(result.natural1).toBe(true);
    });
  });

  describe('rollAbilityCheck', () => {
    it('should roll ability check without proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollAbilityCheck(14, 3, false); // 14 ability score, +3 prof, not proficient

      const expectedModifier = Math.floor((14 - 10) / 2); // +2 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(13); // 11 + 2 (no proficiency bonus)
    });

    it('should roll ability check with proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollAbilityCheck(16, 2, true); // 16 ability score, +2 prof, proficient

      const expectedModifier = Math.floor((16 - 10) / 2); // +3 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(16); // 11 + 3 + 2
    });

    it('should handle low ability scores', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollAbilityCheck(8, 2, false); // 8 ability score (-1 modifier)

      expect(result.total).toBe(10); // 11 - 1
    });
  });

  describe('rollSavingThrow', () => {
    it('should roll saving throw without proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollSavingThrow(12, 3, false); // 12 ability score, +3 prof, not proficient

      const expectedModifier = Math.floor((12 - 10) / 2); // +1 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(12); // 11 + 1
    });

    it('should roll saving throw with proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollSavingThrow(16, 4, true); // 16 ability score, +4 prof, proficient

      const expectedModifier = Math.floor((16 - 10) / 2); // +3 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(18); // 11 + 3 + 4
    });
  });

  describe('rollSkillCheck', () => {
    it('should roll skill check without proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollSkillCheck(15, 2, false); // 15 ability score, +2 prof, not proficient

      const expectedModifier = Math.floor((15 - 10) / 2); // +2 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(13); // 11 + 2
    });

    it('should roll skill check with proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollSkillCheck(18, 5, true); // 18 ability score, +5 prof, proficient

      const expectedModifier = Math.floor((18 - 10) / 2); // +4 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(20); // 11 + 4 + 5
    });
  });

  describe('rollAttack', () => {
    it('should roll attack without proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollAttack(16, 3, false); // 16 ability score, +3 prof, not proficient

      const expectedModifier = Math.floor((16 - 10) / 2); // +3 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(14); // 11 + 3
    });

    it('should roll attack with proficiency', () => {
      mockRandom([0.5]); // Will roll 11 on d20
      const result = rollAttack(14, 2, true); // 14 ability score, +2 prof, proficient

      const expectedModifier = Math.floor((14 - 10) / 2); // +2 ability modifier
      expect(result.rolls).toEqual([11]);
      expect(result.total).toBe(15); // 11 + 2 + 2
    });

    it('should roll attack with advantage', () => {
      mockRandom([0.25, 0.75]); // Will roll 6 and 16 on d20
      const result = rollAttack(16, 3, true, true, false); // With advantage

      expect(result.rolls).toEqual([6, 16]);
      expect(result.total).toBe(22); // 16 + 3 + 3 (takes higher roll)
    });

    it('should roll attack with disadvantage', () => {
      mockRandom([0.25, 0.75]); // Will roll 6 and 16 on d20
      const result = rollAttack(16, 3, true, false, true); // With disadvantage

      expect(result.rolls).toEqual([6, 16]);
      expect(result.total).toBe(12); // 6 + 3 + 3 (takes lower roll)
    });

    it('should detect critical hit (natural 20)', () => {
      mockRandom([0.95]); // Will roll 20 on d20
      const result = rollAttack(16, 3, true);

      expect(result.natural20).toBe(true);
      expect(result.total).toBe(26); // 20 + 3 + 3
    });

    it('should detect critical miss (natural 1)', () => {
      mockRandom([0.0]); // Will roll 1 on d20
      const result = rollAttack(16, 3, true);

      expect(result.natural1).toBe(true);
      expect(result.total).toBe(7); // 1 + 3 + 3
    });
  });

  describe('rollDamage', () => {
    it('should roll damage dice correctly', () => {
      mockRandom([0.5, 0.75]); // Will roll 4 and 5 on d8
      const result = rollDamage(2, 8, 3); // 2d8 + 3

      expect(result.rolls).toEqual([4, 5]);
      expect(result.total).toBe(12); // 4 + 5 + 3
    });

    it('should handle single damage die', () => {
      mockRandom([0.25]); // Will roll 2 on d6
      const result = rollDamage(1, 6, 2); // 1d6 + 2

      expect(result.rolls).toEqual([2]);
      expect(result.total).toBe(4); // 2 + 2
    });

    it('should handle no modifier', () => {
      mockRandom([0.9]); // Will roll 6 on d6
      const result = rollDamage(1, 6, 0); // 1d6

      expect(result.rolls).toEqual([6]);
      expect(result.total).toBe(6);
    });

    it('should handle negative modifier', () => {
      mockRandom([0.5]); // Will roll 6 on d10
      const result = rollDamage(1, 10, -2); // 1d10 - 2

      expect(result.rolls).toEqual([6]);
      expect(result.total).toBe(4); // 6 - 2
    });
  });

  describe('rollHitDie', () => {
    it('should roll hit die with constitution modifier', () => {
      mockRandom([0.5]); // Will roll 5 on d8
      const result = rollHitDie(8, 2); // d8 + 2

      expect(result.rolls).toEqual([5]);
      expect(result.total).toBe(7); // 5 + 2
    });

    it('should handle different hit die sizes', () => {
      const hitDieSizes = [6, 8, 10, 12]; // Common hit die sizes
      
      hitDieSizes.forEach(hitDie => {
        mockRandom([0.5]);
        const result = rollHitDie(hitDie, 1);
        
        expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
        expect(result.rolls[0]).toBeLessThanOrEqual(hitDie);
        expect(result.total).toBe(result.rolls[0] + 1); // Roll + CON modifier
        restoreRandom();
      });
    });

    it('should handle negative constitution modifier', () => {
      mockRandom([0.5]); // Will roll 5 on d8
      const result = rollHitDie(8, -1); // d8 - 1

      expect(result.rolls).toEqual([5]);
      expect(result.total).toBe(4); // 5 - 1
    });

    it('should ensure minimum 1 HP gain', () => {
      mockRandom([0.0]); // Will roll 1 on d6
      const result = rollHitDie(6, -2); // d6 - 2, would be -1

      expect(result.rolls).toEqual([1]);
      expect(result.total).toBe(1); // Should be at least 1
    });
  });

  describe('Edge Cases and Random Behavior', () => {
    beforeEach(() => {
      restoreRandom(); // Use real random for these tests
    });

    it('should produce different results on multiple calls', () => {
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(rollDice(1, 20, 0).total);
      }
      
      // With real randomness, we should get some variety
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it('should handle zero dice', () => {
      const result = rollDice(0, 20, 5);
      expect(result.rolls).toEqual([]);
      expect(result.total).toBe(5); // Just the modifier
    });

    it('should handle zero-sided dice gracefully', () => {
      expect(() => rollDice(1, 0, 0)).not.toThrow();
    });

    it('should handle very large numbers of dice', () => {
      const result = rollDice(100, 6, 0);
      expect(result.rolls).toHaveLength(100);
      expect(result.total).toBeGreaterThanOrEqual(100); // At least 1 per die
      expect(result.total).toBeLessThanOrEqual(600); // At most 6 per die
    });
  });

  describe('Statistical Properties', () => {
    beforeEach(() => {
      restoreRandom(); // Use real random for statistical tests
    });

    it('should have reasonable distribution for d20 rolls', () => {
      const results: number[] = [];
      const numRolls = 1000;
      
      for (let i = 0; i < numRolls; i++) {
        results.push(rollDice(1, 20, 0).rolls[0]);
      }
      
      // Check that we get values across the full range
      const min = Math.min(...results);
      const max = Math.max(...results);
      
      expect(min).toBe(1);
      expect(max).toBe(20);
      
      // Check that the average is close to expected (10.5 for d20)
      const average = results.reduce((sum, val) => sum + val, 0) / results.length;
      expect(average).toBeGreaterThan(9);
      expect(average).toBeLessThan(12);
    });

    it('should show advantage bias toward higher rolls', () => {
      const normalRolls: number[] = [];
      const advantageRolls: number[] = [];
      const numRolls = 500;
      
      for (let i = 0; i < numRolls; i++) {
        normalRolls.push(rollDice(1, 20, 0).total);
        advantageRolls.push(rollWithAdvantage(1, 20, 0).total);
      }
      
      const normalAverage = normalRolls.reduce((sum, val) => sum + val, 0) / normalRolls.length;
      const advantageAverage = advantageRolls.reduce((sum, val) => sum + val, 0) / advantageRolls.length;
      
      // Advantage should result in higher average rolls
      expect(advantageAverage).toBeGreaterThan(normalAverage);
    });

    it('should show disadvantage bias toward lower rolls', () => {
      const normalRolls: number[] = [];
      const disadvantageRolls: number[] = [];
      const numRolls = 500;
      
      for (let i = 0; i < numRolls; i++) {
        normalRolls.push(rollDice(1, 20, 0).total);
        disadvantageRolls.push(rollWithDisadvantage(1, 20, 0).total);
      }
      
      const normalAverage = normalRolls.reduce((sum, val) => sum + val, 0) / normalRolls.length;
      const disadvantageAverage = disadvantageRolls.reduce((sum, val) => sum + val, 0) / disadvantageRolls.length;
      
      // Disadvantage should result in lower average rolls
      expect(disadvantageAverage).toBeLessThan(normalAverage);
    });
  });
});