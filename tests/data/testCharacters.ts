import { DNDCharacter, AbilityScores } from '../../src/types/character';
import { CharacterInventory } from '../../src/types/equipment';

export const createTestAbilityScores = (
  str = 10, dex = 10, con = 10, int = 10, wis = 10, cha = 10
): AbilityScores => ({
  strength: { value: str, modifier: Math.floor((str - 10) / 2) },
  dexterity: { value: dex, modifier: Math.floor((dex - 10) / 2) },
  constitution: { value: con, modifier: Math.floor((con - 10) / 2) },
  intelligence: { value: int, modifier: Math.floor((int - 10) / 2) },
  wisdom: { value: wis, modifier: Math.floor((wis - 10) / 2) },
  charisma: { value: cha, modifier: Math.floor((cha - 10) / 2) },
});

export const createEmptyInventory = (): CharacterInventory => ({
  items: [],
  maxWeight: 150, // Default carrying capacity
  currentWeight: 0,
  currency: {
    platinum: 0,
    gold: 0,
    silver: 0,
    copper: 0,
  },
});

// Test Character 1: Human Fighter - Classic tank build
export const testFighter: Partial<DNDCharacter> = {
  name: "Sir Gareth Ironshield",
  level: 5,
  class: { name: "Fighter", level: 5, hitDie: 10 },
  race: { name: "Human", size: "Medium", speed: 30, traits: ["Extra Language", "Extra Skill"] },
  background: {
    name: "Soldier",
    skillProficiencies: ["Athletics", "Intimidation"],
    languages: ["Common", "Orc"],
    equipment: ["Insignia of rank", "Trophy", "Deck of cards", "Common clothes"],
    feature: "Military Rank"
  },
  abilityScores: createTestAbilityScores(16, 14, 15, 12, 13, 10),
  alignment: "Lawful Good",
  experiencePoints: 6500,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["All armor", "Shields", "Simple weapons", "Martial weapons"],
};

// Test Character 2: Elf Wizard - Spellcaster build
export const testWizard: Partial<DNDCharacter> = {
  name: "Elaria Moonweaver",
  level: 3,
  class: { name: "Wizard", level: 3, hitDie: 6, spellcastingAbility: "intelligence" },
  race: { name: "High Elf", size: "Medium", speed: 30, traits: ["Darkvision", "Fey Ancestry", "Keen Senses"] },
  background: {
    name: "Sage",
    skillProficiencies: ["Arcana", "History"],
    languages: ["Common", "Elvish", "Draconic"],
    equipment: ["Ink and quill", "Small knife", "Letter", "Common clothes"],
    feature: "Researcher"
  },
  abilityScores: createTestAbilityScores(8, 14, 13, 16, 12, 11),
  alignment: "Chaotic Neutral",
  experiencePoints: 900,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
};

