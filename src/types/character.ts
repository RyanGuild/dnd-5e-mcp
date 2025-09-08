import { CharacterInventory } from './equipment';

export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface AbilityScores {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}

export interface Skill {
  name: string;
  ability: keyof AbilityScores;
  proficient: boolean;
  modifier: number;
}

export interface SavingThrow {
  ability: keyof AbilityScores;
  proficient: boolean;
  modifier: number;
}

export interface HitPoints {
  current: number;
  maximum: number;
  temporary: number;
}

export interface CharacterClass {
  name: string;
  level: number;
  hitDie: number;
  spellcastingAbility?: keyof AbilityScores;
}

export interface Race {
  name: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  speed: number;
  traits: string[];
}

export interface Background {
  name: string;
  skillProficiencies: string[];
  languages: string[];
  equipment: string[];
  feature: string;
}

export interface DNDCharacter {
  id: string;
  name: string;
  level: number;
  class: CharacterClass;
  race: Race;
  background: Background;
  abilityScores: AbilityScores;
  skills: Skill[];
  savingThrows: SavingThrow[];
  hitPoints: HitPoints;
  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  equipment: string[];
  spells: string[];
  features: string[];
  languages: string[];
  alignment: string;
  experiencePoints: number;
  notes: string;
  inventory: CharacterInventory;
  equipmentProficiencies: string[];
}

export interface DiceRoll {
  dice: number;
  sides: number;
  modifier: number;
  advantage?: boolean;
  disadvantage?: boolean;
}

export interface RollResult {
  rolls: number[];
  total: number;
  natural20: boolean;
  natural1: boolean;
}
