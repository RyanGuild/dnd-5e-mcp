import { WIZARD_SPELLS } from '../data/wizard-spells';
import { CLERIC_SPELLS } from '../data/cleric-spells';
import { CLERIC_PROGRESSION, calculateSpellsPrepared } from '../data/cleric';

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevel?: string;
  ritual?: boolean;
  concentration?: boolean;
}

export interface SpellSlots {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
  level9: number;
}

export interface PreparedSpells {
  cantrips: string[];
  level1: string[];
  level2: string[];
  level3: string[];
  level4: string[];
  level5: string[];
  level6: string[];
  level7: string[];
  level8: string[];
  level9: string[];
}

export interface KnownSpells {
  cantrips: string[];
  level1: string[];
  level2: string[];
  level3: string[];
  level4: string[];
  level5: string[];
  level6: string[];
  level7: string[];
  level8: string[];
  level9: string[];
}

export interface Spellbook {
  cantrips: Spell[];
  level1: Spell[];
  level2: Spell[];
  level3: Spell[];
  level4: Spell[];
  level5: Spell[];
  level6: Spell[];
  level7: Spell[];
  level8: Spell[];
  level9: Spell[];
}

// Caster Types
export type CasterType = 'wizard' | 'cleric' | 'sorcerer' | 'druid' | 'bard' | 'paladin' | 'ranger' | 'warlock';

export interface CasterConfig {
  type: CasterType;
  spellcastingAbility: 'intelligence' | 'wisdom' | 'charisma';
  casterType: 'full' | 'half' | 'third' | 'pact';
  domainSpells?: { [level: number]: string[] };
  knownSpellsLimit?: boolean; // true for wizards, false for clerics/druids
}

// D&D 5e Wizard Spell Slots Table
export const WIZARD_SPELL_SLOTS: { [level: number]: SpellSlots } = {
  1: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  2: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  3: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  4: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  5: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  6: { level1: 4, level2: 3, level3: 3, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  7: { level1: 4, level2: 3, level3: 3, level4: 1, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  8: { level1: 4, level2: 3, level3: 3, level4: 2, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  9: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 1, level6: 0, level7: 0, level8: 0, level9: 0 },
  10: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 0, level7: 0, level8: 0, level9: 0 },
  11: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  12: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  13: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  14: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  15: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  16: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  17: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 1 },
  18: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 1, level7: 1, level8: 1, level9: 1 },
  19: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 1, level8: 1, level9: 1 },
  20: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 2, level8: 1, level9: 1 }
};

// D&D 5e Cleric Spell Slots Table
export const CLERIC_SPELL_SLOTS: { [level: number]: SpellSlots } = {
  1: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  2: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  3: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  4: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  5: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  6: { level1: 4, level2: 3, level3: 3, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  7: { level1: 4, level2: 3, level3: 3, level4: 1, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  8: { level1: 4, level2: 3, level3: 3, level4: 2, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  9: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 1, level6: 0, level7: 0, level8: 0, level9: 0 },
  10: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 0, level7: 0, level8: 0, level9: 0 },
  11: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  12: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  13: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  14: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  15: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  16: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  17: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 1 },
  18: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 1, level7: 1, level8: 1, level9: 1 },
  19: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 1, level8: 1, level9: 1 },
  20: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 2, level8: 1, level9: 1 }
};