// Test Character 3: Halfling Rogue - Skill monkey build
export const testRogue: Partial<DNDCharacter> = {
  name: "Finn Lightfingers",
  level: 4,
  class: { name: "Rogue", level: 4, hitDie: 8 },
  race: { name: "Lightfoot Halfling", size: "Small", speed: 25, traits: ["Lucky", "Brave", "Halfling Nimbleness", "Naturally Stealthy"] },
  background: {
    name: "Criminal",
    skillProficiencies: ["Deception", "Stealth"],
    languages: ["Common", "Halfling", "Thieves' Cant"],
    equipment: ["Crowbar", "Dark common clothes", "Belt pouch"],
    feature: "Criminal Contact"
  },
  abilityScores: createTestAbilityScores(10, 17, 14, 13, 12, 15),
  alignment: "Chaotic Neutral",
  experiencePoints: 2700,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["Light armor", "Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
};

// Test Character 4: Dragonborn Paladin - Divine warrior
export const testPaladin: Partial<DNDCharacter> = {
  name: "Bahamut Goldscale",
  level: 2,
  class: { name: "Paladin", level: 2, hitDie: 10, spellcastingAbility: "charisma" },
  race: { name: "Gold Dragonborn", size: "Medium", speed: 30, traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"] },
  background: {
    name: "Noble",
    skillProficiencies: ["History", "Persuasion"],
    languages: ["Common", "Draconic"],
    equipment: ["Signet ring", "Scroll of pedigree", "Fine clothes"],
    feature: "Position of Privilege"
  },
  abilityScores: createTestAbilityScores(15, 10, 14, 11, 12, 16),
  alignment: "Lawful Good",
  experiencePoints: 300,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["All armor", "Shields", "Simple weapons", "Martial weapons"],
};

// Test Character 5: Dwarf Cleric - Divine spellcaster
export const testCleric: Partial<DNDCharacter> = {
  name: "Thorin Stonebeard",
  level: 6,
  class: { name: "Cleric", level: 6, hitDie: 8, spellcastingAbility: "wisdom" },
  race: { name: "Mountain Dwarf", size: "Medium", speed: 25, traits: ["Darkvision", "Dwarven Resilience", "Stonecunning", "Armor Proficiency"] },
  background: {
    name: "Acolyte",
    skillProficiencies: ["Insight", "Religion"],
    languages: ["Common", "Dwarvish", "Celestial"],
    equipment: ["Holy symbol", "Prayer book", "Incense", "Vestments"],
    feature: "Shelter of the Faithful"
  },
  abilityScores: createTestAbilityScores(14, 10, 15, 12, 16, 13),
  alignment: "Lawful Good",
  experiencePoints: 14000,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["Light armor", "Medium armor", "Shields", "Simple weapons"],
};

// Test Character 6: Tiefling Warlock - Otherworldly patron
export const testWarlock: Partial<DNDCharacter> = {
  name: "Zara Hellborn",
  level: 1,
  class: { name: "Warlock", level: 1, hitDie: 8, spellcastingAbility: "charisma" },
  race: { name: "Tiefling", size: "Medium", speed: 30, traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"] },
  background: {
    name: "Folk Hero",
    skillProficiencies: ["Animal Handling", "Survival"],
    languages: ["Common", "Infernal"],
    equipment: ["Smith's tools", "Shovel", "Artisan clothes"],
    feature: "Rustic Hospitality"
  },
  abilityScores: createTestAbilityScores(10, 13, 14, 12, 11, 16),
  alignment: "Chaotic Neutral",
  experiencePoints: 0,
  inventory: createEmptyInventory(),
  equipmentProficiencies: ["Light armor", "Simple weapons"],
};

// Edge case characters for testing validation
export const invalidCharacters = {
  // Character with invalid level (too high)
  invalidLevel: {
    ...testFighter,
    name: "Invalid Level Character",
    level: 25, // Max is 20
  },
  
  // Character with invalid ability scores (too low)
  invalidAbilityScores: {
    ...testWizard,
    name: "Invalid Ability Scores Character",
    abilityScores: createTestAbilityScores(1, 1, 1, 1, 1, 1), // All scores too low
  },
  
  // Character with missing required fields
  missingFields: {
    name: "Incomplete Character",
    // Missing most required fields
  },
  
  // Character with inconsistent data
  inconsistentData: {
    ...testRogue,
    name: "Inconsistent Character",
    level: 5,
    class: { name: "Rogue", level: 3, hitDie: 8 }, // Level mismatch
  },
};

// Helper function to create a complete character from partial data
export const createCompleteCharacter = (partial: Partial<DNDCharacter>): DNDCharacter => {
  const defaultCharacter: DNDCharacter = {
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: partial.name || "Test Character",
    level: partial.level || 1,
    class: partial.class || { name: "Fighter", level: 1, hitDie: 10 },
    race: partial.race || { name: "Human", size: "Medium", speed: 30, traits: [] },
    background: partial.background || {
      name: "Folk Hero",
      skillProficiencies: [],
      languages: ["Common"],
      equipment: [],
      feature: "Rustic Hospitality"
    },
    abilityScores: partial.abilityScores || createTestAbilityScores(),
    skills: partial.skills || [
      { name: "Acrobatics", ability: "dexterity", proficient: false, modifier: 0 },
      { name: "Animal Handling", ability: "wisdom", proficient: false, modifier: 0 },
      { name: "Arcana", ability: "intelligence", proficient: false, modifier: 0 },
      { name: "Athletics", ability: "strength", proficient: false, modifier: 0 },
      { name: "Deception", ability: "charisma", proficient: false, modifier: 0 },
      { name: "History", ability: "intelligence", proficient: false, modifier: 0 },
      { name: "Insight", ability: "wisdom", proficient: false, modifier: 0 },
      { name: "Intimidation", ability: "charisma", proficient: false, modifier: 0 },
      { name: "Investigation", ability: "intelligence", proficient: false, modifier: 0 },
      { name: "Medicine", ability: "wisdom", proficient: false, modifier: 0 },
      { name: "Nature", ability: "intelligence", proficient: false, modifier: 0 },
      { name: "Perception", ability: "wisdom", proficient: false, modifier: 0 },
      { name: "Performance", ability: "charisma", proficient: false, modifier: 0 },
      { name: "Persuasion", ability: "charisma", proficient: false, modifier: 0 },
      { name: "Religion", ability: "intelligence", proficient: false, modifier: 0 },
      { name: "Sleight of Hand", ability: "dexterity", proficient: false, modifier: 0 },
      { name: "Stealth", ability: "dexterity", proficient: false, modifier: 0 },
      { name: "Survival", ability: "wisdom", proficient: false, modifier: 0 },
    ],
    savingThrows: partial.savingThrows || [
      { ability: "strength", proficient: false, modifier: 0 },
      { ability: "dexterity", proficient: false, modifier: 0 },
      { ability: "constitution", proficient: false, modifier: 0 },
      { ability: "intelligence", proficient: false, modifier: 0 },
      { ability: "wisdom", proficient: false, modifier: 0 },
      { ability: "charisma", proficient: false, modifier: 0 },
    ],
    hitPoints: partial.hitPoints || { current: 10, maximum: 10, temporary: 0 },
    armorClass: partial.armorClass || 10,
    initiative: partial.initiative || 0,
    speed: partial.speed || 30,
    proficiencyBonus: partial.proficiencyBonus || Math.ceil((partial.level || 1) / 4) + 1,
    equipment: partial.equipment || [],
    spells: partial.spells || [],
    features: partial.features || [],
    languages: partial.languages || ["Common"],
    alignment: partial.alignment || "True Neutral",
    experiencePoints: partial.experiencePoints || 0,
    notes: partial.notes || "",
    inventory: partial.inventory || createEmptyInventory(),
    equipmentProficiencies: partial.equipmentProficiencies || [],
  };

  return { ...defaultCharacter, ...partial };
};

export const allTestCharacters = [
  testFighter,
  testWizard,
  testRogue,
  testPaladin,
  testCleric,
  testWarlock,
];