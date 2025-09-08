import { DNDCharacter, AbilityScores, Skill, SavingThrow } from '../types/character';
import { createEmptyInventory, calculateMaxWeight } from './inventory';
import { z } from 'zod';
import { AbilityScoresSchema } from './validation';

export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function createAbilityScores(scores: Partial<AbilityScores>): AbilityScores {
  const defaultScores = {
    strength: { value: 10, modifier: 0 },
    dexterity: { value: 10, modifier: 0 },
    constitution: { value: 10, modifier: 0 },
    intelligence: { value: 10, modifier: 0 },
    wisdom: { value: 10, modifier: 0 },
    charisma: { value: 10, modifier: 0 }
  };

  const result: AbilityScores = { ...defaultScores };

  for (const [ability, score] of Object.entries(scores)) {
    if (score && typeof score === 'object' && 'value' in score) {
      // Validate individual ability score values
      const abilityValue = z.number().min(1).max(30).safeParse(score.value);
      
      if (!abilityValue.success) {
        throw new Error(`Invalid ability score for ${ability}: ${abilityValue.error.message}`);
      }
      
      result[ability as keyof AbilityScores] = {
        value: score.value,
        modifier: calculateAbilityModifier(score.value)
      };
    }
  }

  // Validate the final ability scores structure
  const validation = AbilityScoresSchema.safeParse(result);
  
  if (!validation.success) {
    throw new Error(`Invalid ability scores: ${validation.error.message}`);
  }

  return result;
}

export function createSkills(abilityScores: AbilityScores, proficiencyBonus: number, proficientSkills: string[] = []): Skill[] {
  const skillMap: { [key: string]: keyof AbilityScores } = {
    'Acrobatics': 'dexterity',
    'Animal Handling': 'wisdom',
    'Arcana': 'intelligence',
    'Athletics': 'strength',
    'Deception': 'charisma',
    'History': 'intelligence',
    'Insight': 'wisdom',
    'Intimidation': 'charisma',
    'Investigation': 'intelligence',
    'Medicine': 'wisdom',
    'Nature': 'intelligence',
    'Perception': 'wisdom',
    'Performance': 'charisma',
    'Persuasion': 'charisma',
    'Religion': 'intelligence',
    'Sleight of Hand': 'dexterity',
    'Stealth': 'dexterity',
    'Survival': 'wisdom'
  };

  return Object.entries(skillMap).map(([name, ability]) => {
    const proficient = proficientSkills.includes(name);
    const abilityModifier = abilityScores[ability].modifier;
    const modifier = abilityModifier + (proficient ? proficiencyBonus : 0);

    return {
      name,
      ability,
      proficient,
      modifier
    };
  });
}

export function createSavingThrows(abilityScores: AbilityScores, proficiencyBonus: number, proficientSaves: string[] = []): SavingThrow[] {
  return Object.entries(abilityScores).map(([ability, score]) => {
    const proficient = proficientSaves.includes(ability);
    const modifier = score.modifier + (proficient ? proficiencyBonus : 0);

    return {
      ability: ability as keyof AbilityScores,
      proficient,
      modifier
    };
  });
}

export function calculateArmorClass(dexterityModifier: number, armorBonus: number = 0, shieldBonus: number = 0): number {
  return 10 + dexterityModifier + armorBonus + shieldBonus;
}

export function calculateHitPoints(level: number, hitDie: number, constitutionModifier: number, firstLevelMax: boolean = true): number {
  let total = 0;
  
  for (let i = 1; i <= level; i++) {
    if (i === 1 && firstLevelMax) {
      total += hitDie + constitutionModifier;
    } else {
      total += Math.floor(hitDie / 2) + 1 + constitutionModifier; // Average roll
    }
  }
  
  return Math.max(1, total);
}

export function calculateHitPointsRolled(level: number, hitDie: number, constitutionModifier: number, rolls: number[]): number {
  let total = 0;
  
  for (let i = 0; i < level; i++) {
    if (i === 0) {
      // First level is always max
      total += hitDie + constitutionModifier;
    } else {
      // Use provided rolls for subsequent levels
      const roll = rolls[i - 1] || 1; // Default to 1 if no roll provided
      total += Math.max(1, roll + constitutionModifier);
    }
  }
  
  return Math.max(1, total);
}

export function calculateHitPointsAverage(level: number, hitDie: number, constitutionModifier: number): number {
  let total = 0;
  
  for (let i = 1; i <= level; i++) {
    if (i === 1) {
      // First level is always max
      total += hitDie + constitutionModifier;
    } else {
      // Average roll for subsequent levels
      total += Math.floor(hitDie / 2) + 1 + constitutionModifier;
    }
  }
  
  return Math.max(1, total);
}

export function healCharacter(character: DNDCharacter, amount: number): { newCurrent: number; healed: number } {
  const oldCurrent = character.hitPoints.current;
  const newCurrent = Math.min(character.hitPoints.maximum, oldCurrent + amount);
  const healed = newCurrent - oldCurrent;
  
  character.hitPoints.current = newCurrent;
  
  return { newCurrent, healed };
}