// Helper function to get spell slots for different caster types
export function getSpellSlotsForCaster(casterType: 'full' | 'half' | 'third' | 'pact', level: number): SpellSlots {
  switch (casterType) {
    case 'full':
      return WIZARD_SPELL_SLOTS[level] || WIZARD_SPELL_SLOTS[20];
    case 'half':
      return CLERIC_SPELL_SLOTS[level] || CLERIC_SPELL_SLOTS[20];
    case 'third':
      // Third casters (like Sorcerer) have fewer slots
      const fullSlots = WIZARD_SPELL_SLOTS[level] || WIZARD_SPELL_SLOTS[20];
      return {
        level1: Math.max(0, fullSlots.level1 - 1),
        level2: fullSlots.level2,
        level3: Math.max(0, fullSlots.level3 - 1),
        level4: fullSlots.level4,
        level5: Math.max(0, fullSlots.level5 - 1),
        level6: fullSlots.level6,
        level7: Math.max(0, fullSlots.level7 - 1),
        level8: fullSlots.level8,
        level9: Math.max(0, fullSlots.level9 - 1)
      };
    case 'pact':
      // Warlock pact magic has different slot progression
      const pactSlots: { [level: number]: SpellSlots } = {
        1: { level1: 1, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        2: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        3: { level1: 0, level2: 2, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        4: { level1: 0, level2: 3, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        5: { level1: 0, level2: 0, level3: 2, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        6: { level1: 0, level2: 0, level3: 3, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        7: { level1: 0, level2: 0, level3: 0, level4: 2, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        8: { level1: 0, level2: 0, level3: 0, level4: 3, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
        9: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 2, level6: 0, level7: 0, level8: 0, level9: 0 },
        10: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 3, level6: 0, level7: 0, level8: 0, level9: 0 },
        11: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 2, level7: 0, level8: 0, level9: 0 },
        12: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 3, level7: 0, level8: 0, level9: 0 },
        13: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 2, level8: 0, level9: 0 },
        14: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 3, level8: 0, level9: 0 },
        15: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 2, level9: 0 },
        16: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 3, level9: 0 },
        17: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 2 },
        18: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 3 },
        19: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 3 },
        20: { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 3 }
      };
      return pactSlots[level] || pactSlots[20];
    default:
      return WIZARD_SPELL_SLOTS[level] || WIZARD_SPELL_SLOTS[20];
  }
}

// Wizard spell learning progression - cantrips known and spells learned per level
export const WIZARD_SPELL_LEARNING: { [level: number]: { cantripsKnown: number; spellsLearned: number } } = {
  1: { cantripsKnown: 3, spellsLearned: 6 }, // Start with 6 1st level spells
  2: { cantripsKnown: 3, spellsLearned: 2 },
  3: { cantripsKnown: 3, spellsLearned: 2 },
  4: { cantripsKnown: 4, spellsLearned: 2 },
  5: { cantripsKnown: 4, spellsLearned: 2 },
  6: { cantripsKnown: 4, spellsLearned: 2 },
  7: { cantripsKnown: 4, spellsLearned: 2 },
  8: { cantripsKnown: 4, spellsLearned: 2 },
  9: { cantripsKnown: 4, spellsLearned: 2 },
  10: { cantripsKnown: 5, spellsLearned: 2 },
  11: { cantripsKnown: 5, spellsLearned: 2 },
  12: { cantripsKnown: 5, spellsLearned: 2 },
  13: { cantripsKnown: 5, spellsLearned: 2 },
  14: { cantripsKnown: 5, spellsLearned: 2 },
  15: { cantripsKnown: 5, spellsLearned: 2 },
  16: { cantripsKnown: 5, spellsLearned: 2 },
  17: { cantripsKnown: 5, spellsLearned: 2 },
  18: { cantripsKnown: 5, spellsLearned: 2 },
  19: { cantripsKnown: 5, spellsLearned: 2 },
  20: { cantripsKnown: 5, spellsLearned: 2 }
};

export class SpellManager {
  private spellbook: Spellbook; // Full spell database
  private knownSpells: KnownSpells; // Spells the character knows (for wizards) or can access (for clerics/druids)
  private preparedSpells: PreparedSpells;
  private currentSlots: SpellSlots;
  private maxSlots: SpellSlots;
  private characterLevel: number;
  private casterConfig: CasterConfig;

  constructor(characterLevel: number, casterConfig: CasterConfig, existingKnownSpells?: KnownSpells) {
    this.characterLevel = characterLevel;
    this.casterConfig = casterConfig;

    // Level 0 casters have no spell slots
    if (characterLevel === 0) {
      this.maxSlots = {
        level1: 0, level2: 0, level3: 0, level4: 0, level5: 0,
        level6: 0, level7: 0, level8: 0, level9: 0
      };
    } else {
      this.maxSlots = getSpellSlotsForCaster(casterConfig.casterType, characterLevel);
    }

    this.currentSlots = { ...this.maxSlots };

    // Initialize spellbook based on caster type
    this.spellbook = this.initializeSpellbook();

    // Initialize known spells
    if (existingKnownSpells) {
      this.knownSpells = { ...existingKnownSpells };
    } else {
      this.knownSpells = this.initializeStartingSpells();
    }

    this.preparedSpells = {
      cantrips: [],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      level6: [],
      level7: [],
      level8: [],
      level9: []
    };

    // Add domain spells to prepared spells for clerics
    if (casterConfig.domainSpells) {
      this.addDomainSpellsToPrepared();
    }
  }

