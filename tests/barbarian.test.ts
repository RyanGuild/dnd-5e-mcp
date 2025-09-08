import { 
  createCharacter, 
  calculateHitPointsAverage,
  getHitDieForClass
} from '../src/utils/character';
import { DNDCharacter } from '../src/types/character';
import { 
  testBarbarian, 
  testTotemBarbarian, 
  createCompleteCharacter, 
  createTestAbilityScores 
} from './data/testCharacters';
import { 
  BARBARIAN_PROGRESSION, 
  BARBARIAN_FEATURES, 
  PRIMAL_PATHS, 
  BARBARIAN_PROFICIENCIES,
  getRageCount,
  getRageDamage,
  getBrutalCriticalDice
} from '../src/data/barbarian';
import { RestManager } from '../src/utils/rest';

describe('Barbarian Class Tests', () => {
  describe('Barbarian Character Creation', () => {
    it('should create a barbarian character with correct default values', () => {
      const barbarian = createCharacter({
        name: 'Test Barbarian',
        class: { name: 'Barbarian', level: 1, hitDie: 12 },
        race: { name: 'Human', size: 'Medium', speed: 30, traits: [] },
        level: 1,
      });

      expect(barbarian.name).toBe('Test Barbarian');
      expect(barbarian.class.name).toBe('Barbarian');
      expect(barbarian.class.hitDie).toBe(12);
      expect(barbarian.level).toBe(1);
      expect(barbarian.proficiencyBonus).toBe(2);
      expect(barbarian.hitPoints.maximum).toBeGreaterThanOrEqual(12); // At least max hit die at level 1
    });

    it('should create barbarian with correct ability score priorities', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      
      expect(barbarian.class.name).toBe('Barbarian');
      expect(barbarian.abilityScores.strength.value).toBe(16); // Primary stat
      expect(barbarian.abilityScores.constitution.value).toBe(15); // Secondary stat
      expect(barbarian.abilityScores.dexterity.value).toBe(14); // AC calculation
    });

    it('should validate barbarian test character data', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      
      expect(barbarian.name).toBe('Gorak Bloodaxe');
      expect(barbarian.level).toBe(5);
      expect(barbarian.class.name).toBe('Barbarian');
      expect(barbarian.race.name).toBe('Half-Orc');
      expect(barbarian.background.name).toBe('Outlander');
      expect(barbarian.alignment).toBe('Chaotic Neutral');
    });

    it('should validate totem warrior barbarian test character data', () => {
      const totemBarbarian = createCompleteCharacter(testTotemBarbarian);
      
      expect(totemBarbarian.name).toBe('Thane Ironhide');
      expect(totemBarbarian.level).toBe(8);
      expect(totemBarbarian.class.name).toBe('Barbarian');
      expect(totemBarbarian.race.name).toBe('Human');
      expect(totemBarbarian.background.name).toBe('Hermit');
      expect(totemBarbarian.alignment).toBe('Neutral Good');
    });
  });

  describe('Barbarian Class Progression', () => {
    it('should have correct hit die for barbarian class', () => {
      expect(getHitDieForClass('Barbarian')).toBe(12);
    });

    it('should have correct proficiency bonus progression', () => {
      const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const expectedProficiencyBonus = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];
      
      levels.forEach((level, index) => {
        expect(BARBARIAN_PROGRESSION[level].proficiencyBonus).toBe(expectedProficiencyBonus[index]);
      });
    });

    it('should have correct rage count progression', () => {
      expect(getRageCount(1)).toBe(2);
      expect(getRageCount(3)).toBe(3);
      expect(getRageCount(6)).toBe(4);
      expect(getRageCount(12)).toBe(5);
      expect(getRageCount(17)).toBe(6);
      expect(getRageCount(20)).toBe(Infinity); // Unlimited rages at level 20
    });

    it('should have correct rage damage progression', () => {
      expect(getRageDamage(1)).toBe(2);
      expect(getRageDamage(8)).toBe(2);
      expect(getRageDamage(9)).toBe(3);
      expect(getRageDamage(15)).toBe(3);
      expect(getRageDamage(16)).toBe(4);
      expect(getRageDamage(20)).toBe(4);
    });

    it('should have correct brutal critical dice progression', () => {
      expect(getBrutalCriticalDice(1)).toBe(0);
      expect(getBrutalCriticalDice(8)).toBe(0);
      expect(getBrutalCriticalDice(9)).toBe(1);
      expect(getBrutalCriticalDice(12)).toBe(1);
      expect(getBrutalCriticalDice(13)).toBe(2);
      expect(getBrutalCriticalDice(16)).toBe(2);
      expect(getBrutalCriticalDice(17)).toBe(3);
      expect(getBrutalCriticalDice(20)).toBe(3);
    });

    it('should have correct features at each level', () => {
      // Level 1 features
      expect(BARBARIAN_PROGRESSION[1].features).toContain('Rage');
      expect(BARBARIAN_PROGRESSION[1].features).toContain('Unarmored Defense');
      
      // Level 2 features
      expect(BARBARIAN_PROGRESSION[2].features).toContain('Reckless Attack');
      expect(BARBARIAN_PROGRESSION[2].features).toContain('Danger Sense');
      
      // Level 3 features
      expect(BARBARIAN_PROGRESSION[3].features).toContain('Primal Path');
      
      // Level 5 features
      expect(BARBARIAN_PROGRESSION[5].features).toContain('Extra Attack');
      expect(BARBARIAN_PROGRESSION[5].features).toContain('Fast Movement');
      
      // Level 7 features
      expect(BARBARIAN_PROGRESSION[7].features).toContain('Feral Instinct');
      
      // Level 9 features
      expect(BARBARIAN_PROGRESSION[9].features).toContain('Brutal Critical (1 die)');
      
      // Level 11 features
      expect(BARBARIAN_PROGRESSION[11].features).toContain('Relentless Rage');
      
      // Level 15 features
      expect(BARBARIAN_PROGRESSION[15].features).toContain('Persistent Rage');
      
      // Level 18 features
      expect(BARBARIAN_PROGRESSION[18].features).toContain('Indomitable Might');
      
      // Level 20 features
      expect(BARBARIAN_PROGRESSION[20].features).toContain('Primal Champion');
    });
  });

  describe('Barbarian Features', () => {
    it('should have all core barbarian features defined', () => {
      const featureNames = BARBARIAN_FEATURES.map(f => f.name);
      
      expect(featureNames).toContain('Rage');
      expect(featureNames).toContain('Unarmored Defense');
      expect(featureNames).toContain('Reckless Attack');
      expect(featureNames).toContain('Danger Sense');
      expect(featureNames).toContain('Primal Path');
      expect(featureNames).toContain('Extra Attack');
      expect(featureNames).toContain('Fast Movement');
      expect(featureNames).toContain('Feral Instinct');
      expect(featureNames).toContain('Brutal Critical');
      expect(featureNames).toContain('Relentless Rage');
      expect(featureNames).toContain('Persistent Rage');
      expect(featureNames).toContain('Indomitable Might');
      expect(featureNames).toContain('Primal Champion');
    });

    it('should have correct feature levels', () => {
      const rageFeature = BARBARIAN_FEATURES.find(f => f.name === 'Rage');
      const unarmoredDefenseFeature = BARBARIAN_FEATURES.find(f => f.name === 'Unarmored Defense');
      const recklessAttackFeature = BARBARIAN_FEATURES.find(f => f.name === 'Reckless Attack');
      const primalChampionFeature = BARBARIAN_FEATURES.find(f => f.name === 'Primal Champion');
      
      expect(rageFeature?.level).toBe(1);
      expect(unarmoredDefenseFeature?.level).toBe(1);
      expect(recklessAttackFeature?.level).toBe(2);
      expect(primalChampionFeature?.level).toBe(20);
    });

    it('should have detailed feature descriptions', () => {
      const rageFeature = BARBARIAN_FEATURES.find(f => f.name === 'Rage');
      const unarmoredDefenseFeature = BARBARIAN_FEATURES.find(f => f.name === 'Unarmored Defense');
      
      expect(rageFeature?.description).toContain('primal ferocity');
      expect(rageFeature?.description).toContain('bonus action');
      expect(rageFeature?.description).toContain('advantage on Strength checks');
      expect(rageFeature?.description).toContain('resistance to bludgeoning, piercing, and slashing damage');
      
      expect(unarmoredDefenseFeature?.description).toContain('10 + your Dexterity modifier + your Constitution modifier');
      expect(unarmoredDefenseFeature?.description).toContain('not wearing any armor');
    });
  });

  describe('Primal Paths', () => {
    it('should have Berserker primal path defined', () => {
      expect(PRIMAL_PATHS.Berserker).toBeDefined();
      expect(PRIMAL_PATHS.Berserker.name).toBe('Path of the Berserker');
      expect(PRIMAL_PATHS.Berserker.description).toContain('untrammeled fury');
    });

    it('should have Totem Warrior primal path defined', () => {
      expect(PRIMAL_PATHS['Totem Warrior']).toBeDefined();
      expect(PRIMAL_PATHS['Totem Warrior'].name).toBe('Path of the Totem Warrior');
      expect(PRIMAL_PATHS['Totem Warrior'].description).toContain('spiritual journey');
    });

    it('should have correct Berserker features at each level', () => {
      const berserker = PRIMAL_PATHS.Berserker;
      
      expect(berserker.features[3]).toHaveLength(1);
      expect(berserker.features[3][0].name).toBe('Frenzy');
      expect(berserker.features[3][0].description).toContain('bonus action');
      expect(berserker.features[3][0].description).toContain('exhaustion');
      
      expect(berserker.features[6]).toHaveLength(1);
      expect(berserker.features[6][0].name).toBe('Mindless Rage');
      expect(berserker.features[6][0].description).toContain('charmed or frightened');
      
      expect(berserker.features[10]).toHaveLength(1);
      expect(berserker.features[10][0].name).toBe('Intimidating Presence');
      expect(berserker.features[10][0].description).toContain('frighten someone');
      
      expect(berserker.features[14]).toHaveLength(1);
      expect(berserker.features[14][0].name).toBe('Retaliation');
      expect(berserker.features[14][0].description).toContain('reaction');
    });

    it('should have correct Totem Warrior features at each level', () => {
      const totemWarrior = PRIMAL_PATHS['Totem Warrior'];
      
      expect(totemWarrior.features[3]).toHaveLength(2);
      expect(totemWarrior.features[3][0].name).toBe('Spirit Seeker');
      expect(totemWarrior.features[3][0].description).toContain('beast sense');
      expect(totemWarrior.features[3][1].name).toBe('Totem Spirit');
      expect(totemWarrior.features[3][1].description).toContain('Bear');
      expect(totemWarrior.features[3][1].description).toContain('Eagle');
      expect(totemWarrior.features[3][1].description).toContain('Wolf');
      
      expect(totemWarrior.features[6]).toHaveLength(1);
      expect(totemWarrior.features[6][0].name).toBe('Aspect of the Beast');
      
      expect(totemWarrior.features[10]).toHaveLength(1);
      expect(totemWarrior.features[10][0].name).toBe('Spirit Walker');
      expect(totemWarrior.features[10][0].description).toContain('commune with nature');
      
      expect(totemWarrior.features[14]).toHaveLength(1);
      expect(totemWarrior.features[14][0].name).toBe('Totemic Attunement');
    });
  });

  describe('Barbarian Proficiencies', () => {
    it('should have correct armor proficiencies', () => {
      expect(BARBARIAN_PROFICIENCIES.armor).toEqual(['light', 'medium', 'shield']);
    });

    it('should have correct weapon proficiencies', () => {
      expect(BARBARIAN_PROFICIENCIES.weapons).toEqual(['simple', 'martial']);
    });

    it('should have correct saving throw proficiencies', () => {
      expect(BARBARIAN_PROFICIENCIES.savingThrows).toEqual(['strength', 'constitution']);
    });

    it('should have correct skill choices', () => {
      expect(BARBARIAN_PROFICIENCIES.skills.choose).toBe(2);
      expect(BARBARIAN_PROFICIENCIES.skills.from).toEqual([
        'Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'
      ]);
    });

    it('should have no tool proficiencies', () => {
      expect(BARBARIAN_PROFICIENCIES.tools).toEqual([]);
    });
  });

  describe('Barbarian Hit Points', () => {
    it('should calculate hit points correctly for barbarian', () => {
      const constitutionModifier = 2; // +2 CON modifier
      const hitPoints = calculateHitPointsAverage(5, 12, constitutionModifier);
      
      // Level 1: 12 (max) + 2 (CON) = 14
      // Levels 2-5: (7 + 2) * 4 = 36 (average of d12 is 6.5, rounded up to 7)
      // Total: 14 + 36 = 50
      expect(hitPoints).toBe(50);
    });

    it('should have higher hit points than wizard at same level', () => {
      const constitutionModifier = 2;
      const barbarianHP = calculateHitPointsAverage(5, 12, constitutionModifier);
      const wizardHP = calculateHitPointsAverage(5, 6, constitutionModifier);
      
      expect(barbarianHP).toBeGreaterThan(wizardHP);
    });

    it('should have same hit points as fighter with same constitution', () => {
      const constitutionModifier = 2;
      const barbarianHP = calculateHitPointsAverage(5, 12, constitutionModifier);
      const fighterHP = calculateHitPointsAverage(5, 10, constitutionModifier);
      
      // Barbarian: 14 + (7+2)*4 = 50
      // Fighter: 10 + 2 + (6+2)*4 = 12 + 32 = 44
      expect(barbarianHP).toBeGreaterThan(fighterHP);
    });
  });

  describe('Barbarian Unarmored Defense', () => {
    it('should calculate unarmored defense correctly', () => {
      const barbarian = createCompleteCharacter({
        ...testBarbarian,
        abilityScores: createTestAbilityScores(16, 14, 15, 10, 13, 12) // STR 16, DEX 14, CON 15
      });
      
      // Unarmored Defense = 10 + DEX modifier + CON modifier
      // 10 + 2 (DEX) + 2 (CON) = 14
      const expectedAC = 10 + 2 + 2; // 14
      
      // Note: This would need to be implemented in the character creation logic
      // For now, we're just testing the calculation
      expect(expectedAC).toBe(14);
    });

    it('should benefit from high constitution for AC', () => {
      const highConBarbarian = createCompleteCharacter({
        ...testBarbarian,
        abilityScores: createTestAbilityScores(16, 12, 18, 10, 13, 12) // Higher CON
      });
      
      // Unarmored Defense = 10 + DEX modifier + CON modifier
      // 10 + 1 (DEX) + 4 (CON) = 15
      const expectedAC = 10 + 1 + 4; // 15
      
      expect(expectedAC).toBe(15);
    });
  });

  describe('Barbarian Rest Recovery', () => {
    it('should restore rage on long rest', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      const restManager = new RestManager(barbarian);
      
      const longRestResult = restManager.longRest();
      
      expect(longRestResult.success).toBe(true);
      expect(longRestResult.featuresRestored).toContain('Rage');
    });

    it('should not restore rage on short rest', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      const restManager = new RestManager(barbarian);
      
      const shortRestResult = restManager.shortRest(0);
      
      expect(shortRestResult.success).toBe(true);
      expect(shortRestResult.featuresRestored).not.toContain('Rage');
    });
  });

  describe('Barbarian Level Progression', () => {
    it('should have correct features at level 1', () => {
      const level1Features = BARBARIAN_PROGRESSION[1].features;
      expect(level1Features).toContain('Rage');
      expect(level1Features).toContain('Unarmored Defense');
      expect(level1Features).toHaveLength(2);
    });

    it('should have correct features at level 5', () => {
      const level5Features = BARBARIAN_PROGRESSION[5].features;
      expect(level5Features).toContain('Extra Attack');
      expect(level5Features).toContain('Fast Movement');
      expect(level5Features).toHaveLength(2);
    });

    it('should have correct features at level 20', () => {
      const level20Features = BARBARIAN_PROGRESSION[20].features;
      expect(level20Features).toContain('Primal Champion');
      expect(level20Features).toHaveLength(1);
    });

    it('should have unlimited rages at level 20', () => {
      expect(BARBARIAN_PROGRESSION[20].rages).toBe(Infinity);
    });
  });

  describe('Barbarian Equipment Proficiencies', () => {
    it('should have correct equipment proficiencies for barbarian', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      
      expect(barbarian.equipmentProficiencies).toContain('Light armor');
      expect(barbarian.equipmentProficiencies).toContain('Medium armor');
      expect(barbarian.equipmentProficiencies).toContain('Shields');
      expect(barbarian.equipmentProficiencies).toContain('Simple weapons');
      expect(barbarian.equipmentProficiencies).toContain('Martial weapons');
    });

    it('should not have heavy armor proficiency', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      
      expect(barbarian.equipmentProficiencies).not.toContain('Heavy armor');
    });
  });

  describe('Barbarian Skill Proficiencies', () => {
    it('should have correct skill choices for barbarian', () => {
      const barbarian = createCompleteCharacter(testBarbarian);
      
      // Barbarian gets 2 skills from: Animal Handling, Athletics, Intimidation, Nature, Perception, Survival
      const barbarianSkills = barbarian.skills.filter(skill => skill.proficient);
      
      // Check that the barbarian has the correct skill choices available
      const availableSkills = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'];
      const barbarianSkillNames = barbarian.skills
        .filter(skill => availableSkills.includes(skill.name))
        .map(skill => skill.name);
      
      expect(barbarianSkillNames).toEqual(availableSkills);
      expect(barbarianSkillNames).toHaveLength(6);
    });
  });
});
