import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { DNDCharacter } from '../types/character.js';
import { EntityCollection, GameEntity, CharacterEntity, NPCEntity, MonsterEntity } from '../types/entity.js';

const ENTITIES_FILE = join(homedir(), '.dnd-entities.json');

// Legacy support for old single character file
const CHARACTER_FILE = join(homedir(), '.characters.json');

export async function saveEntityCollection(collection: EntityCollection): Promise<void> {
  try {
    const data = JSON.stringify(collection, null, 2);
    await fs.writeFile(ENTITIES_FILE, data, 'utf8');
  } catch (error) {
    throw new Error(`Failed to save entities: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function loadEntityCollection(): Promise<EntityCollection> {
  try {
    const data = await fs.readFile(ENTITIES_FILE, 'utf8');
    const collection = JSON.parse(data) as EntityCollection;
    
    // Validate the loaded data
    if (!collection.characters || !collection.npcs || !collection.monsters) {
      throw new Error('Invalid entity collection data in file');
    }
    
    return collection;
  } catch (error) {
    if ((error as any)?.code === 'ENOENT') {
      // File doesn't exist, try to migrate from old character file
      return await migrateFromLegacyCharacterFile();
    }
    throw new Error(`Failed to load entities: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function migrateFromLegacyCharacterFile(): Promise<EntityCollection> {
  try {
    const data = await fs.readFile(CHARACTER_FILE, 'utf8');
    const character = JSON.parse(data) as DNDCharacter;
    
    // Convert old character to new entity format
    const characterEntity: CharacterEntity = {
      id: character.id,
      name: character.name,
      type: 'character',
      level: character.level,
      class: character.class,
      race: character.race,
      background: character.background,
      abilityScores: character.abilityScores,
      skills: character.skills,
      savingThrows: character.savingThrows,
      hitPoints: character.hitPoints,
      armorClass: character.armorClass,
      initiative: character.initiative,
      speed: character.speed,
      proficiencyBonus: character.proficiencyBonus,
      equipment: character.equipment,
      spells: character.spells,
      features: character.features,
      languages: character.languages,
      alignment: character.alignment,
      experiencePoints: character.experiencePoints,
      notes: character.notes,
      inventory: character.inventory,
      equipmentProficiencies: character.equipmentProficiencies,
      created: new Date(),
      modified: new Date()
    };
    
    const collection: EntityCollection = {
      characters: [characterEntity],
      npcs: [],
      monsters: [],
      activeEntityId: character.id
    };
    
    // Save the new format and remove old file
    await saveEntityCollection(collection);
    await fs.unlink(CHARACTER_FILE);
    
    return collection;
  } catch (error) {
    if ((error as any)?.code === 'ENOENT') {
      // No legacy file exists, return empty collection
      return {
        characters: [],
        npcs: [],
        monsters: [],
        activeEntityId: undefined
      };
    }
    throw error;
  }
}

export async function saveEntity(entity: GameEntity): Promise<void> {
  const collection = await loadEntityCollection();
  
  // Remove existing entity with same ID
  collection.characters = collection.characters.filter(e => e.id !== entity.id);
  collection.npcs = collection.npcs.filter(e => e.id !== entity.id);
  collection.monsters = collection.monsters.filter(e => e.id !== entity.id);
  
  // Add the new/updated entity
  if (entity.type === 'character') {
    collection.characters.push(entity as CharacterEntity);
  } else if (entity.type === 'npc') {
    collection.npcs.push(entity as NPCEntity);
  } else if (entity.type === 'monster') {
    collection.monsters.push(entity as MonsterEntity);
  }
  
  // Update modified date
  entity.modified = new Date();
  
  await saveEntityCollection(collection);
}

export async function loadEntity(id: string): Promise<GameEntity | null> {
  const collection = await loadEntityCollection();
  
  const allEntities = [...collection.characters, ...collection.npcs, ...collection.monsters];
  return allEntities.find(entity => entity.id === id) || null;
}

export async function loadActiveEntity(): Promise<GameEntity | null> {
  const collection = await loadEntityCollection();
  
  if (!collection.activeEntityId) {
    return null;
  }
  
  return await loadEntity(collection.activeEntityId);
}

export async function setActiveEntity(id: string): Promise<void> {
  const collection = await loadEntityCollection();
  collection.activeEntityId = id;
  await saveEntityCollection(collection);
}

export async function deleteEntity(id: string): Promise<void> {
  const collection = await loadEntityCollection();
  
  // Remove entity from all collections
  collection.characters = collection.characters.filter(e => e.id !== id);
  collection.npcs = collection.npcs.filter(e => e.id !== id);
  collection.monsters = collection.monsters.filter(e => e.id !== id);
  
  // If this was the active entity, clear it
  if (collection.activeEntityId === id) {
    collection.activeEntityId = undefined;
  }
  
  await saveEntityCollection(collection);
}

export async function listEntities(type?: 'character' | 'npc' | 'monster'): Promise<GameEntity[]> {
  const collection = await loadEntityCollection();
  
  if (type === 'character') {
    return collection.characters;
  } else if (type === 'npc') {
    return collection.npcs;
  } else if (type === 'monster') {
    return collection.monsters;
  } else {
    return [...collection.characters, ...collection.npcs, ...collection.monsters];
  }
}

export async function entityExists(id: string): Promise<boolean> {
  const entity = await loadEntity(id);
  return entity !== null;
}

// Legacy functions for backward compatibility
export async function saveCharacter(character: DNDCharacter): Promise<void> {
  // Convert to new entity format
  const characterEntity: CharacterEntity = {
    id: character.id,
    name: character.name,
    type: 'character',
    level: character.level,
    class: character.class,
    race: character.race,
    background: character.background,
    abilityScores: character.abilityScores,
    skills: character.skills,
    savingThrows: character.savingThrows,
    hitPoints: character.hitPoints,
    armorClass: character.armorClass,
    initiative: character.initiative,
    speed: character.speed,
    proficiencyBonus: character.proficiencyBonus,
    equipment: character.equipment,
    spells: character.spells,
    features: character.features,
    languages: character.languages,
    alignment: character.alignment,
    experiencePoints: character.experiencePoints,
    notes: character.notes,
    inventory: character.inventory,
    equipmentProficiencies: character.equipmentProficiencies,
    created: new Date(),
    modified: new Date()
  };
  
  await saveEntity(characterEntity);
  await setActiveEntity(character.id);
}

export async function loadCharacter(): Promise<DNDCharacter | null> {
  const entity = await loadActiveEntity();
  if (!entity || entity.type !== 'character') {
    return null;
  }
  
  // Convert back to old character format
  const character = entity as CharacterEntity;
  return {
    id: character.id,
    name: character.name,
    level: character.level,
    class: character.class,
    race: character.race,
    background: character.background,
    abilityScores: character.abilityScores,
    skills: character.skills,
    savingThrows: character.savingThrows,
    hitPoints: character.hitPoints,
    armorClass: character.armorClass,
    initiative: character.initiative,
    speed: character.speed,
    proficiencyBonus: character.proficiencyBonus,
    equipment: character.equipment,
    spells: character.spells,
    features: character.features,
    languages: character.languages,
    alignment: character.alignment,
    experiencePoints: character.experiencePoints,
    notes: character.notes,
    inventory: character.inventory,
    equipmentProficiencies: character.equipmentProficiencies
  };
}

export async function deleteCharacter(): Promise<void> {
  const entity = await loadActiveEntity();
  if (entity) {
    await deleteEntity(entity.id);
  }
}

export async function characterExists(): Promise<boolean> {
  const entity = await loadActiveEntity();
  return entity !== null && entity.type === 'character';
}