  private initializeSpellbook(): Spellbook {
    switch (this.casterConfig.type) {
      case 'wizard':
        return { ...WIZARD_SPELLS };
      case 'cleric':
        return { ...CLERIC_SPELLS };
      case 'sorcerer':
        // For now, use wizard spells (sorcerers have similar spell lists)
        return { ...WIZARD_SPELLS };
      case 'druid':
        // For now, use cleric spells (druids have similar divine magic)
        return { ...CLERIC_SPELLS };
      case 'bard':
        // For now, use wizard spells (bards have similar spell lists)
        return { ...WIZARD_SPELLS };
      case 'paladin':
        // For now, use cleric spells (paladins have divine magic)
        return { ...CLERIC_SPELLS };
      case 'ranger':
        // For now, use wizard spells (rangers have similar spell lists)
        return { ...WIZARD_SPELLS };
      case 'warlock':
        // For now, use wizard spells (warlocks have similar spell lists)
        return { ...WIZARD_SPELLS };
      default:
        return { ...WIZARD_SPELLS };
    }
  }

  // Initialize starting spells for different caster types
  private initializeStartingSpells(): KnownSpells {
    const knownSpells: KnownSpells = {
      cantrips: [],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      level6: [],
      level7: [],
      level8: [],
      level9: []
    };

    if (this.characterLevel >= 1) {
      switch (this.casterConfig.type) {
        case 'wizard':
          this.initializeWizardSpells(knownSpells);
          break;
        case 'cleric':
          this.initializeClericSpells(knownSpells);
          break;
        case 'sorcerer':
          this.initializeSorcererSpells(knownSpells);
          break;
        case 'druid':
          this.initializeDruidSpells(knownSpells);
          break;
        case 'bard':
          this.initializeBardSpells(knownSpells);
          break;
        case 'paladin':
          this.initializePaladinSpells(knownSpells);
          break;
        case 'ranger':
          this.initializeRangerSpells(knownSpells);
          break;
        case 'warlock':
          this.initializeWarlockSpells(knownSpells);
          break;
        default:
          this.initializeWizardSpells(knownSpells);
      }
    }

    return knownSpells;
  }

  private initializeWizardSpells(knownSpells: KnownSpells): void {
    const progression = WIZARD_SPELL_LEARNING[1];

    // Start with cantrips
    const cantripsToKnow = Math.min(progression.cantripsKnown, this.spellbook.cantrips.length);
    for (let i = 0; i < cantripsToKnow && i < this.spellbook.cantrips.length; i++) {
      knownSpells.cantrips.push(this.spellbook.cantrips[i].name);
    }

    // Start with 1st level spells
    const spellsToKnow = Math.min(progression.spellsLearned, this.spellbook.level1.length);
    for (let i = 0; i < spellsToKnow && i < this.spellbook.level1.length; i++) {
      knownSpells.level1.push(this.spellbook.level1[i].name);
    }
  }

  private initializeClericSpells(knownSpells: KnownSpells): void {
    // Clerics don't have "known" spells - they can access all spells in their spellbook
    // They prepare spells instead
    // For initialization, we'll leave knownSpells empty since clerics prepare from the full list
  }

  private initializeSorcererSpells(knownSpells: KnownSpells): void {
    // Sorcerers start with 4 cantrips and 2 1st level spells
    const cantripsToKnow = Math.min(4, this.spellbook.cantrips.length);
    for (let i = 0; i < cantripsToKnow && i < this.spellbook.cantrips.length; i++) {
      knownSpells.cantrips.push(this.spellbook.cantrips[i].name);
    }

    const spellsToKnow = Math.min(2, this.spellbook.level1.length);
    for (let i = 0; i < spellsToKnow && i < this.spellbook.level1.length; i++) {
      knownSpells.level1.push(this.spellbook.level1[i].name);
    }
  }

  private initializeDruidSpells(knownSpells: KnownSpells): void {
    // Druids start with 2 cantrips and prepare spells like clerics
    const cantripsToKnow = Math.min(2, this.spellbook.cantrips.length);
    for (let i = 0; i < cantripsToKnow && i < this.spellbook.cantrips.length; i++) {
      knownSpells.cantrips.push(this.spellbook.cantrips[i].name);
    }
  }

  private initializeBardSpells(knownSpells: KnownSpells): void {
    // Bards start with 2 cantrips and know spells like wizards
    const cantripsToKnow = Math.min(2, this.spellbook.cantrips.length);
    for (let i = 0; i < cantripsToKnow && i < this.spellbook.cantrips.length; i++) {
      knownSpells.cantrips.push(this.spellbook.cantrips[i].name);
    }

    const spellsToKnow = Math.min(4, this.spellbook.level1.length);
    for (let i = 0; i < spellsToKnow && i < this.spellbook.level1.length; i++) {
      knownSpells.level1.push(this.spellbook.level1[i].name);
    }
  }

