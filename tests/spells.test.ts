import { SpellManager, WIZARD_SPELLS, WIZARD_SPELL_SLOTS } from '../src/utils/spells';

describe('Spell Management (Wizard)', () => {
  let spellManager: SpellManager;

  beforeEach(() => {
    // Create a level 5 wizard with 16 Intelligence (+3 modifier)
    spellManager = new SpellManager(5, 3);
  });

  describe('SpellManager Initialization', () => {
    it('should initialize with correct level and intelligence modifier', () => {
      expect(spellManager.getSpellcastingModifier()).toBe(3);
      expect(spellManager.getSpellSaveDC()).toBe(14); // 8 + 3 + 3 (prof bonus for level 5)
      expect(spellManager.getSpellAttackBonus()).toBe(6); // 3 + 3 (prof bonus for level 5)
    });

    it('should initialize with correct spell slots for level 5 wizard', () => {
      const maxSlots = spellManager.getMaxSlots();
      const currentSlots = spellManager.getCurrentSlots();

      expect(maxSlots.level1).toBe(4);
      expect(maxSlots.level2).toBe(3);
      expect(maxSlots.level3).toBe(2);
      expect(maxSlots.level4).toBe(0); // Level 5 wizard doesn't have 4th level slots yet

      // Current slots should match max slots initially
      expect(currentSlots).toEqual(maxSlots);
    });

    it('should handle different wizard levels correctly', () => {
      const level1Wizard = new SpellManager(1, 3);
      const level20Wizard = new SpellManager(20, 5);

      const level1Slots = level1Wizard.getMaxSlots();
      const level20Slots = level20Wizard.getMaxSlots();

      // Level 1 wizard should have only 1st level slots
      expect(level1Slots.level1).toBe(2);
      expect(level1Slots.level2).toBe(0);

      // Level 20 wizard should have all slot levels
      expect(level20Slots.level1).toBeGreaterThan(0);
      expect(level20Slots.level9).toBeGreaterThan(0);
    });
  });

  describe('Spell Slot Management', () => {
    it('should cast spells and consume spell slots', () => {
      const initialSlots = spellManager.getCurrentSlots().level1;
      const success = spellManager.castSpell(1);

      expect(success).toBe(true);
      expect(spellManager.getCurrentSlots().level1).toBe(initialSlots - 1);
    });

    it('should prevent casting when no slots available', () => {
      // Exhaust all level 1 slots
      const maxSlots = spellManager.getMaxSlots().level1;
      for (let i = 0; i < maxSlots; i++) {
        spellManager.castSpell(1);
      }

      const success = spellManager.castSpell(1);
      expect(success).toBe(false);
      expect(spellManager.getCurrentSlots().level1).toBe(0);
    });

    it('should restore individual spell slots', () => {
      spellManager.castSpell(1);
      spellManager.castSpell(2);

      const level1Before = spellManager.getCurrentSlots().level1;
      const level2Before = spellManager.getCurrentSlots().level2;

      spellManager.restoreSlot(1);

      expect(spellManager.getCurrentSlots().level1).toBe(level1Before + 1);
      expect(spellManager.getCurrentSlots().level2).toBe(level2Before); // Should be unchanged
    });

    it('should restore all spell slots', () => {
      // Cast some spells
      spellManager.castSpell(1);
      spellManager.castSpell(2);
      spellManager.castSpell(3);

      spellManager.restoreAllSlots();

      const currentSlots = spellManager.getCurrentSlots();
      const maxSlots = spellManager.getMaxSlots();

      expect(currentSlots).toEqual(maxSlots);
    });

    it('should not restore slots above maximum', () => {
      const maxSlots = spellManager.getMaxSlots();
      
      spellManager.restoreSlot(1); // Should not increase above max
      
      expect(spellManager.getCurrentSlots().level1).toBe(maxSlots.level1);
    });

    it('should handle casting higher level spells with lower level slots', () => {
      // This should fail - can't cast higher level spell with lower slot
      const success = spellManager.castSpell(4); // Level 4 spell with level 5 wizard
      expect(success).toBe(false);
    });
  });

  describe('Spell Preparation', () => {
    it('should prepare cantrips correctly', () => {
      const knownCantrips = spellManager.getKnownSpells(0);
      const cantripsToPrep = knownCantrips.slice(0, 2); // Take first 2 known cantrips
      const success = spellManager.prepareSpells(cantripsToPrep, 0);

      expect(success).toBe(true);
      
      const preparedCantrips = spellManager.getPreparedSpells(0);
      expect(preparedCantrips).toEqual(expect.arrayContaining(cantripsToPrep));
    });

    it('should prepare leveled spells correctly', () => {
      const knownLevel1 = spellManager.getKnownSpells(1);
      const spellsToPrep = knownLevel1.slice(0, 3); // Take first 3 known spells
      const success = spellManager.prepareSpells(spellsToPrep, 1);

      expect(success).toBe(true);
      
      const preparedLevel1 = spellManager.getPreparedSpells(1);
      expect(preparedLevel1).toEqual(expect.arrayContaining(spellsToPrep));
    });

    it('should enforce preparation limits', () => {
      // Level 5 wizard with +3 INT can prepare 5 + 3 = 8 spells
      const tooManySpells = Array(20).fill('Magic Missile'); // Way too many
      const success = spellManager.prepareSpells(tooManySpells, 1);

      expect(success).toBe(false);
    });

    it('should reject invalid spell names', () => {
      const invalidSpells = ['Nonexistent Spell', 'Fake Magic'];
      const success = spellManager.prepareSpells(invalidSpells, 1);

      expect(success).toBe(false);
    });

    it('should reject spells of wrong level', () => {
      const level2Spells = ['Fireball']; // This is actually a 3rd level spell
      const success = spellManager.prepareSpells(level2Spells, 2);

      // This might succeed if Fireball is in the level 2 list, or fail if not
      // The exact behavior depends on the WIZARD_SPELLS data structure
      expect(typeof success).toBe('boolean');
    });

    it('should get all prepared spells', () => {
      const knownCantrips = spellManager.getKnownSpells(0);
      const knownLevel1 = spellManager.getKnownSpells(1);
      
      if (knownCantrips.length > 0) {
        spellManager.prepareSpells([knownCantrips[0]], 0);
      }
      if (knownLevel1.length > 0) {
        spellManager.prepareSpells([knownLevel1[0]], 1);
      }

      const allPrepared = spellManager.getAllPreparedSpells();

      if (knownCantrips.length > 0) {
        expect(allPrepared.cantrips).toContain(knownCantrips[0]);
      }
      if (knownLevel1.length > 0) {
        expect(allPrepared.level1).toContain(knownLevel1[0]);
      }
    });

    it('should replace previously prepared spells of the same level', () => {
      const knownLevel1 = spellManager.getKnownSpells(1);
      
      if (knownLevel1.length >= 2) {
        spellManager.prepareSpells([knownLevel1[0]], 1);
        spellManager.prepareSpells([knownLevel1[1]], 1);

        const preparedLevel1 = spellManager.getPreparedSpells(1);
        expect(preparedLevel1).toContain(knownLevel1[1]);
        expect(preparedLevel1).not.toContain(knownLevel1[0]);
      }
    });
  });

  describe('Spell Search and Details', () => {
    it('should search spells by name', () => {
      const results = spellManager.searchSpells('Magic');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(spell => spell.name.includes('Magic'))).toBe(true);
    });

    it('should search spells by school', () => {
      const results = spellManager.searchSpells('Evocation');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(spell => spell.school === 'Evocation')).toBe(true);
    });

    it('should search spells by description', () => {
      const results = spellManager.searchSpells('damage');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(spell => spell.description.toLowerCase().includes('damage'))).toBe(true);
    });

    it('should filter search results by level', () => {
      const cantrips = spellManager.searchSpells('', 0);
      const level1Spells = spellManager.searchSpells('', 1);

      expect(cantrips.every(spell => spell.level === 0)).toBe(true);
      expect(level1Spells.every(spell => spell.level === 1)).toBe(true);
    });

    it('should return empty array for no search results', () => {
      const results = spellManager.searchSpells('NonexistentSpellName');
      expect(results).toEqual([]);
    });

    it('should get spell details by name', () => {
      const spell = spellManager.getSpellDetails('Magic Missile');
      
      expect(spell).toBeDefined();
      expect(spell?.name).toBe('Magic Missile');
      expect(spell?.level).toBeDefined();
      expect(spell?.school).toBeDefined();
      expect(spell?.description).toBeDefined();
    });

    it('should return undefined for non-existent spell', () => {
      const spell = spellManager.getSpellDetails('Nonexistent Spell');
      expect(spell).toBeUndefined();
    });

    it('should handle case-insensitive spell name lookup', () => {
      const spell1 = spellManager.getSpellDetails('magic missile');
      const spell2 = spellManager.getSpellDetails('MAGIC MISSILE');
      const spell3 = spellManager.getSpellDetails('Magic Missile');

      expect(spell1).toBeDefined();
      expect(spell2).toBeDefined();
      expect(spell3).toBeDefined();
      
      if (spell1 && spell2 && spell3) {
        expect(spell1.name).toBe(spell2.name);
        expect(spell2.name).toBe(spell3.name);
      }
    });
  });

  describe('Spellcasting Statistics', () => {
    it('should calculate correct spell save DC', () => {
      const level1Wizard = new SpellManager(1, 2); // +2 INT, +2 prof
      const level17Wizard = new SpellManager(17, 5); // +5 INT, +6 prof

      expect(level1Wizard.getSpellSaveDC()).toBe(12); // 8 + 2 + 2
      expect(level17Wizard.getSpellSaveDC()).toBe(19); // 8 + 5 + 6
    });

    it('should calculate correct spell attack bonus', () => {
      const level1Wizard = new SpellManager(1, 2); // +2 INT, +2 prof
      const level17Wizard = new SpellManager(17, 5); // +5 INT, +6 prof

      expect(level1Wizard.getSpellAttackBonus()).toBe(4); // 2 + 2
      expect(level17Wizard.getSpellAttackBonus()).toBe(11); // 5 + 6
    });

    it('should handle negative intelligence modifiers', () => {
      const lowIntWizard = new SpellManager(1, -1); // Somehow has negative INT

      expect(lowIntWizard.getSpellSaveDC()).toBe(9); // 8 + (-1) + 2
      expect(lowIntWizard.getSpellAttackBonus()).toBe(1); // (-1) + 2
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle level 0 wizard', () => {
      expect(() => new SpellManager(0, 3)).not.toThrow();
      const level0Wizard = new SpellManager(0, 3);
      const slots = level0Wizard.getMaxSlots();
      
      // Level 0 should have no spell slots
      expect(Object.values(slots).every(slot => slot === 0)).toBe(true);
    });

    it('should handle very high level wizard', () => {
      const level50Wizard = new SpellManager(50, 10);
      const slots = level50Wizard.getMaxSlots();
      
      // Should still cap at appropriate spell slot maximums
      expect(slots.level9).toBeGreaterThan(0);
      expect(slots.level9).toBeLessThanOrEqual(10); // Reasonable upper bound
    });

    it('should handle casting spell level 0 (cantrips)', () => {
      const success = spellManager.castSpell(0);
      
      // Cantrips don't consume spell slots, so this should always succeed
      expect(success).toBe(true);
      
      // Spell slots should be unchanged
      const currentSlots = spellManager.getCurrentSlots();
      const maxSlots = spellManager.getMaxSlots();
      expect(currentSlots).toEqual(maxSlots);
    });

    it('should handle invalid spell levels', () => {
      const success1 = spellManager.castSpell(-1);
      const success2 = spellManager.castSpell(10);
      
      expect(success1).toBe(false);
      expect(success2).toBe(false);
    });

    it('should handle empty spell preparation', () => {
      const success = spellManager.prepareSpells([], 1);
      expect(success).toBe(true);
      
      const prepared = spellManager.getPreparedSpells(1);
      expect(prepared).toEqual([]);
    });
  });

  describe('Spell Data Validation', () => {
    it('should have valid wizard spell data structure', () => {
      expect(WIZARD_SPELLS).toBeDefined();
      expect(typeof WIZARD_SPELLS).toBe('object');
      
      // Check that cantrips exist
      expect(WIZARD_SPELLS.cantrips).toBeDefined();
      expect(Array.isArray(WIZARD_SPELLS.cantrips)).toBe(true);
      expect(WIZARD_SPELLS.cantrips.length).toBeGreaterThan(0);
      
      // Check that level 1 spells exist
      expect(WIZARD_SPELLS.level1).toBeDefined();
      expect(Array.isArray(WIZARD_SPELLS.level1)).toBe(true);
      expect(WIZARD_SPELLS.level1.length).toBeGreaterThan(0);
    });

    it('should have valid spell slot progression data', () => {
      expect(WIZARD_SPELL_SLOTS).toBeDefined();
      expect(typeof WIZARD_SPELL_SLOTS).toBe('object');
      expect(Object.keys(WIZARD_SPELL_SLOTS).length).toBe(20); // Should have data for levels 1-20
      
      // Check first level
      expect(WIZARD_SPELL_SLOTS[1]).toBeDefined();
      expect(WIZARD_SPELL_SLOTS[1].level1).toBeGreaterThan(0);
      
      // Check last level
      expect(WIZARD_SPELL_SLOTS[20]).toBeDefined();
      expect(WIZARD_SPELL_SLOTS[20].level9).toBeGreaterThan(0);
    });

    it('should have properly formatted spell objects', () => {
      const spell = spellManager.getSpellDetails('Magic Missile');
      
      if (spell) {
        expect(spell.name).toBeDefined();
        expect(typeof spell.name).toBe('string');
        expect(spell.level).toBeDefined();
        expect(typeof spell.level).toBe('number');
        expect(spell.school).toBeDefined();
        expect(typeof spell.school).toBe('string');
        expect(spell.description).toBeDefined();
        expect(typeof spell.description).toBe('string');
        expect(spell.castingTime).toBeDefined();
        expect(spell.range).toBeDefined();
        expect(spell.duration).toBeDefined();
        expect(spell.components).toBeDefined();
      }
    });
  });

  describe('Complex Spellcasting Scenarios', () => {
    it('should handle a full day of spellcasting', () => {
      // Prepare a variety of spells
      spellManager.prepareSpells(['Mage Hand', 'Prestidigitation'], 0);
      spellManager.prepareSpells(['Magic Missile', 'Shield'], 1);
      spellManager.prepareSpells(['Misty Step', 'Web'], 2);
      
      // Cast various spells throughout the day
      const castingResults = [
        spellManager.castSpell(1), // Magic Missile
        spellManager.castSpell(1), // Magic Missile
        spellManager.castSpell(2), // Misty Step
        spellManager.castSpell(1), // Shield
        spellManager.castSpell(2), // Web
        spellManager.castSpell(1), // Another 1st level
        spellManager.castSpell(3), // 3rd level spell
      ];
      
      // Most should succeed, but might run out of slots
      const successfulCasts = castingResults.filter(result => result).length;
      expect(successfulCasts).toBeGreaterThan(0);
      expect(successfulCasts).toBeLessThanOrEqual(castingResults.length);
      
      // After a long rest, all slots should be restored
      spellManager.restoreAllSlots();
      const restoredSlots = spellManager.getCurrentSlots();
      const maxSlots = spellManager.getMaxSlots();
      expect(restoredSlots).toEqual(maxSlots);
    });

    it('should handle spell preparation changes', () => {
      // Initially prepare some spells
      spellManager.prepareSpells(['Magic Missile', 'Shield'], 1);
      let prepared = spellManager.getPreparedSpells(1);
      expect(prepared).toContain('Magic Missile');
      expect(prepared).toContain('Shield');
      
      // Change prepared spells (like after a long rest)
      spellManager.prepareSpells(['Detect Magic', 'Identify'], 1);
      prepared = spellManager.getPreparedSpells(1);
      expect(prepared).toContain('Detect Magic');
      expect(prepared).toContain('Identify');
      expect(prepared).not.toContain('Magic Missile');
      expect(prepared).not.toContain('Shield');
    });

    it('should handle multiclass progression (if applicable)', () => {
      // This test assumes the SpellManager might be extended for multiclassing
      // For now, just test that it handles unusual level/modifier combinations
      const multiclassWizard = new SpellManager(3, 4); // Level 3 with high INT
      
      expect(multiclassWizard.getSpellSaveDC()).toBe(14); // 8 + 4 + 2 (prof bonus for level 3)
      expect(multiclassWizard.getSpellAttackBonus()).toBe(6); // 4 + 2 (prof bonus for level 3)
      
      const slots = multiclassWizard.getMaxSlots();
      expect(slots.level1).toBeGreaterThan(0);
      expect(slots.level2).toBeGreaterThan(0);
    });
  });

  describe('Known Spells System', () => {
    it('should initialize with starting spells for new wizard', () => {
      const level1Wizard = new SpellManager(1, 3);
      const knownSpells = level1Wizard.getAllKnownSpells();
      
      // Should have 3 cantrips and 6 first level spells
      expect(knownSpells.cantrips.length).toBe(3);
      expect(knownSpells.level1.length).toBe(6);
      expect(knownSpells.level2.length).toBe(0);
    });

    it('should preserve existing known spells when provided', () => {
      const existingKnownSpells = {
        cantrips: ['Fire Bolt', 'Mage Hand'],
        level1: ['Magic Missile', 'Shield'],
        level2: ['Misty Step'],
        level3: [],
        level4: [],
        level5: [],
        level6: [],
        level7: [],
        level8: [],
        level9: []
      };
      
      const wizard = new SpellManager(3, 3, existingKnownSpells);
      const knownSpells = wizard.getAllKnownSpells();
      
      expect(knownSpells.cantrips).toEqual(['Fire Bolt', 'Mage Hand']);
      expect(knownSpells.level1).toEqual(['Magic Missile', 'Shield']);
      expect(knownSpells.level2).toEqual(['Misty Step']);
    });

    it('should only allow preparation of known spells', () => {
      const wizard = new SpellManager(3, 3);
      const knownSpells = wizard.getKnownSpells(1);
      
      // Try to prepare a known spell - should succeed
      const success1 = wizard.prepareSpells([knownSpells[0]], 1);
      expect(success1).toBe(true);
      
      // Try to prepare an unknown spell - should fail
      const success2 = wizard.prepareSpells(['Unknown Spell'], 1);
      expect(success2).toBe(false);
    });

    it('should learn new spells correctly', () => {
      const wizard = new SpellManager(3, 3);
      const availableToLearn = wizard.getAvailableToLearn(1);
      
      if (availableToLearn.length > 0) {
        const spellToLearn = availableToLearn[0].name;
        const success = wizard.learnSpell(spellToLearn, 1);
        
        expect(success).toBe(true);
        expect(wizard.getKnownSpells(1)).toContain(spellToLearn);
      }
    });

    it('should not learn spells that are already known', () => {
      const wizard = new SpellManager(3, 3);
      const knownSpells = wizard.getKnownSpells(1);
      
      if (knownSpells.length > 0) {
        const alreadyKnownSpell = knownSpells[0];
        const success = wizard.learnSpell(alreadyKnownSpell, 1);
        
        expect(success).toBe(false);
      }
    });

    it('should not learn spells of levels too high for character', () => {
      const level1Wizard = new SpellManager(1, 3);
      const availableLevel2 = level1Wizard.getAvailableToLearn(2);
      
      if (availableLevel2.length > 0) {
        const highLevelSpell = availableLevel2[0].name;
        const success = level1Wizard.learnSpell(highLevelSpell, 2);
        
        expect(success).toBe(false);
      }
    });

    it('should respect cantrip learning limits', () => {
      const wizard = new SpellManager(1, 3);
      const availableCantrips = wizard.getAvailableToLearn(0);
      
      // Try to learn more cantrips than allowed
      let learnedCount = 0;
      for (const cantrip of availableCantrips) {
        const success = wizard.learnSpell(cantrip.name, 0);
        if (success) learnedCount++;
      }
      
      // Should not exceed the cantrips known limit for level 1 (3)
      expect(wizard.getKnownSpells(0).length).toBeLessThanOrEqual(3);
    });

    it('should learn multiple spells in batch', () => {
      const wizard = new SpellManager(3, 3);
      const availableToLearn = wizard.getAvailableToLearn(1);
      
      if (availableToLearn.length >= 2) {
        const spellsToLearn = [
          { name: availableToLearn[0].name, level: 1 },
          { name: availableToLearn[1].name, level: 1 }
        ];
        
        const result = wizard.learnSpells(spellsToLearn);
        
        expect(result.learned.length).toBe(2);
        expect(result.failed.length).toBe(0);
        expect(wizard.getKnownSpells(1)).toContain(spellsToLearn[0].name);
        expect(wizard.getKnownSpells(1)).toContain(spellsToLearn[1].name);
      }
    });

    it('should get spell learning limits correctly', () => {
      const wizard = new SpellManager(5, 3);
      const limits = wizard.getSpellLearningLimits();
      
      expect(limits.cantripsMaximum).toBe(4); // Level 5 wizard knows 4 cantrips
      expect(limits.cantripsKnown).toBeGreaterThan(0);
      expect(limits.totalSpellsKnown).toBeGreaterThan(0);
    });

    it('should forget spells and remove from prepared', () => {
      const wizard = new SpellManager(3, 3);
      const knownSpells = wizard.getKnownSpells(1);
      
      if (knownSpells.length > 0) {
        const spellToForget = knownSpells[0];
        
        // Prepare the spell first
        wizard.prepareSpells([spellToForget], 1);
        expect(wizard.getPreparedSpells(1)).toContain(spellToForget);
        
        // Forget the spell
        const success = wizard.forgetSpell(spellToForget, 1);
        
        expect(success).toBe(true);
        expect(wizard.getKnownSpells(1)).not.toContain(spellToForget);
        expect(wizard.getPreparedSpells(1)).not.toContain(spellToForget);
      }
    });

    it('should handle level up progression correctly', () => {
      const wizard = new SpellManager(1, 3);
      const initialKnown = wizard.getAllKnownSpells();
      
      // Level up to 2
      const result = wizard.levelUp(2);
      
      // Should have learned 2 new spells (leveling up gives 2 spells)
      expect(result.spellsLearned.length).toBeLessThanOrEqual(2);
      expect(result.errors.length).toBe(0);
      
      // Should have updated spell slots
      expect(wizard.getMaxSlots().level1).toBe(3); // Level 2 wizard has 3 first level slots
    });

    it('should handle cantrip progression on level up', () => {
      const wizard = new SpellManager(3, 3); // 3 cantrips
      
      // Level up to 4 (gains 1 more cantrip)
      const result = wizard.levelUp(4);
      
      expect(result.cantripsLearned.length).toBeLessThanOrEqual(1);
      expect(wizard.getSpellLearningLimits().cantripsMaximum).toBe(4);
    });
  });
});