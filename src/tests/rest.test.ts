import { DNDCharacter } from '../types/character';
import { 
  RestManager, 
  EXHAUSTION_EFFECTS, 
  getEffectiveMaxHitPoints, 
  getEffectiveSpeed,
  hasAbilityCheckDisadvantage,
  hasAttackAndSaveDisadvantage 
} from '../utils/rest';
import { createCharacter } from '../utils/character';

// Mock character for testing
function createTestCharacter(): DNDCharacter {
  return createCharacter({
    name: 'Test Character',
    class: { name: 'Fighter', level: 5, hitDie: 10 },
    race: { name: 'Human', size: 'Medium', speed: 30, traits: [] },
    level: 5,
    abilityScores: {
      strength: { value: 16, modifier: 3 },
      dexterity: { value: 14, modifier: 2 },
      constitution: { value: 15, modifier: 2 },
      intelligence: { value: 10, modifier: 0 },
      wisdom: { value: 12, modifier: 1 },
      charisma: { value: 8, modifier: -1 }
    }
  });
}

describe('RestManager', () => {
  let character: DNDCharacter;
  let restManager: RestManager;

  beforeEach(() => {
    character = createTestCharacter();
    restManager = new RestManager(character);
  });

  describe('Short Rest', () => {
    test('should allow short rest without spending hit dice', () => {
      const result = restManager.shortRest(0);
      expect(result.success).toBe(true);
      expect(result.hitPointsRestored).toBe(0);
      expect(result.hitDiceSpent).toBe(0);
    });

    test('should spend hit dice to restore hit points', () => {
      // Damage the character first
      character.hitPoints.current = 20;
      const hitDiceToSpend = 2;
      
      const result = restManager.shortRest(hitDiceToSpend);
      
      expect(result.success).toBe(true);
      expect(result.hitDiceSpent).toBe(hitDiceToSpend);
      expect(result.hitPointsRestored).toBeGreaterThan(0);
      expect(character.hitDice.current).toBe(character.level - hitDiceToSpend);
    });

    test('should not allow spending more hit dice than available', () => {
      const result = restManager.shortRest(character.hitDice.current + 1);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0]).toContain('Cannot spend');
    });

    test('should recover Fighter features on short rest', () => {
      const result = restManager.shortRest(0);
      
      expect(result.featuresRestored).toContain('Second Wind');
      expect(result.featuresRestored).toContain('Action Surge');
    });

    test('should not allow short rest when exhausted to level 5', () => {
      character.exhaustionLevel = 5;
      
      const canRest = restManager.canTakeShortRest();
      expect(canRest.canRest).toBe(false);
      expect(canRest.reason).toBe("Character's speed is reduced to 0");
    });

    test('should not allow short rest when dead', () => {
      character.exhaustionLevel = 6;
      
      const canRest = restManager.canTakeShortRest();
      expect(canRest.canRest).toBe(false);
      expect(canRest.reason).toBe("Character is dead");
    });
  });

  describe('Long Rest', () => {
    test('should restore all hit points', () => {
      character.hitPoints.current = 20;
      const maxHP = character.hitPoints.maximum;
      
      const result = restManager.longRest();
      
      expect(result.success).toBe(true);
      expect(character.hitPoints.current).toBe(maxHP);
      expect(result.hitPointsRestored).toBe(maxHP - 20);
    });

    test('should restore half of maximum hit dice', () => {
      character.hitDice.current = 1;
      const maxHitDice = character.hitDice.maximum;
      
      const result = restManager.longRest();
      
      expect(result.success).toBe(true);
      const expectedRestore = Math.max(1, Math.floor(maxHitDice / 2));
      expect(character.hitDice.current).toBe(1 + expectedRestore);
    });

    test('should reduce exhaustion by 1 level', () => {
      character.exhaustionLevel = 3;
      
      const result = restManager.longRest();
      
      expect(result.success).toBe(true);
      expect(character.exhaustionLevel).toBe(2);
      expect(result.exhaustionReduced).toBe(true);
    });

    test('should not reduce exhaustion below 0', () => {
      character.exhaustionLevel = 0;
      
      const result = restManager.longRest();
      
      expect(result.success).toBe(true);
      expect(character.exhaustionLevel).toBe(0);
      expect(result.exhaustionReduced).toBe(false);
    });

    test('should not allow long rest when dead', () => {
      character.exhaustionLevel = 6;
      
      const result = restManager.longRest();
      
      expect(result.success).toBe(false);
      expect(result.errors![0]).toBe("Character is dead");
    });
  });

  describe('Exhaustion Management', () => {
    test('should add exhaustion levels', () => {
      const result = restManager.addExhaustion(2);
      
      expect(character.exhaustionLevel).toBe(2);
      expect(result.newLevel).toBe(2);
      expect(result.effects).toEqual(EXHAUSTION_EFFECTS[2].effects);
    });

    test('should not exceed maximum exhaustion level', () => {
      character.exhaustionLevel = 5;
      const result = restManager.addExhaustion(3);
      
      expect(character.exhaustionLevel).toBe(6);
      expect(result.newLevel).toBe(6);
    });

    test('should remove exhaustion levels', () => {
      character.exhaustionLevel = 4;
      const result = restManager.removeExhaustion(2);
      
      expect(character.exhaustionLevel).toBe(2);
      expect(result.newLevel).toBe(2);
    });

    test('should not go below 0 exhaustion', () => {
      character.exhaustionLevel = 1;
      const result = restManager.removeExhaustion(3);
      
      expect(character.exhaustionLevel).toBe(0);
      expect(result.newLevel).toBe(0);
    });

    test('should return correct exhaustion effects', () => {
      character.exhaustionLevel = 3;
      const effects = restManager.getExhaustionEffects();
      
      expect(effects).toEqual(EXHAUSTION_EFFECTS[3]);
      expect(effects.effects).toContain('Disadvantage on ability checks');
      expect(effects.effects).toContain('Speed halved');
      expect(effects.effects).toContain('Disadvantage on attack rolls and saving throws');
    });
  });

  describe('Class-Specific Recovery', () => {
    test('should recover Warlock spell slots on short rest', () => {
      character.class.name = 'Warlock';
      restManager = new RestManager(character);
      
      const result = restManager.shortRest(0);
      
      expect(result.featuresRestored).toContain('All spell slots');
    });

    test('should recover Monk ki points on short rest', () => {
      character.class.name = 'Monk';
      restManager = new RestManager(character);
      
      const result = restManager.shortRest(0);
      
      expect(result.featuresRestored).toContain('Ki points');
    });

    test('should recover Wizard features on long rest', () => {
      character.class.name = 'Wizard';
      restManager = new RestManager(character);
      
      const result = restManager.longRest();
      
      expect(result.featuresRestored).toContain('Arcane Recovery');
      expect(result.spellSlotsRestored).toContain('All spell slots');
    });
  });

  describe('Hit Dice Status', () => {
    test('should return available hit dice information', () => {
      const hitDiceInfo = restManager.getAvailableHitDice();
      
      expect(hitDiceInfo.current).toBe(character.level);
      expect(hitDiceInfo.maximum).toBe(character.level);
      expect(hitDiceInfo.size).toBe(character.class.hitDie);
    });
  });
});

