// Cleric Character Implementation with Divine Features

import { DNDCharacter } from '../types/character.js';
import { ClericSpellManager } from './cleric-spells.js';
import { 
  DIVINE_DOMAINS, 
  DivineDomain, 
  CLERIC_PROGRESSION, 
  CLERIC_PROFICIENCIES,
  getChannelDivinityUses,
  getDestroyUndeadCR
} from '../data/cleric.js';

export interface ClericCharacterData {
  character: DNDCharacter;
  domain: DivineDomain;
  spellManager: ClericSpellManager;
  channelDivinityUses: {
    current: number;
    maximum: number;
  };
  destroyUndeadCR: number;
  divineInterventionUsed: boolean;
}

export class ClericCharacter {
  private data: ClericCharacterData;

  constructor(character: DNDCharacter, domainName: string) {
    if (character.class.name !== 'Cleric') {
      throw new Error('Character must be a Cleric');
    }

    const domain = DIVINE_DOMAINS[domainName];
    if (!domain) {
      throw new Error(`Unknown divine domain: ${domainName}`);
    }

    const spellManager = new ClericSpellManager(
      character.level,
      character.abilityScores.wisdom.modifier,
      domain.domainSpells
    );

    this.data = {
      character,
      domain,
      spellManager,
      channelDivinityUses: {
        current: getChannelDivinityUses(character.level),
        maximum: getChannelDivinityUses(character.level)
      },
      destroyUndeadCR: getDestroyUndeadCR(character.level),
      divineInterventionUsed: false
    };

    // Add domain-specific proficiencies and features
    this.applyDomainBenefits();
  }

  // Apply domain-specific benefits to the character
  private applyDomainBenefits(): void {
    const level = this.data.character.level;
    const domain = this.data.domain;

    // Add domain features to character features
    for (const [featureLevel, features] of Object.entries(domain.features)) {
      const levelNum = parseInt(featureLevel);
      if (levelNum <= level) {
        features.forEach(feature => {
          const featureText = `${feature.name}: ${feature.description}`;
          if (!this.data.character.features.includes(featureText)) {
            this.data.character.features.push(featureText);
          }
        });
      }
    }

    // Apply domain-specific proficiencies
    this.applyDomainProficiencies();

    // Apply domain-specific ability bonuses
    this.applyDomainAbilities();
  }

  // Apply domain-specific proficiencies
  private applyDomainProficiencies(): void {
    const domain = this.data.domain;
    const character = this.data.character;

    // Life and War domains get heavy armor proficiency
    if (domain.name === 'Life' || domain.name === 'War' || domain.name === 'Tempest') {
      if (!character.equipmentProficiencies.includes('heavy')) {
        character.equipmentProficiencies.push('heavy');
      }
    }

    // War and Tempest domains get martial weapon proficiency
    if (domain.name === 'War' || domain.name === 'Tempest') {
      if (!character.equipmentProficiencies.includes('martial')) {
        character.equipmentProficiencies.push('martial');
      }
    }

    // Nature domain gets heavy armor proficiency
    if (domain.name === 'Nature') {
      if (!character.equipmentProficiencies.includes('heavy')) {
        character.equipmentProficiencies.push('heavy');
      }
    }
  }

  // Apply domain-specific abilities and skill proficiencies
  private applyDomainAbilities(): void {
    const domain = this.data.domain;
    const character = this.data.character;

    // Knowledge domain: Add language and skill proficiencies
    if (domain.name === 'Knowledge') {
      // This would typically be handled during character creation
      // Add two languages and two skills with expertise
    }

    // Nature domain: Add druid cantrip and skill proficiency
    if (domain.name === 'Nature') {
      // Add one druid cantrip and one skill proficiency
    }

    // Light domain: Add Light cantrip if not known
    if (domain.name === 'Light') {
      // Light cantrip is automatically known and doesn't count against cantrips known
    }
  }

  // Get character data
  getCharacter(): DNDCharacter {
    return this.data.character;
  }

  // Get domain information
  getDomain(): DivineDomain {
    return this.data.domain;
  }

  // Get spell manager
  getSpellManager(): ClericSpellManager {
    return this.data.spellManager;
  }