export function damageCharacter(character: DNDCharacter, amount: number): { newCurrent: number; damage: number } {
  const oldCurrent = character.hitPoints.current;
  const oldTemporary = character.hitPoints.temporary;
  const originalAmount = amount;
  
  // Reduce temporary hit points first
  if (character.hitPoints.temporary > 0) {
    const tempDamage = Math.min(amount, character.hitPoints.temporary);
    character.hitPoints.temporary -= tempDamage;
    amount -= tempDamage;
  }
  
  // Then reduce actual hit points
  const newCurrent = Math.max(0, oldCurrent - amount);
  
  character.hitPoints.current = newCurrent;
  
  return { newCurrent, damage: originalAmount };
}

export function setCurrentHitPoints(character: DNDCharacter, amount: number): { newCurrent: number; changed: number } {
  const oldCurrent = character.hitPoints.current;
  const newCurrent = Math.max(0, Math.min(character.hitPoints.maximum, amount));
  const changed = newCurrent - oldCurrent;
  
  character.hitPoints.current = newCurrent;
  
  return { newCurrent, changed };
}

export function addTemporaryHitPoints(character: DNDCharacter, amount: number): { newTemporary: number; added: number } {
  const oldTemporary = character.hitPoints.temporary;
  const newTemporary = Math.max(oldTemporary, amount); // New temp HP only replaces if higher
  const added = newTemporary - oldTemporary;
  
  character.hitPoints.temporary = newTemporary;
  
  return { newTemporary, added };
}

export function removeTemporaryHitPoints(character: DNDCharacter, amount: number): { newTemporary: number; removed: number } {
  const oldTemporary = character.hitPoints.temporary;
  const newTemporary = Math.max(0, oldTemporary - amount);
  const removed = oldTemporary - newTemporary;
  
  character.hitPoints.temporary = newTemporary;
  
  return { newTemporary, removed };
}

export function createCharacter(data: Partial<DNDCharacter>): DNDCharacter {
  const id = data.id || generateId();
  const level = data.level || 1;
  const proficiencyBonus = calculateProficiencyBonus(level);
  
  const abilityScores = data.abilityScores || createAbilityScores({});
  const skills = data.skills || createSkills(abilityScores, proficiencyBonus);
  const savingThrows = data.savingThrows || createSavingThrows(abilityScores, proficiencyBonus);
  
  const hitPoints = data.hitPoints || {
    current: calculateHitPoints(level, data.class?.hitDie || 8, abilityScores.constitution.modifier),
    maximum: calculateHitPoints(level, data.class?.hitDie || 8, abilityScores.constitution.modifier),
    temporary: 0
  };

  const armorClass = data.armorClass || calculateArmorClass(abilityScores.dexterity.modifier);
  const inventory = data.inventory || createEmptyInventory();
  inventory.maxWeight = calculateMaxWeight(abilityScores.strength.value);
  const equipmentProficiencies = data.equipmentProficiencies || getDefaultEquipmentProficiencies(data.class?.name || 'Fighter');

  return {
    id,
    name: data.name || 'Unnamed Character',
    level,
    class: data.class || { name: 'Fighter', level: 1, hitDie: 10 },
    race: data.race || { name: 'Human', size: 'Medium', speed: 30, traits: [] },
    background: data.background || { name: 'Folk Hero', skillProficiencies: [], languages: [], equipment: [], feature: '' },
    abilityScores,
    skills,
    savingThrows,
    hitPoints,
    armorClass,
    initiative: data.initiative || abilityScores.dexterity.modifier,
    speed: data.speed || 30,
    proficiencyBonus,
    equipment: data.equipment || [],
    spells: data.spells || [],
    features: data.features || [],
    languages: data.languages || ['Common'],
    alignment: data.alignment || 'True Neutral',
    experiencePoints: data.experiencePoints || 0,
    notes: data.notes || '',
    inventory,
    equipmentProficiencies
  };
}

function getDefaultEquipmentProficiencies(className: string): string[] {
  const proficiencies: { [key: string]: string[] } = {
    'Fighter': ['simple', 'martial', 'light', 'medium', 'heavy', 'shield'],
    'Paladin': ['simple', 'martial', 'light', 'medium', 'heavy', 'shield'],
    'Ranger': ['simple', 'martial', 'light', 'medium'],
    'Barbarian': ['simple', 'martial', 'light', 'medium'],
    'Rogue': ['simple', 'light'],
    'Monk': ['simple', 'shortsword'],
    'Cleric': ['simple', 'light', 'medium', 'heavy', 'shield'],
    'Druid': ['simple', 'light', 'medium', 'shield'],
    'Wizard': ['simple'],
    'Sorcerer': ['simple'],
    'Warlock': ['simple'],
    'Bard': ['simple', 'light', 'hand_crossbow', 'longsword', 'rapier', 'shortsword']
  };
  
  return proficiencies[className] || ['simple'];
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
