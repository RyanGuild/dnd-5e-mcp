import { v4 as uuidv4 } from 'uuid';
import { GameEntity, CharacterEntity, NPCEntity, MonsterEntity, EntityType, isCharacter, isNPC, isMonster } from '../types/entity.js';
import { DNDCharacter, AbilityScores } from '../types/character.js';
import { saveEntity, loadEntity, loadActiveEntity, setActiveEntity, deleteEntity, listEntities } from './storage.js';
import { calculateAbilityModifier } from './character.js';

export async function createCharacterEntity(characterData: {
  name: string;
  class: string;
  race: string;
  level?: number;
  abilityScores?: Partial<AbilityScores>;
}): Promise<CharacterEntity> {
  const id = uuidv4();
  const level = characterData.level || 1;
  
  // Default ability scores if not provided
  const abilityScores: AbilityScores = {
    strength: { value: characterData.abilityScores?.strength?.value || 10, modifier: 0 },
    dexterity: { value: characterData.abilityScores?.dexterity?.value || 10, modifier: 0 },
    constitution: { value: characterData.abilityScores?.constitution?.value || 10, modifier: 0 },
    intelligence: { value: characterData.abilityScores?.intelligence?.value || 10, modifier: 0 },
    wisdom: { value: characterData.abilityScores?.wisdom?.value || 10, modifier: 0 },
    charisma: { value: characterData.abilityScores?.charisma?.value || 10, modifier: 0 }
  };

  // Calculate modifiers
  Object.keys(abilityScores).forEach(key => {
    const ability = key as keyof AbilityScores;
    abilityScores[ability].modifier = calculateAbilityModifier(abilityScores[ability].value);
  });

  const character: CharacterEntity = {
    id,
    name: characterData.name,
    type: 'character',
    level,
    class: {
      name: characterData.class,
      level,
      hitDie: getHitDieForClass(characterData.class),
      spellcastingAbility: getSpellcastingAbilityForClass(characterData.class)
    },
    race: {
      name: characterData.race,
      size: getSizeForRace(characterData.race),
      speed: getSpeedForRace(characterData.race),
      traits: getTraitsForRace(characterData.race)
    },
    background: {
      name: 'Acolyte', // Default background
      skillProficiencies: ['Insight', 'Religion'],
      languages: ['Common'],
      equipment: [],
      feature: 'Shelter of the Faithful'
    },
    abilityScores,
    skills: [],
    savingThrows: [],
    hitPoints: {
      current: 0,
      maximum: 0,
      temporary: 0
    },
    armorClass: 10 + abilityScores.dexterity.modifier,
    initiative: abilityScores.dexterity.modifier,
    speed: getSpeedForRace(characterData.race),
    proficiencyBonus: Math.ceil(level / 4) + 1,
    equipment: [],
    spells: [],
    features: [],
    languages: ['Common'],
    alignment: 'Neutral',
    experiencePoints: 0,
    notes: '',
    inventory: { items: [], equipped: { weapons: [], armor: [], shield: null } },
    equipmentProficiencies: [],
    created: new Date(),
    modified: new Date()
  };

  // Calculate hit points
  const hitDie = getHitDieForClass(characterData.class);
  const conMod = abilityScores.constitution.modifier;
  character.hitPoints.maximum = hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
  character.hitPoints.current = character.hitPoints.maximum;

  await saveEntity(character);
  return character;
}

export async function createNPCEntity(npcData: {
  name: string;
  role: string;
  location: string;
  level?: number;
  abilityScores?: Partial<AbilityScores>;
}): Promise<NPCEntity> {
  const id = uuidv4();
  const level = npcData.level || 1;
  
  // Default ability scores if not provided
  const abilityScores: AbilityScores = {
    strength: { value: npcData.abilityScores?.strength?.value || 10, modifier: 0 },
    dexterity: { value: npcData.abilityScores?.dexterity?.value || 10, modifier: 0 },
    constitution: { value: npcData.abilityScores?.constitution?.value || 10, modifier: 0 },
    intelligence: { value: npcData.abilityScores?.intelligence?.value || 10, modifier: 0 },
    wisdom: { value: npcData.abilityScores?.wisdom?.value || 10, modifier: 0 },
    charisma: { value: npcData.abilityScores?.charisma?.value || 10, modifier: 0 }
  };

  // Calculate modifiers
  Object.keys(abilityScores).forEach(key => {
    const ability = key as keyof AbilityScores;
    abilityScores[ability].modifier = calculateAbilityModifier(abilityScores[ability].value);
  });

  const npc: NPCEntity = {
    id,
    name: npcData.name,
    type: 'npc',
    level,
    role: npcData.role,
    location: npcData.location,
    abilityScores,
    hitPoints: {
      current: 8 + abilityScores.constitution.modifier,
      maximum: 8 + abilityScores.constitution.modifier,
      temporary: 0
    },
    armorClass: 10 + abilityScores.dexterity.modifier,
    initiative: abilityScores.dexterity.modifier,
    speed: 30,
    personality: '',
    motivation: '',
    relationships: [],
    equipment: [],
    features: [],
    languages: ['Common'],
    alignment: 'Neutral',
    notes: '',
    created: new Date(),
    modified: new Date()
  };

  await saveEntity(npc);
  return npc;
}

