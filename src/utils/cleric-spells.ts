// Cleric Spellcasting Manager - Wisdom-based Divine Magic

import { Spell, SpellSlots, PreparedSpells, Spellbook } from './spells.js';
import { CLERIC_SPELLS } from '../data/cleric-spells.js';
import { CLERIC_PROGRESSION } from '../data/cleric.js';
import { calculateSpellsPrepared } from '../data/cleric.js';

export class ClericSpellManager {
  private spellbook: Spellbook;
  private preparedSpells: PreparedSpells;
  private currentSlots: SpellSlots;
  private maxSlots: SpellSlots;
  private characterLevel: number;
  private wisdomModifier: number;
  private domainSpells: { [level: number]: string[] };

  constructor(characterLevel: number, wisdomModifier: number, domainSpells: { [level: number]: string[] } = {}) {
    this.characterLevel = characterLevel;
    this.wisdomModifier = wisdomModifier;
    this.domainSpells = domainSpells;
    
    // Get spell slots from cleric progression
    const progression = CLERIC_PROGRESSION[characterLevel];
    this.maxSlots = progression.spellSlots;
    this.currentSlots = { ...this.maxSlots };
    
    // Initialize with cleric spell list
    this.spellbook = { ...CLERIC_SPELLS };
    
    // Initialize prepared spells
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
    
    // Add domain spells to prepared spells (always prepared)
    this.addDomainSpellsToPrepared();
  }

