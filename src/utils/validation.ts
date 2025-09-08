import { z } from 'zod';
import { DNDCharacter } from '../types/character';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// D&D 5e skill proficiency data
const CLASS_SKILL_PROFICIENCIES: { [key: string]: number } = {
  'Barbarian': 2,
  'Bard': 3,
  'Cleric': 2,
  'Druid': 2,
  'Fighter': 2,
  'Monk': 2,
  'Paladin': 2,
  'Ranger': 3,
  'Rogue': 4,
  'Sorcerer': 2,
  'Warlock': 2,
  'Wizard': 2
};

const BACKGROUND_SKILL_PROFICIENCIES: { [key: string]: number } = {
  'Acolyte': 2,
  'Criminal': 2,
  'Folk Hero': 2,
  'Noble': 2,
  'Sage': 2,
  'Soldier': 2,
  'Charlatan': 2,
  'Entertainer': 2,
  'Guild Artisan': 2,
  'Hermit': 2,
  'Outlander': 2,
  'Sailor': 2,
  'Urchin': 2
};

// Default background skill proficiencies if not specified
const DEFAULT_BACKGROUND_SKILLS = 2;

// Zod schemas for character validation
const AbilityScoreSchema = z.object({
  value: z.number().min(1).max(30),
  modifier: z.number()
});

const AbilityScoresSchema = z.object({
  strength: AbilityScoreSchema,
  dexterity: AbilityScoreSchema,
  constitution: AbilityScoreSchema,
  intelligence: AbilityScoreSchema,
  wisdom: AbilityScoreSchema,
  charisma: AbilityScoreSchema
});

const SkillSchema = z.object({
  name: z.string().min(1),
  ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
  proficient: z.boolean(),
  modifier: z.number()
});

const SavingThrowSchema = z.object({
  ability: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']),
  proficient: z.boolean(),
  modifier: z.number()
});

const HitPointsSchema = z.object({
  current: z.number().min(0),
  maximum: z.number().min(1),
  temporary: z.number().min(0)
});

const CharacterClassSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(1).max(20),
  hitDie: z.number().min(1),
  spellcastingAbility: z.enum(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']).optional()
});

const RaceSchema = z.object({
  name: z.string().min(1),
  size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']),
  speed: z.number().min(0),
  traits: z.array(z.string())
});

const BackgroundSchema = z.object({
  name: z.string().min(1),
  skillProficiencies: z.array(z.string()),
  languages: z.array(z.string()),
  equipment: z.array(z.string()),
  feature: z.string()
});

const CharacterInventorySchema = z.object({
  items: z.array(z.any()),
  maxWeight: z.number().min(0),
  currentWeight: z.number().min(0),
  currency: z.object({
    copper: z.number().min(0),
    silver: z.number().min(0),
    gold: z.number().min(0),
    platinum: z.number().min(0)
  })
});

const DNDCharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  level: z.number().min(1).max(20),
  class: CharacterClassSchema,
  race: RaceSchema,
  background: BackgroundSchema,
  abilityScores: AbilityScoresSchema,
  skills: z.array(SkillSchema),
  savingThrows: z.array(SavingThrowSchema),
  hitPoints: HitPointsSchema,
  armorClass: z.number().min(1),
  initiative: z.number(),
  speed: z.number().min(0),
  proficiencyBonus: z.number().min(1),
  equipment: z.array(z.string()),
  spells: z.array(z.string()),
  features: z.array(z.string()),
  languages: z.array(z.string()),
  alignment: z.string(),
  experiencePoints: z.number().min(0),
  notes: z.string(),
  inventory: CharacterInventorySchema,
  equipmentProficiencies: z.array(z.string())
});

export function validateCharacter(character: DNDCharacter): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Handle null/undefined characters
  if (!character) {
    errors.push('Character is null or undefined');
    return { isValid: false, errors, warnings };
  }

  try {
    // Validate the character structure with Zod
    DNDCharacterSchema.parse(character);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod errors to our error format
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        const message = `${path}: ${err.message}`;
        
        // Determine if this should be an error or warning based on the field
        if (isCriticalField(err.path)) {
          errors.push(message);
        } else {
          warnings.push(message);
        }
      });
    } else {
      errors.push('Unknown validation error occurred');
    }
  }

  // Additional business logic validations that can't be easily expressed in Zod
  if (character && character.skills && character.class && character.background) {
    // Validate skill proficiencies count (only warn, don't error)
    const proficientSkills = character.skills.filter(skill => skill.proficient);
    const expectedClassSkills = CLASS_SKILL_PROFICIENCIES[character.class.name] || 2;
    const expectedBackgroundSkills = character.background ? 
      (character.background.skillProficiencies.length > 0 ? character.background.skillProficiencies.length : DEFAULT_BACKGROUND_SKILLS) : 
      DEFAULT_BACKGROUND_SKILLS;
    const expectedTotalSkills = expectedClassSkills + expectedBackgroundSkills;
    
    if (proficientSkills.length !== expectedTotalSkills) {
      warnings.push(`Incorrect number of skill proficiencies: expected ${expectedTotalSkills} (${expectedClassSkills} from class + ${expectedBackgroundSkills} from background), but found ${proficientSkills.length}`);
    }
    
    // Check for duplicate skill proficiencies
    const skillNames = character.skills.filter(skill => skill.proficient).map(skill => skill.name);
    const uniqueSkillNames = new Set(skillNames);
    if (skillNames.length !== uniqueSkillNames.size) {
      errors.push('Duplicate skill proficiencies found');
    }

    // Check current hit points don't exceed maximum
    if (character.hitPoints && character.hitPoints.current > character.hitPoints.maximum) {
      warnings.push('Current hit points cannot exceed maximum hit points');
    }

    // Check for Python-style formatting (common issue)
    const characterString = JSON.stringify(character);
    if (characterString.includes("'") || characterString.includes('True') || characterString.includes('False')) {
      warnings.push('Character data may contain Python-style formatting instead of JSON');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Helper function to determine if a field is critical for validation
function isCriticalField(path: (string | number | symbol)[]): boolean {
  const criticalFields = [
    'id', 'name', 'level', 'class', 'race', 'background', 
    'abilityScores', 'skills', 'savingThrows', 'hitPoints', 
    'inventory', 'armorClass', 'proficiencyBonus', 'experiencePoints'
  ];
  
  // Check if any segment of the path matches critical fields
  return path.some(segment => 
    typeof segment === 'string' && criticalFields.includes(segment)
  );
}

export function formatValidationResult(result: ValidationResult): string {
  let output = `Character Validation Results:\n`;
  output += `Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`;

  if (result.errors.length > 0) {
    output += `Errors (${result.errors.length}):\n`;
    result.errors.forEach(error => {
      output += `  ❌ ${error}\n`;
    });
    output += '\n';
  }

  if (result.warnings.length > 0) {
    output += `Warnings (${result.warnings.length}):\n`;
    result.warnings.forEach(warning => {
      output += `  ⚠️  ${warning}\n`;
    });
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    output += `✅ Character data is valid and properly formatted!`;
  }

  return output;
}