  // Get Channel Divinity information
  getChannelDivinityInfo(): {
    current: number;
    maximum: number;
    options: string[];
  } {
    const level = this.data.character.level;
    const options = ['Turn Undead'];
    
    // Add domain-specific Channel Divinity options
    this.data.domain.channelDivinityOptions.forEach(option => {
      if (option.level <= level) {
        options.push(option.name);
      }
    });

    return {
      current: this.data.channelDivinityUses.current,
      maximum: this.data.channelDivinityUses.maximum,
      options
    };
  }

  // Use Channel Divinity
  useChannelDivinity(): boolean {
    if (this.data.channelDivinityUses.current > 0) {
      this.data.channelDivinityUses.current--;
      return true;
    }
    return false;
  }

  // Restore Channel Divinity uses (short or long rest)
  restoreChannelDivinity(shortRest: boolean = false): void {
    // Channel Divinity recharges on short or long rest
    this.data.channelDivinityUses.current = this.data.channelDivinityUses.maximum;
  }

  // Get Destroy Undead CR threshold
  getDestroyUndeadCR(): number {
    return this.data.destroyUndeadCR;
  }

  // Attempt Divine Intervention
  attemptDivineIntervention(): { success: boolean; canUseAgain: boolean } {
    const level = this.data.character.level;
    
    if (level < 10) {
      return { success: false, canUseAgain: false };
    }

    if (this.data.divineInterventionUsed) {
      return { success: false, canUseAgain: false };
    }

    // Roll d100, success if roll is equal to or less than cleric level
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= level;

    if (success) {
      // At 20th level, Divine Intervention automatically succeeds
      this.data.divineInterventionUsed = true;
    }

    return { 
      success: success || level >= 20, 
      canUseAgain: !success && level < 20 
    };
  }

  // Reset Divine Intervention (long rest)
  resetDivineIntervention(): void {
    // Divine Intervention resets after 7 days if successful, or can be attempted again after long rest if failed
    this.data.divineInterventionUsed = false;
  }

  // Level up the cleric
  levelUp(newLevel: number): void {
    if (newLevel <= this.data.character.level || newLevel > 20) {
      throw new Error('Invalid level for level up');
    }

    const oldLevel = this.data.character.level;
    this.data.character.level = newLevel;
    this.data.character.class.level = newLevel;

    // Update proficiency bonus
    this.data.character.proficiencyBonus = Math.ceil(newLevel / 4) + 1;

    // Update spell manager
    this.data.spellManager.updateLevel(newLevel);

    // Update Channel Divinity uses
    this.data.channelDivinityUses.maximum = getChannelDivinityUses(newLevel);
    this.data.channelDivinityUses.current = this.data.channelDivinityUses.maximum;

    // Update Destroy Undead CR
    this.data.destroyUndeadCR = getDestroyUndeadCR(newLevel);

    // Add new features from progression
    const progression = CLERIC_PROGRESSION[newLevel];
    progression.features.forEach(feature => {
      if (!this.data.character.features.includes(feature)) {
        this.data.character.features.push(feature);
      }
    });

    // Apply new domain benefits
    this.applyDomainBenefits();

    console.log(`${this.data.character.name} leveled up to level ${newLevel}!`);
  }

  // Update Wisdom modifier (affects spellcasting)
  updateWisdomModifier(newModifier: number): void {
    this.data.character.abilityScores.wisdom.modifier = newModifier;
    this.data.spellManager.updateWisdomModifier(newModifier);
  }

  // Get class features for current level
  getClassFeatures(): string[] {
    const level = this.data.character.level;
    const features: string[] = [];

    // Add base cleric features
    features.push('Spellcasting (Wisdom-based)');
    features.push('Divine Domain: ' + this.data.domain.name);

    if (level >= 2) {
      features.push(`Channel Divinity (${this.data.channelDivinityUses.maximum}/rest)`);
    }

    if (level >= 5) {
      features.push(`Destroy Undead (CR ${this.data.destroyUndeadCR})`);
    }

    if (level >= 10) {
      features.push('Divine Intervention');
    }

    // Add domain-specific features
    for (const [featureLevel, domainFeatures] of Object.entries(this.data.domain.features)) {
      const levelNum = parseInt(featureLevel);
      if (levelNum <= level) {
        domainFeatures.forEach(feature => {
          features.push(`${feature.name} (${this.data.domain.name})`);
        });
      }
    }

    return features;
  }

