import { CharacterInventory } from './equipment';
import { KnownSpells } from '../utils/spells';

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

export interface HitDice {
  current: number;
  maximum: number;
  size: number;
}

export interface CharacterClass {
  name: string;
  level: number;
  hitDie: number;
  spellcastingAbility?: keyof AbilityScores;
  fightingStyle?: string;
  subclass?: string;
  classFeatures?: ClassFeatureInstance[];
}

export interface ClassFeatureInstance {
  name: string;
  level: number;
  description: string;
  type: 'passive' | 'action' | 'bonus_action' | 'reaction' | 'resource';
  uses?: number;
  maxUses?: number;
  usesType?: 'per_rest' | 'per_long_rest' | 'per_short_rest' | 'per_day';
  rechargeOn?: 'short_rest' | 'long_rest';
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
  hitDice: HitDice;
  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
  equipment: string[];
  spells: string[];
  knownSpells?: KnownSpells; // For wizard spellbooks
  features: string[];
  languages: string[];
  alignment: string;
  experiencePoints: number;
  notes: string;
  inventory: CharacterInventory;
  equipmentProficiencies: string[];
  exhaustionLevel: number;
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