export async function createMonsterEntity(monsterData: {
  name: string;
  challengeRating: number;
  creatureType: string;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
  abilityScores: AbilityScores;
  hitPoints: { maximum: number; hitDice: string };
  armorClass: number;
  speed: { walk: number; fly?: number; swim?: number; climb?: number; burrow?: number };
}): Promise<MonsterEntity> {
  const id = uuidv4();
  
  const monster: MonsterEntity = {
    id,
    name: monsterData.name,
    type: 'monster',
    challengeRating: monsterData.challengeRating,
    size: monsterData.size,
    creatureType: monsterData.creatureType,
    alignment: 'Unaligned',
    abilityScores: monsterData.abilityScores,
    hitPoints: {
      current: monsterData.hitPoints.maximum,
      maximum: monsterData.hitPoints.maximum,
      temporary: 0,
      hitDice: monsterData.hitPoints.hitDice
    },
    armorClass: monsterData.armorClass,
    initiative: monsterData.abilityScores.dexterity.modifier,
    speed: monsterData.speed,
    skills: [],
    savingThrows: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    senses: ['Darkvision 60 ft.'],
    languages: [],
    xp: getXPForChallengeRating(monsterData.challengeRating),
    traits: [],
    actions: [],
    notes: '',
    created: new Date(),
    modified: new Date()
  };

  await saveEntity(monster);
  return monster;
}

export async function getEntity(id: string): Promise<GameEntity | null> {
  return await loadEntity(id);
}

export async function getActiveEntity(): Promise<GameEntity | null> {
  return await loadActiveEntity();
}

export async function setActiveEntityById(id: string): Promise<void> {
  await setActiveEntity(id);
}

export async function deleteEntityById(id: string): Promise<void> {
  await deleteEntity(id);
}

export async function listAllEntities(): Promise<GameEntity[]> {
  return await listEntities();
}

export async function listEntitiesByType(type: EntityType): Promise<GameEntity[]> {
  return await listEntities(type);
}

export async function searchEntities(query: string): Promise<GameEntity[]> {
  const allEntities = await listAllEntities();
  const lowerQuery = query.toLowerCase();
  
  return allEntities.filter(entity => 
    entity.name.toLowerCase().includes(lowerQuery) ||
    entity.notes.toLowerCase().includes(lowerQuery) ||
    (isCharacter(entity) && entity.class.name.toLowerCase().includes(lowerQuery)) ||
    (isCharacter(entity) && entity.race.name.toLowerCase().includes(lowerQuery)) ||
    (isNPC(entity) && entity.role.toLowerCase().includes(lowerQuery)) ||
    (isMonster(entity) && entity.creatureType.toLowerCase().includes(lowerQuery))
  );
}

// Helper functions
function getHitDieForClass(className: string): number {
  const hitDieMap: { [key: string]: number } = {
    'Barbarian': 12,
    'Fighter': 10,
    'Paladin': 10,
    'Ranger': 10,
    'Cleric': 8,
    'Druid': 8,
    'Monk': 8,
    'Rogue': 8,
    'Warlock': 8,
    'Bard': 8,
    'Sorcerer': 6,
    'Wizard': 6
  };
  return hitDieMap[className] || 8;
}

function getSpellcastingAbilityForClass(className: string): keyof AbilityScores | undefined {
  const spellcastingMap: { [key: string]: keyof AbilityScores } = {
    'Bard': 'charisma',
    'Cleric': 'wisdom',
    'Druid': 'wisdom',
    'Paladin': 'charisma',
    'Ranger': 'wisdom',
    'Sorcerer': 'charisma',
    'Warlock': 'charisma',
    'Wizard': 'intelligence'
  };
  return spellcastingMap[className];
}

function getSizeForRace(raceName: string): 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan' {
  const sizeMap: { [key: string]: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan' } = {
    'Halfling': 'Small',
    'Gnome': 'Small',
    'Dwarf': 'Medium',
    'Elf': 'Medium',
    'Human': 'Medium',
    'Half-Elf': 'Medium',
    'Half-Orc': 'Medium',
    'Tiefling': 'Medium',
    'Dragonborn': 'Medium'
  };
  return sizeMap[raceName] || 'Medium';
}

function getSpeedForRace(raceName: string): number {
  const speedMap: { [key: string]: number } = {
    'Halfling': 25,
    'Dwarf': 25,
    'Gnome': 25,
    'Elf': 30,
    'Human': 30,
    'Half-Elf': 30,
    'Half-Orc': 30,
    'Tiefling': 30,
    'Dragonborn': 30
  };
  return speedMap[raceName] || 30;
}

function getTraitsForRace(raceName: string): string[] {
  const traitsMap: { [key: string]: string[] } = {
    'Human': ['Extra Language', 'Extra Skill'],
    'Elf': ['Darkvision', 'Fey Ancestry', 'Trance'],
    'Dwarf': ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
    'Halfling': ['Lucky', 'Brave', 'Nimble'],
    'Gnome': ['Darkvision', 'Gnome Cunning'],
    'Half-Elf': ['Darkvision', 'Fey Ancestry'],
    'Half-Orc': ['Darkvision', 'Relentless Endurance', 'Savage Attacks'],
    'Tiefling': ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
    'Dragonborn': ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance']
  };
  return traitsMap[raceName] || [];
}

function getXPForChallengeRating(cr: number): number {
  const xpMap: { [key: number]: number } = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000
  };
  return xpMap[cr] || 0;
}