  // Get spellcasting summary
  getSpellcastingSummary(): {
    spellcastingAbility: string;
    spellSaveDC: number;
    spellAttackBonus: number;
    cantripsKnown: number;
    spellsPrepared: number;
    maxSpellsPrepared: number;
  } {
    const spellManager = this.data.spellManager;
    const preparationSummary = spellManager.getPreparationSummary();

    return {
      spellcastingAbility: 'Wisdom',
      spellSaveDC: spellManager.getSpellSaveDC(),
      spellAttackBonus: spellManager.getSpellAttackBonus(),
      cantripsKnown: preparationSummary.cantripsKnown,
      spellsPrepared: preparationSummary.spellsPrepared,
      maxSpellsPrepared: preparationSummary.spellsMaximum
    };
  }

  // Get domain spells for display
  getDomainSpells(): { [level: number]: string[] } {
    return this.data.spellManager.getDomainSpells();
  }

  // Perform a short rest
  shortRest(): void {
    // Restore Channel Divinity
    this.restoreChannelDivinity(true);
  }

  // Perform a long rest
  longRest(): void {
    // Restore all spell slots
    this.data.spellManager.restoreAllSlots();
    
    // Restore Channel Divinity
    this.restoreChannelDivinity(false);
    
    // Reset Divine Intervention if it was used and failed
    // (Successful Divine Intervention requires 7 days)
    if (!this.data.divineInterventionUsed || this.data.character.level >= 20) {
      this.resetDivineIntervention();
    }
  }

  // Get available starting equipment for clerics
  static getStartingEquipment(): {
    weaponChoices: string[][];
    armorChoices: string[][];
    equipmentChoices: string[][];
    standardEquipment: string[];
  } {
    return {
      weaponChoices: [
        ['Mace'],
        ['Warhammer'] // if proficient
      ],
      armorChoices: [
        ['Scale Mail'],
        ['Leather Armor'],
        ['Chain Mail'] // if proficient
      ],
      equipmentChoices: [
        ['Light Crossbow', '20 Crossbow Bolts'],
        ['Any Simple Weapon']
      ],
      standardEquipment: [
        'Shield',
        'Holy Symbol',
        'Priest\'s Pack or Explorer\'s Pack'
      ]
    };
  }

  // Validate cleric character requirements
  static validateClericCharacter(character: DNDCharacter): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check class
    if (character.class.name !== 'Cleric') {
      errors.push('Character must be a Cleric');
    }

    // Check hit die
    if (character.class.hitDie !== 8) {
      errors.push('Cleric hit die must be d8');
    }

    // Check saving throw proficiencies
    const wisdomSave = character.savingThrows.find(st => st.ability === 'wisdom');
    const charismaSave = character.savingThrows.find(st => st.ability === 'charisma');
    
    if (!wisdomSave?.proficient) {
      errors.push('Clerics must be proficient in Wisdom saving throws');
    }
    
    if (!charismaSave?.proficient) {
      errors.push('Clerics must be proficient in Charisma saving throws');
    }

    // Check equipment proficiencies
    const requiredProficiencies = ['simple', 'light', 'medium', 'shield'];
    for (const prof of requiredProficiencies) {
      if (!character.equipmentProficiencies.includes(prof)) {
        errors.push(`Missing required proficiency: ${prof}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Helper function to create a new cleric character
export function createClericCharacter(
  characterData: Partial<DNDCharacter>,
  domainName: string
): ClericCharacter {
  // Ensure class is set to Cleric
  const clericData = {
    ...characterData,
    class: {
      name: 'Cleric',
      level: characterData.level || 1,
      hitDie: 8,
      spellcastingAbility: 'wisdom' as const
    }
  };

  // Create base character (this would use the existing createCharacter function)
  const character = {
    ...clericData,
    // Add cleric-specific defaults
    equipmentProficiencies: [...(characterData.equipmentProficiencies || []), ...CLERIC_PROFICIENCIES.armor, ...CLERIC_PROFICIENCIES.weapons]
  } as DNDCharacter;

  // Create and return cleric character
  return new ClericCharacter(character, domainName);
}