  private initializePaladinSpells(knownSpells: KnownSpells): void {
    // Paladins prepare spells like clerics
    // For now, leave empty
  }

  private initializeRangerSpells(knownSpells: KnownSpells): void {
    // Rangers prepare spells like clerics but have limited spell access
    // For now, leave empty
  }

  private initializeWarlockSpells(knownSpells: KnownSpells): void {
    // Warlocks start with 2 cantrips and know spells
    const cantripsToKnow = Math.min(2, this.spellbook.cantrips.length);
    for (let i = 0; i < cantripsToKnow && i < this.spellbook.cantrips.length; i++) {
      knownSpells.cantrips.push(this.spellbook.cantrips[i].name);
    }

    const spellsToKnow = Math.min(2, this.spellbook.level1.length);
    for (let i = 0; i < spellsToKnow && i < this.spellbook.level1.length; i++) {
      knownSpells.level1.push(this.spellbook.level1[i].name);
    }
  }

  // Add domain spells to prepared spells (they don't count against the limit)
  private addDomainSpellsToPrepared(): void {
    if (!this.casterConfig.domainSpells) return;

    for (const [levelStr, spells] of Object.entries(this.casterConfig.domainSpells)) {
      const level = parseInt(levelStr);
      if (level <= this.characterLevel) {
        const levelKey = `level${level}` as keyof PreparedSpells;
        // Domain spells are always prepared and don't count against the limit
        spells.forEach(spellName => {
          if (!this.preparedSpells[levelKey].includes(spellName)) {
            this.preparedSpells[levelKey].push(spellName);
          }
        });
      }
    }
  }

  // Get available spell slots for a specific level
  getAvailableSlots(level: number): number {
    const slotKey = `level${level}` as keyof SpellSlots;
    return this.currentSlots[slotKey];
  }

  // Get maximum spell slots for a specific level
  getMaxSlotsForLevel(level: number): number {
    const slotKey = `level${level}` as keyof SpellSlots;
    return this.maxSlots[slotKey];
  }

  // Get all current spell slots
  getCurrentSlots(): SpellSlots {
    return { ...this.currentSlots };
  }

  // Get all maximum spell slots
  getMaxSlots(): SpellSlots {
    return { ...this.maxSlots };
  }

  // Cast a spell (expend a spell slot)
  castSpell(level: number): boolean {
    // Cantrips don't consume spell slots
    if (level === 0) {
      return true;
    }
    
    const slotKey = `level${level}` as keyof SpellSlots;
    if (this.currentSlots[slotKey] > 0) {
      this.currentSlots[slotKey]--;
      return true;
    }
    return false;
  }

  // Restore all spell slots (long rest)
  restoreAllSlots(): void {
    this.currentSlots = { ...this.maxSlots };
  }

  // Restore specific spell slot
  restoreSlot(level: number): void {
    const slotKey = `level${level}` as keyof SpellSlots;
    if (this.currentSlots[slotKey] < this.maxSlots[slotKey]) {
      this.currentSlots[slotKey]++;
    }
  }

  // Get spells available for preparation (varies by caster type)
  getAvailableSpells(level: number): Spell[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof Spellbook;

    switch (this.casterConfig.type) {
      case 'wizard':
      case 'sorcerer':
      case 'bard':
      case 'warlock':
        // These casters have "known" spells
        const knownSpellNames = this.knownSpells[levelKey] || [];
        const allSpellsAtLevel = this.spellbook[levelKey] || [];
        return allSpellsAtLevel.filter(spell => knownSpellNames.includes(spell.name));

      case 'cleric':
      case 'druid':
      case 'paladin':
      case 'ranger':
        // These casters prepare from the full spellbook
        return this.spellbook[levelKey] || [];

      default:
        return this.spellbook[levelKey] || [];
    }
  }

  // Prepare spells (behavior varies by caster type)
  prepareSpells(spellNames: string[], level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof PreparedSpells;

    switch (this.casterConfig.type) {
      case 'wizard':
        return this.prepareSpellsAsWizard(spellNames, level, levelKey);
      case 'cleric':
        return this.prepareSpellsAsCleric(spellNames, level, levelKey);
      case 'druid':
        return this.prepareSpellsAsDruid(spellNames, level, levelKey);
      case 'paladin':
        return this.prepareSpellsAsPaladin(spellNames, level, levelKey);
      case 'ranger':
        return this.prepareSpellsAsRanger(spellNames, level, levelKey);
      default:
        // For sorcerer, bard, warlock - they don't prepare spells, they know them
        return false;
    }
  }