describe('Exhaustion Effects', () => {
  let character: DNDCharacter;

  beforeEach(() => {
    character = createTestCharacter();
  });

  describe('Effective Hit Points', () => {
    test('should return normal max HP with no exhaustion', () => {
      character.exhaustionLevel = 0;
      expect(getEffectiveMaxHitPoints(character)).toBe(character.hitPoints.maximum);
    });

    test('should return normal max HP with exhaustion levels 1-3', () => {
      character.exhaustionLevel = 3;
      expect(getEffectiveMaxHitPoints(character)).toBe(character.hitPoints.maximum);
    });

    test('should return half max HP with exhaustion level 4+', () => {
      character.exhaustionLevel = 4;
      const expectedHP = Math.floor(character.hitPoints.maximum / 2);
      expect(getEffectiveMaxHitPoints(character)).toBe(expectedHP);
    });
  });

  describe('Effective Speed', () => {
    test('should return normal speed with no exhaustion', () => {
      character.exhaustionLevel = 0;
      expect(getEffectiveSpeed(character)).toBe(character.speed);
    });

    test('should return normal speed with exhaustion level 1', () => {
      character.exhaustionLevel = 1;
      expect(getEffectiveSpeed(character)).toBe(character.speed);
    });

    test('should return half speed with exhaustion levels 2-4', () => {
      character.exhaustionLevel = 3;
      const expectedSpeed = Math.floor(character.speed / 2);
      expect(getEffectiveSpeed(character)).toBe(expectedSpeed);
    });

    test('should return 0 speed with exhaustion level 5+', () => {
      character.exhaustionLevel = 5;
      expect(getEffectiveSpeed(character)).toBe(0);
    });
  });

  describe('Disadvantage Checks', () => {
    test('should have no disadvantage with no exhaustion', () => {
      character.exhaustionLevel = 0;
      expect(hasAbilityCheckDisadvantage(character)).toBe(false);
      expect(hasAttackAndSaveDisadvantage(character)).toBe(false);
    });

    test('should have ability check disadvantage with exhaustion level 1+', () => {
      character.exhaustionLevel = 1;
      expect(hasAbilityCheckDisadvantage(character)).toBe(true);
      expect(hasAttackAndSaveDisadvantage(character)).toBe(false);
    });

    test('should have attack and save disadvantage with exhaustion level 3+', () => {
      character.exhaustionLevel = 3;
      expect(hasAbilityCheckDisadvantage(character)).toBe(true);
      expect(hasAttackAndSaveDisadvantage(character)).toBe(true);
    });
  });
});

describe('Exhaustion Effects Data', () => {
  test('should have correct exhaustion levels defined', () => {
    expect(EXHAUSTION_EFFECTS).toHaveLength(7); // Levels 0-6
    
    expect(EXHAUSTION_EFFECTS[0].level).toBe(0);
    expect(EXHAUSTION_EFFECTS[0].effects).toHaveLength(0);
    
    expect(EXHAUSTION_EFFECTS[1].level).toBe(1);
    expect(EXHAUSTION_EFFECTS[1].effects).toContain('Disadvantage on ability checks');
    
    expect(EXHAUSTION_EFFECTS[6].level).toBe(6);
    expect(EXHAUSTION_EFFECTS[6].effects).toContain('Death');
  });

  test('should have cumulative effects for higher levels', () => {
    // Level 3 should have all effects from levels 1, 2, and 3
    expect(EXHAUSTION_EFFECTS[3].effects).toContain('Disadvantage on ability checks');
    expect(EXHAUSTION_EFFECTS[3].effects).toContain('Speed halved');
    expect(EXHAUSTION_EFFECTS[3].effects).toContain('Disadvantage on attack rolls and saving throws');
  });
});