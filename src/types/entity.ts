import { DNDCharacter, AbilityScores } from './character.js';

export type EntityType = 'character' | 'npc' | 'monster';

export interface BaseEntity {
  id: string;
  name: string;
  type: EntityType;
  level?: number;
  abilityScores: AbilityScores;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;
  notes: string;
  created: Date;
  modified: Date;
}

export interface CharacterEntity extends BaseEntity {
  type: 'character';
  level: number;
  class: {
    name: string;
    level: number;
    hitDie: number;
    spellcastingAbility?: keyof AbilityScores;
  };
  race: {
    name: string;
    size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
    speed: number;
    traits: string[];
  };
  background: {
    name: string;
    skillProficiencies: string[];
    languages: string[];
    equipment: string[];
    feature: string;
  };
  skills: Array<{
    name: string;
    ability: keyof AbilityScores;
    proficient: boolean;
    modifier: number;
  }>;
  savingThrows: Array<{
    ability: keyof AbilityScores;
    proficient: boolean;
    modifier: number;
  }>;
  proficiencyBonus: number;
  equipment: string[];
  spells: string[];
  features: string[];
  languages: string[];
  alignment: string;
  experiencePoints: number;
  inventory: any; // CharacterInventory type
  equipmentProficiencies: string[];
}

export interface NPCEntity extends BaseEntity {
  type: 'npc';
  level?: number;
  role: string; // e.g., "Shopkeeper", "Quest Giver", "Guard"
  location: string;
  personality: string;
  motivation: string;
  relationships: string[];
  equipment: string[];
  spells?: string[];
  features: string[];
  languages: string[];
  alignment: string;
}

export interface MonsterEntity extends Omit<BaseEntity, 'speed' | 'hitPoints'> {
  type: 'monster';
  challengeRating: number;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  creatureType: string; // e.g., "Beast", "Humanoid", "Dragon"
  alignment: string;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
    hitDice: string; // e.g., "12d8+36"
  };
  speed: {
    walk: number;
    fly?: number;
    swim?: number;
    climb?: number;
    burrow?: number;
  };
  skills: Array<{
    name: string;
    modifier: number;
  }>;
  savingThrows: Array<{
    ability: keyof AbilityScores;
    modifier: number;
  }>;
  damageResistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
  senses: string[];
  languages: string[];
  xp: number;
  traits: Array<{
    name: string;
    description: string;
  }>;
  actions: Array<{
    name: string;
    description: string;
    attackBonus?: number;
    damage?: string;
  }>;
  legendaryActions?: Array<{
    name: string;
    description: string;
    cost: number;
  }>;
  reactions?: Array<{
    name: string;
    description: string;
  }>;
}

export type GameEntity = CharacterEntity | NPCEntity | MonsterEntity;

export interface EntityCollection {
  characters: CharacterEntity[];
  npcs: NPCEntity[];
  monsters: MonsterEntity[];
  activeEntityId?: string;
}

export function isCharacter(entity: GameEntity): entity is CharacterEntity {
  return entity.type === 'character';
}

export function isNPC(entity: GameEntity): entity is NPCEntity {
  return entity.type === 'npc';
}

export function isMonster(entity: GameEntity): entity is MonsterEntity {
  return entity.type === 'monster';
}