  private prepareSpellsAsWizard(spellNames: string[], level: number, levelKey: keyof PreparedSpells): boolean {
    // For wizard preparation, we need to get the ability modifier from somewhere
    // This will need to be passed in from the character
    const spellcastingModifier = 0; // Placeholder - will be updated when character integration is complete
    const maxPrepared = spellcastingModifier + this.characterLevel;
    const knownSpellNames = this.knownSpells[levelKey] || [];

    // Check if all spells are known by the wizard
    const validSpells = spellNames.filter(name => knownSpellNames.includes(name));

    if (validSpells.length !== spellNames.length) {
      return false; // Some spells not known by the wizard
    }

    // For cantrips, all known cantrips can be prepared
    if (level === 0) {
      this.preparedSpells[levelKey] = validSpells;
      return true;
    }

    // For other levels, check if total prepared spells don't exceed limit
    const totalPrepared = Object.values(this.preparedSpells)
      .filter((spells, index) => index > 0) // Exclude cantrips
      .flat()
      .length;

    if (totalPrepared + validSpells.length > maxPrepared) {
      return false; // Would exceed preparation limit
    }

    this.preparedSpells[levelKey] = validSpells;
    return true;
  }

  private prepareSpellsAsCleric(spellNames: string[], level: number, levelKey: keyof PreparedSpells): boolean {
    const spellcastingModifier = this.getSpellcastingModifier();
    const maxPrepared = calculateSpellsPrepared(this.characterLevel, spellcastingModifier);
    const availableSpells = this.getAvailableSpells(level);

    // Check if all spells exist in spellbook
    const validSpells = spellNames.filter(name =>
      availableSpells.some(spell => spell.name === name)
    );

    if (validSpells.length !== spellNames.length) {
      return false; // Some spells not found
    }

    // For cantrips, check against cantrips known limit
    if (level === 0) {
      const cantripsKnown = CLERIC_PROGRESSION[this.characterLevel]?.cantripsKnown || 3;
      if (validSpells.length <= cantripsKnown) {
        this.preparedSpells[levelKey] = validSpells;
        return true;
      }
      return false;
    }

    // For other levels, check if total prepared spells don't exceed limit
    // (excluding domain spells which are always prepared)
    const currentPrepared = this.getCurrentPreparedCount();
    const domainSpellsAtLevel = this.casterConfig.domainSpells?.[level] || [];
    const currentAtLevel = this.preparedSpells[levelKey].filter(spell =>
      !domainSpellsAtLevel.includes(spell)
    );

    const newNonDomainSpells = validSpells.filter(spell =>
      !domainSpellsAtLevel.includes(spell)
    );

    const newTotal = currentPrepared - currentAtLevel.length + newNonDomainSpells.length;

    if (newTotal <= maxPrepared) {
      // Keep domain spells and add new spells
      const domainSpellsToKeep = this.preparedSpells[levelKey].filter(spell =>
        domainSpellsAtLevel.includes(spell)
      );
      this.preparedSpells[levelKey] = [...domainSpellsToKeep, ...validSpells];
      return true;
    }

    return false;
  }

  private prepareSpellsAsDruid(spellNames: string[], level: number, levelKey: keyof PreparedSpells): boolean {
    // Druids prepare spells similar to clerics
    return this.prepareSpellsAsCleric(spellNames, level, levelKey);
  }

  private prepareSpellsAsPaladin(spellNames: string[], level: number, levelKey: keyof PreparedSpells): boolean {
    // Paladins prepare spells similar to clerics but have different limits
    const spellcastingModifier = this.getSpellcastingModifier();
    const paladinPreparedLimit = Math.max(1, spellcastingModifier + Math.floor(this.characterLevel / 2));
    const availableSpells = this.getAvailableSpells(level);

    // Check if all spells exist in spellbook
    const validSpells = spellNames.filter(name =>
      availableSpells.some(spell => spell.name === name)
    );

    if (validSpells.length !== spellNames.length) {
      return false; // Some spells not found
    }

    // For cantrips, limited number
    if (level === 0) {
      if (validSpells.length <= 2) { // Paladins know 2 cantrips
        this.preparedSpells[levelKey] = validSpells;
        return true;
      }
      return false;
    }

    // For other levels, check prepared limit
    const currentPrepared = Object.values(this.preparedSpells)
      .filter((spells, index) => index > 0) // Exclude cantrips
      .flat()
      .length;

    if (currentPrepared + validSpells.length <= paladinPreparedLimit) {
      this.preparedSpells[levelKey] = validSpells;
      return true;
    }

    return false;
  }

