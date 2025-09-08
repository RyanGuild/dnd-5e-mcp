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

export function validateCharacter(character: DNDCharacter): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Handle null/undefined characters
  if (!character) {
    errors.push('Character is null or undefined');
    return { isValid: false, errors, warnings };
  }

  // Check level
  if (typeof character.level !== 'number' || character.level < 1 || character.level > 20) {
    errors.push('Level must be a number between 1 and 20');
  }

  // Check ability scores structure
  if (!character.abilityScores || typeof character.abilityScores !== 'object') {
    errors.push('Missing ability scores');
  } else {
    const requiredAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    for (const ability of requiredAbilities) {
      if (!character.abilityScores[ability as keyof typeof character.abilityScores]) {
        errors.push(`Missing ability score: ${ability}`);
      } else {
        const abilityScore = character.abilityScores[ability as keyof typeof character.abilityScores];
        if (typeof abilityScore !== 'object' || !('value' in abilityScore) || !('modifier' in abilityScore)) {
          errors.push(`Invalid ability score structure for ${ability}`);
        } else if (typeof abilityScore.value !== 'number' || abilityScore.value < 1 || abilityScore.value > 30) {
          errors.push(`Invalid ability score value for ${ability}: must be between 1 and 30`);
        }
      }
    }
  }

  // Check skills structure
  if (!Array.isArray(character.skills)) {
    errors.push('Skills must be an array');
  } else {
    for (const skill of character.skills) {
      if (typeof skill !== 'object' || !('name' in skill) || !('proficient' in skill) || !('modifier' in skill)) {
        errors.push('Invalid skill structure');
        break;
      }
    }
    
    // Validate skill proficiencies count
    const proficientSkills = character.skills.filter(skill => skill.proficient);
    const expectedClassSkills = CLASS_SKILL_PROFICIENCIES[character.class.name] || 2;
    const expectedBackgroundSkills = character.background ? 
      (character.background.skillProficiencies.length > 0 ? character.background.skillProficiencies.length : DEFAULT_BACKGROUND_SKILLS) : 
      DEFAULT_BACKGROUND_SKILLS;
    const expectedTotalSkills = expectedClassSkills + expectedBackgroundSkills;
    
    if (proficientSkills.length !== expectedTotalSkills) {
      errors.push(`Incorrect number of skill proficiencies: expected ${expectedTotalSkills} (${expectedClassSkills} from class + ${expectedBackgroundSkills} from background), but found ${proficientSkills.length}`);
    }
    
    // Check for duplicate skill proficiencies
    const skillNames = character.skills.filter(skill => skill.proficient).map(skill => skill.name);
    const uniqueSkillNames = new Set(skillNames);
    if (skillNames.length !== uniqueSkillNames.size) {
      errors.push('Duplicate skill proficiencies found');
    }
  }

  // Check saving throws structure
  if (!Array.isArray(character.savingThrows)) {
    errors.push('Saving throws must be an array');
  } else {
    for (const savingThrow of character.savingThrows) {
      if (typeof savingThrow !== 'object' || !('ability' in savingThrow) || !('proficient' in savingThrow) || !('modifier' in savingThrow)) {
        errors.push('Invalid saving throw structure');
        break;
      }
    }
  }

  // Check for Python-style formatting (common issue)
  const characterString = JSON.stringify(character);
  if (characterString.includes("'") || characterString.includes('True') || characterString.includes('False')) {
    warnings.push('Character data may contain Python-style formatting instead of JSON');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
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