  // Add domain spells to prepared spells (they don't count against the limit)
  private addDomainSpellsToPrepared(): void {
    for (const [levelStr, spells] of Object.entries(this.domainSpells)) {
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

  // Get number of cantrips known
  getCantripsKnown(): number {
    const progression = CLERIC_PROGRESSION[this.characterLevel];
    return progression.cantripsKnown;
  }

  // Get maximum spells that can be prepared (not including domain spells)
  getMaxSpellsPrepared(): number {
    return calculateSpellsPrepared(this.characterLevel, this.wisdomModifier);
  }

  // Get current number of prepared spells (not including domain spells and cantrips)
  getCurrentSpellsPrepared(): number {
    let count = 0;
    for (let level = 1; level <= 9; level++) {
      const levelKey = `level${level}` as keyof PreparedSpells;
      const prepared = this.preparedSpells[levelKey];
      const domainSpellsAtLevel = this.domainSpells[level] || [];
      
      // Count only non-domain spells
      const nonDomainSpells = prepared.filter(spell => !domainSpellsAtLevel.includes(spell));
      count += nonDomainSpells.length;
    }
    return count;
  }

  // Cast a spell (expend a spell slot)
  castSpell(level: number): boolean {
    if (level === 0) return true; // Cantrips don't use slots
    
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

  // Get spells available for preparation
  getAvailableSpells(level: number): Spell[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof Spellbook;
    return this.spellbook[levelKey] || [];
  }

  // Prepare spells (limited by Wisdom modifier + cleric level)
  prepareSpells(spellNames: string[], level: number): boolean {
    const maxPrepared = this.getMaxSpellsPrepared();
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof PreparedSpells;
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
      const cantripsKnown = this.getCantripsKnown();
      if (validSpells.length <= cantripsKnown) {
        this.preparedSpells[levelKey] = validSpells;
        return true;
      }
      return false;
    }

    // For other levels, check if total prepared spells don't exceed limit
    // (excluding domain spells which are always prepared)
    const currentPrepared = this.getCurrentSpellsPrepared();
    const domainSpellsAtLevel = this.domainSpells[level] || [];
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

  // Get prepared spells for a specific level
  getPreparedSpells(level: number): string[] {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof PreparedSpells;
    return [...this.preparedSpells[levelKey]];
  }

  // Get all prepared spells
  getAllPreparedSpells(): PreparedSpells {
    return { ...this.preparedSpells };
  }

  // Check if a spell is prepared
  isSpellPrepared(spellName: string, level: number): boolean {
    const levelKey = level === 0 ? 'cantrips' : `level${level}` as keyof PreparedSpells;
    return this.preparedSpells[levelKey].includes(spellName);
  }

  // Get domain spells for the character's level
  getDomainSpells(): { [level: number]: string[] } {
    const availableDomainSpells: { [level: number]: string[] } = {};
    for (const [levelStr, spells] of Object.entries(this.domainSpells)) {
      const level = parseInt(levelStr);
      if (level <= this.characterLevel) {
        availableDomainSpells[level] = spells;
      }
    }
    return availableDomainSpells;
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
  getSpellDetails(spellName: string): Spell | null {
    for (const spells of Object.values(this.spellbook)) {
      const spell = spells.find((s: Spell) => s.name === spellName);
      if (spell) return spell;
    }
    return null;
  }

  // Add spell to spellbook (for learning new spells)
  addSpellToSpellbook(spell: Spell): void {
    const levelKey = spell.level === 0 ? 'cantrips' : `level${spell.level}` as keyof Spellbook;
    if (!this.spellbook[levelKey].some(s => s.name === spell.name)) {
      this.spellbook[levelKey].push(spell);
    }
  }

  // Get spellcasting ability modifier (Wisdom for clerics)
  getSpellcastingModifier(): number {
    return this.wisdomModifier;
  }

  // Get spell save DC (8 + proficiency bonus + Wisdom modifier)
  getSpellSaveDC(): number {
    const proficiencyBonus = Math.ceil(this.characterLevel / 4) + 1;
    return 8 + proficiencyBonus + this.wisdomModifier;
  }

  // Get spell attack bonus (proficiency bonus + Wisdom modifier)
  getSpellAttackBonus(): number {
    const proficiencyBonus = Math.ceil(this.characterLevel / 4) + 1;
    return proficiencyBonus + this.wisdomModifier;
  }

  // Update character level and recalculate spell slots
  updateLevel(newLevel: number): void {
    this.characterLevel = newLevel;
    const progression = CLERIC_PROGRESSION[newLevel];
    this.maxSlots = progression.spellSlots;
    
    // Update current slots to match new max (don't exceed new max)
    Object.keys(this.currentSlots).forEach(key => {
      const slotKey = key as keyof SpellSlots;
      this.currentSlots[slotKey] = Math.min(this.currentSlots[slotKey], this.maxSlots[slotKey]);
    });
    
    // Update domain spells for new level
    this.addDomainSpellsToPrepared();
  }

  // Update Wisdom modifier
  updateWisdomModifier(newModifier: number): void {
    this.wisdomModifier = newModifier;
  }

  // Update domain spells (when changing domain or leveling up)
  updateDomainSpells(newDomainSpells: { [level: number]: string[] }): void {
    this.domainSpells = newDomainSpells;
    this.addDomainSpellsToPrepared();
  }

  // Get ritual spells that can be cast as rituals
  getRitualSpells(): Spell[] {
    const ritualSpells: Spell[] = [];
    
    // Check prepared spells for ritual spells
    for (let level = 1; level <= 9; level++) {
      const preparedAtLevel = this.getPreparedSpells(level);
      preparedAtLevel.forEach(spellName => {
        const spell = this.getSpellDetails(spellName);
        if (spell && spell.ritual) {
          ritualSpells.push(spell);
        }
      });
    }
    
    return ritualSpells;
  }

  // Check if character can cast spells at a given level
  canCastSpellsAtLevel(level: number): boolean {
    if (level === 0) return true; // Can always cast cantrips
    return this.getMaxSlotsForLevel(level) > 0;
  }

  // Get spell preparation summary
  getPreparationSummary(): {
    cantripsKnown: number;
    cantripsMaximum: number;
    spellsPrepared: number;
    spellsMaximum: number;
    domainSpellsCount: number;
  } {
    const domainSpellsCount = Object.values(this.getDomainSpells()).flat().length;
    
    return {
      cantripsKnown: this.preparedSpells.cantrips.length,
      cantripsMaximum: this.getCantripsKnown(),
      spellsPrepared: this.getCurrentSpellsPrepared(),
      spellsMaximum: this.getMaxSpellsPrepared(),
      domainSpellsCount
    };
  }
}