  private prepareSpellsAsRanger(spellNames: string[], level: number, levelKey: keyof PreparedSpells): boolean {
    // Rangers prepare spells similar to paladins
    return this.prepareSpellsAsPaladin(spellNames, level, levelKey);
  }

  private getCurrentPreparedCount(): number {
    let count = 0;
    for (let level = 1; level <= 9; level++) {
      const levelKey = `level${level}` as keyof PreparedSpells;
      const prepared = this.preparedSpells[levelKey];
      const domainSpellsAtLevel = this.casterConfig.domainSpells?.[level] || [];

      // Count only non-domain spells
      const nonDomainSpells = prepared.filter(spell => !domainSpellsAtLevel.includes(spell));
      count += nonDomainSpells.length;
    }
    return count;
  }

  // Get prepared spells for a specific level
  getPreparedSpells(level: number): string[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof PreparedSpells;
    return [...this.preparedSpells[levelKey]];
  }

  // Get all prepared spells
  getAllPreparedSpells(): PreparedSpells {
    return { ...this.preparedSpells };
  }

  // Search for spells by name or school
  searchSpells(query: string, level?: number): Spell[] {
    const searchLevel = level !== undefined ? level : -1;
    const results: Spell[] = [];

    Object.entries(this.spellbook).forEach(([levelKey, spells]) => {
      if (searchLevel !== -1) {
        const levelNum = levelKey === 'cantrips' ? 0 : parseInt(levelKey.replace('level', ''));
        if (levelNum !== searchLevel) return;
      }

      spells.forEach((spell: Spell) => {
        if (spell.name.toLowerCase().includes(query.toLowerCase()) ||
            spell.school.toLowerCase().includes(query.toLowerCase()) ||
            spell.description.toLowerCase().includes(query.toLowerCase())) {
          results.push(spell);
        }
      });
    });

    return results;
  }

  // Get spell details by name
  getSpellDetails(spellName: string): Spell | undefined {
    for (const spells of Object.values(this.spellbook)) {
      const spell = spells.find((s: Spell) => s.name.toLowerCase() === spellName.toLowerCase());
      if (spell) return spell;
    }
    return undefined;
  }

  // Get known spells for a specific level
  getKnownSpells(level: number): string[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    return [...this.knownSpells[levelKey]];
  }

  // Get all known spells
  getAllKnownSpells(): KnownSpells {
    return { ...this.knownSpells };
  }

  // Learn a new spell (behavior varies by caster type)
  learnSpell(spellName: string, level: number): boolean {
    switch (this.casterConfig.type) {
      case 'wizard':
        return this.learnSpellAsWizard(spellName, level);
      case 'sorcerer':
        return this.learnSpellAsSorcerer(spellName, level);
      case 'bard':
        return this.learnSpellAsBard(spellName, level);
      case 'warlock':
        return this.learnSpellAsWarlock(spellName, level);
      default:
        // Clerics, druids, paladins, rangers don't "learn" spells - they prepare them
        return false;
    }
  }

  private learnSpellAsWizard(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    const allSpellsAtLevel = this.spellbook[levelKey] || [];

    // Check if spell exists in the spellbook
    const spellExists = allSpellsAtLevel.some(spell => spell.name === spellName);
    if (!spellExists) {
      return false; // Spell doesn't exist in spellbook
    }

    // Check if already known
    if (this.knownSpells[levelKey].includes(spellName)) {
      return false; // Already known
    }

    // Wizard-specific learning restrictions
    if (level > 0) {
      // Can only learn spells up to the highest level you can cast
      const maxSpellLevel = this.getMaxCastableSpellLevel();
      if (level > maxSpellLevel) {
        return false; // Spell level too high for character level
      }
    }

    // For cantrips, check against cantrips known limit
    if (level === 0) {
      const progression = WIZARD_SPELL_LEARNING[this.characterLevel];
      if (this.knownSpells.cantrips.length >= progression.cantripsKnown) {
        return false; // Would exceed cantrips known limit
      }
    }

    // Learn the spell
    this.knownSpells[levelKey].push(spellName);
    return true;
  }

  private learnSpellAsSorcerer(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    const allSpellsAtLevel = this.spellbook[levelKey] || [];

    // Check if spell exists in the spellbook
    const spellExists = allSpellsAtLevel.some(spell => spell.name === spellName);
    if (!spellExists) {
      return false; // Spell doesn't exist in spellbook
    }

    // Check if already known
    if (this.knownSpells[levelKey].includes(spellName)) {
      return false; // Already known
    }

    // Sorcerers can learn spells up to certain levels based on character level
    if (level > 0) {
      const maxSpellLevel = Math.min(9, Math.ceil(this.characterLevel / 2));
      if (level > maxSpellLevel) {
        return false;
      }
    }

    // Sorcerers have limits on cantrips and spells known
    if (level === 0) {
      const cantripsKnown = Math.floor((this.characterLevel + 1) / 2) + 3; // 4 at level 1, up to 8 at level 20
      if (this.knownSpells.cantrips.length >= cantripsKnown) {
        return false;
      }
    } else {
      const spellsKnown = Math.floor(this.characterLevel / 2) + 1; // 2 at level 1, up to 16 at level 20
      const totalSpells = Object.values(this.knownSpells).filter((spells, index) => index > 0).flat().length;
      if (totalSpells >= spellsKnown) {
        return false;
      }
    }

    this.knownSpells[levelKey].push(spellName);
    return true;
  }

  private learnSpellAsBard(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    const allSpellsAtLevel = this.spellbook[levelKey] || [];

    // Check if spell exists in the spellbook
    const spellExists = allSpellsAtLevel.some(spell => spell.name === spellName);
    if (!spellExists) {
      return false; // Spell doesn't exist in spellbook
    }

    // Check if already known
    if (this.knownSpells[levelKey].includes(spellName)) {
      return false; // Already known
    }

    // Bards learn spells up to certain levels
    if (level > 0) {
      const maxSpellLevel = Math.min(9, Math.ceil(this.characterLevel / 2));
      if (level > maxSpellLevel) {
        return false;
      }
    }

    this.knownSpells[levelKey].push(spellName);
    return true;
  }

  private learnSpellAsWarlock(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    const allSpellsAtLevel = this.spellbook[levelKey] || [];

    // Check if spell exists in the spellbook
    const spellExists = allSpellsAtLevel.some(spell => spell.name === spellName);
    if (!spellExists) {
      return false; // Spell doesn't exist in spellbook
    }

    // Check if already known
    if (this.knownSpells[levelKey].includes(spellName)) {
      return false; // Already known
    }

    // Warlocks have limited spells known
    if (level === 0) {
      // Warlocks know 2 cantrips
      if (this.knownSpells.cantrips.length >= 2) {
        return false;
      }
    } else {
      // Warlocks know spells equal to character level + 1
      const totalSpells = Object.values(this.knownSpells).filter((spells, index) => index > 0).flat().length;
      if (totalSpells >= this.characterLevel + 1) {
        return false;
      }
    }

    this.knownSpells[levelKey].push(spellName);
    return true;
  }

  // Get the maximum spell level the wizard can cast
  private getMaxCastableSpellLevel(): number {
    for (let level = 9; level >= 1; level--) {
      if (this.getMaxSlotsForLevel(level) > 0) {
        return level;
      }
    }
    return 0; // Only cantrips
  }

  // Learn multiple spells (useful for leveling up)
  learnSpells(spells: { name: string; level: number }[]): { learned: string[]; failed: string[] } {
    const learned: string[] = [];
    const failed: string[] = [];

    spells.forEach(({ name, level }) => {
      if (this.learnSpell(name, level)) {
        learned.push(name);
      } else {
        failed.push(name);
      }
    });

    return { learned, failed };
  }

  // Forget a spell (rare, but possible in some scenarios)
  forgetSpell(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof KnownSpells;
    const spellIndex = this.knownSpells[levelKey].indexOf(spellName);
    
    if (spellIndex === -1) {
      return false; // Spell not known
    }

    this.knownSpells[levelKey].splice(spellIndex, 1);
    
    // Also remove from prepared spells if it was prepared
    const preparedIndex = this.preparedSpells[levelKey].indexOf(spellName);
    if (preparedIndex !== -1) {
      this.preparedSpells[levelKey].splice(preparedIndex, 1);
    }

    return true;
  }

  // Get spells available to learn (spells in spellbook but not yet known)
  getAvailableToLearn(level: number): Spell[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof Spellbook;
    const allSpellsAtLevel = this.spellbook[levelKey] || [];
    const knownSpellNames = this.knownSpells[levelKey] || [];
    
    return allSpellsAtLevel.filter(spell => !knownSpellNames.includes(spell.name));
  }

  // Get wizard spell learning limits
  getSpellLearningLimits(): { cantripsKnown: number; cantripsMaximum: number; totalSpellsKnown: number } {
    const progression = WIZARD_SPELL_LEARNING[this.characterLevel] || WIZARD_SPELL_LEARNING[20];
    const totalKnown = Object.values(this.knownSpells)
      .filter((spells, index) => index > 0) // Exclude cantrips
      .flat()
      .length;
    
    return {
      cantripsKnown: this.knownSpells.cantrips.length,
      cantripsMaximum: progression.cantripsKnown,
      totalSpellsKnown: totalKnown
    };
  }

  // Level up the wizard and automatically learn spells
  levelUp(newLevel: number): { cantripsLearned: string[]; spellsLearned: string[]; errors: string[] } {
    const oldLevel = this.characterLevel;
    this.characterLevel = newLevel;
    
    // Update spell slots
    this.maxSlots = WIZARD_SPELL_SLOTS[newLevel] || WIZARD_SPELL_SLOTS[20];
    this.currentSlots = { ...this.maxSlots };
    
    const cantripsLearned: string[] = [];
    const spellsLearned: string[] = [];
    const errors: string[] = [];
    
    // Learn new cantrips if the progression allows it
    const oldProgression = WIZARD_SPELL_LEARNING[oldLevel] || WIZARD_SPELL_LEARNING[1];
    const newProgression = WIZARD_SPELL_LEARNING[newLevel] || WIZARD_SPELL_LEARNING[20];
    
    const newCantripsToLearn = newProgression.cantripsKnown - oldProgression.cantripsKnown;
    
    if (newCantripsToLearn > 0) {
      const availableCantrips = this.getAvailableToLearn(0);
      for (let i = 0; i < newCantripsToLearn && i < availableCantrips.length; i++) {
        if (this.learnSpell(availableCantrips[i].name, 0)) {
          cantripsLearned.push(availableCantrips[i].name);
        }
      }
    }
    
    // Learn 2 new spells for leveling up (if not level 1)
    if (newLevel > 1) {
      const maxSpellLevel = this.getMaxCastableSpellLevel();
      const availableSpells: { name: string; level: number }[] = [];
      
      // Collect all learnable spells up to max castable level
      for (let level = 1; level <= maxSpellLevel; level++) {
        const spellsAtLevel = this.getAvailableToLearn(level);
        spellsAtLevel.forEach(spell => {
          availableSpells.push({ name: spell.name, level });
        });
      }
      
      // Learn up to 2 spells
      const spellsToLearn = Math.min(2, availableSpells.length);
      for (let i = 0; i < spellsToLearn; i++) {
        const spell = availableSpells[i];
        if (this.learnSpell(spell.name, spell.level)) {
          spellsLearned.push(spell.name);
        } else {
          errors.push(`Failed to learn ${spell.name}`);
        }
      }
    }
    
    return { cantripsLearned, spellsLearned, errors };
  }

  // Add spell to spellbook (for custom spells or expanding the database)
  addSpellToSpellbook(spell: Spell): void {
    const levelKey = spell.level === 0 ? 'cantrips' : `level${spell.level}` as keyof Spellbook;
    if (!this.spellbook[levelKey].some(s => s.name === spell.name)) {
      this.spellbook[levelKey].push(spell);
    }
  }

  // Get spellcasting ability modifier (needs ability modifier passed in)
  getSpellcastingModifier(abilityModifier?: number): number {
    if (abilityModifier !== undefined) {
      return abilityModifier;
    }

    // This method now requires the ability modifier to be passed in
    // since the SpellManager no longer stores the ability modifier directly
    throw new Error('Ability modifier must be provided to getSpellcastingModifier');
  }

  // Get spell save DC (needs ability modifier passed in)
  getSpellSaveDC(abilityModifier: number): number {
    const proficiencyBonus = Math.ceil(this.characterLevel / 4) + 1;
    return 8 + abilityModifier + proficiencyBonus;
  }

  // Get spell attack bonus (needs ability modifier passed in)
  getSpellAttackBonus(abilityModifier: number): number {
    const proficiencyBonus = Math.ceil(this.characterLevel / 4) + 1;
    return abilityModifier + proficiencyBonus;
  }
}
