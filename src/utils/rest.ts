import { DNDCharacter, HitDice } from '../types/character.js';
import { rollDice } from './dice.js';

export interface RestResult {
  success: boolean;
  message: string;
  hitPointsRestored?: number;
  hitDiceSpent?: number;
  spellSlotsRestored?: string[];
  featuresRestored?: string[];
  exhaustionReduced?: boolean;
  errors?: string[];
}

export interface ExhaustionEffect {
  level: number;
  name: string;
  description: string;
  effects: string[];
}

// D&D 5e Exhaustion levels and effects
export const EXHAUSTION_EFFECTS: ExhaustionEffect[] = [
  {
    level: 0,
    name: "No Exhaustion",
    description: "Character is well-rested and suffers no penalties",
    effects: []
  },
  {
    level: 1,
    name: "Light Exhaustion",
    description: "Disadvantage on ability checks",
    effects: ["Disadvantage on ability checks"]
  },
  {
    level: 2,
    name: "Moderate Exhaustion", 
    description: "Speed halved",
    effects: ["Disadvantage on ability checks", "Speed halved"]
  },
  {
    level: 3,
    name: "Heavy Exhaustion",
    description: "Disadvantage on attack rolls and saving throws",
    effects: ["Disadvantage on ability checks", "Speed halved", "Disadvantage on attack rolls and saving throws"]
  },
  {
    level: 4,
    name: "Severe Exhaustion",
    description: "Hit point maximum halved",
    effects: ["Disadvantage on ability checks", "Speed halved", "Disadvantage on attack rolls and saving throws", "Hit point maximum halved"]
  },
  {
    level: 5,
    name: "Near Death",
    description: "Speed reduced to 0",
    effects: ["Disadvantage on ability checks", "Speed halved", "Disadvantage on attack rolls and saving throws", "Hit point maximum halved", "Speed reduced to 0"]
  },
  {
    level: 6,
    name: "Death",
    description: "Character dies",
    effects: ["Death"]
  }
];

export class RestManager {
  private character: DNDCharacter;

  constructor(character: DNDCharacter) {
    this.character = character;
  }

  /**
   * Perform a short rest (1 hour)
   * - Spend hit dice to regain hit points
   * - Class-specific recovery (Warlock spell slots, etc.)
   */
  shortRest(hitDiceToSpend: number = 0): RestResult {
    const errors: string[] = [];
    let hitPointsRestored = 0;
    let hitDiceSpent = 0;
    const featuresRestored: string[] = [];

    // Validate hit dice spending
    if (hitDiceToSpend > 0) {
      if (hitDiceToSpend > this.character.hitDice.current) {
        errors.push(`Cannot spend ${hitDiceToSpend} hit dice. Only ${this.character.hitDice.current} available.`);
      } else {
        // Spend hit dice and roll for healing
        for (let i = 0; i < hitDiceToSpend; i++) {
          const roll = rollDice(1, this.character.hitDice.size, this.character.abilityScores.constitution.modifier);
          const healing = Math.max(1, roll.total); // Minimum 1 HP
          
          const oldHP = this.character.hitPoints.current;
          this.character.hitPoints.current = Math.min(
            this.character.hitPoints.maximum,
            this.character.hitPoints.current + healing
          );
          hitPointsRestored += this.character.hitPoints.current - oldHP;
          hitDiceSpent++;
        }
        
        this.character.hitDice.current -= hitDiceSpent;
      }
    }

    // Class-specific short rest recovery
    const classRecovery = this.getShortRestClassRecovery();
    featuresRestored.push(...classRecovery);

    if (errors.length > 0) {
      return {
        success: false,
        message: "Short rest completed with errors",
        hitPointsRestored,
        hitDiceSpent,
        featuresRestored,
        errors
      };
    }

    return {
      success: true,
      message: `Short rest completed. ${hitPointsRestored > 0 ? `Restored ${hitPointsRestored} hit points.` : ''} ${featuresRestored.length > 0 ? `Recovered: ${featuresRestored.join(', ')}.` : ''}`,
      hitPointsRestored,
      hitDiceSpent,
      featuresRestored
    };
  }

  /**
   * Perform a long rest (8 hours)
   * - Restore all hit points
   * - Restore half of maximum hit dice (minimum 1)
   * - Restore all spell slots
   * - Restore class features
   * - Reduce exhaustion by 1 level
   */
  longRest(): RestResult {
    const errors: string[] = [];
    const featuresRestored: string[] = [];
    const spellSlotsRestored: string[] = [];

    // Check if character can take a long rest
    if (this.character.exhaustionLevel >= 6) {
      return {
        success: false,
        message: "Character is dead and cannot take a long rest.",
        errors: ["Character is dead"]
      };
    }

    // Restore hit points to maximum
    const hitPointsRestored = this.character.hitPoints.maximum - this.character.hitPoints.current;
    this.character.hitPoints.current = this.character.hitPoints.maximum;

    // Restore hit dice (half of maximum, minimum 1)
    const hitDiceRestored = Math.max(1, Math.floor(this.character.hitDice.maximum / 2));
    this.character.hitDice.current = Math.min(
      this.character.hitDice.maximum,
      this.character.hitDice.current + hitDiceRestored
    );

    // Reduce exhaustion by 1 level
    let exhaustionReduced = false;
    if (this.character.exhaustionLevel > 0) {
      this.character.exhaustionLevel = Math.max(0, this.character.exhaustionLevel - 1);
      exhaustionReduced = true;
    }

    // Class-specific long rest recovery
    const classRecovery = this.getLongRestClassRecovery();
    featuresRestored.push(...classRecovery.features);
    spellSlotsRestored.push(...classRecovery.spellSlots);

    let message = `Long rest completed. Restored ${hitPointsRestored} hit points and ${hitDiceRestored} hit dice.`;
    if (exhaustionReduced) {
      message += ` Exhaustion reduced to level ${this.character.exhaustionLevel}.`;
    }
    if (featuresRestored.length > 0) {
      message += ` Recovered: ${featuresRestored.join(', ')}.`;
    }
    if (spellSlotsRestored.length > 0) {
      message += ` Spell slots restored: ${spellSlotsRestored.join(', ')}.`;
    }

    return {
      success: true,
      message,
      hitPointsRestored,
      spellSlotsRestored,
      featuresRestored,
      exhaustionReduced
    };
  }

  /**
   * Add exhaustion levels to the character
   */
  addExhaustion(levels: number = 1): { newLevel: number; effects: string[] } {
    const oldLevel = this.character.exhaustionLevel;
    this.character.exhaustionLevel = Math.min(6, this.character.exhaustionLevel + levels);
    
    const effects = this.getExhaustionEffects();
    
    return {
      newLevel: this.character.exhaustionLevel,
      effects: effects.effects
    };
  }

  /**
   * Remove exhaustion levels from the character
   */
  removeExhaustion(levels: number = 1): { newLevel: number; effects: string[] } {
    const oldLevel = this.character.exhaustionLevel;
    this.character.exhaustionLevel = Math.max(0, this.character.exhaustionLevel - levels);
    
    const effects = this.getExhaustionEffects();
    
    return {
      newLevel: this.character.exhaustionLevel,
      effects: effects.effects
    };
  }

  /**
   * Get current exhaustion effects
   */
  getExhaustionEffects(): ExhaustionEffect {
    return EXHAUSTION_EFFECTS[Math.min(6, Math.max(0, this.character.exhaustionLevel))];
  }

  /**
   * Get class-specific short rest recovery features
   */
  private getShortRestClassRecovery(): string[] {
    const features: string[] = [];
    const className = this.character.class.name.toLowerCase();

    switch (className) {
      case 'warlock':
        features.push('All spell slots');
        break;
      case 'fighter':
        if (this.character.level >= 1) {
          features.push('Second Wind');
        }
        if (this.character.level >= 3) {
          features.push('Action Surge');
        }
        break;
      case 'monk':
        features.push('Ki points');
        break;
      case 'bard':
        if (this.character.level >= 5) {
          features.push('Bardic Inspiration');
        }
        break;
      case 'druid':
        if (this.character.level >= 2) {
          features.push('Wild Shape');
        }
        break;
      case 'sorcerer':
        if (this.character.level >= 4) {
          features.push('Font of Magic');
        }
        break;
    }

    return features;
  }

  /**
   * Get class-specific long rest recovery features
   */
  private getLongRestClassRecovery(): { features: string[]; spellSlots: string[] } {
    const features: string[] = [];
    const spellSlots: string[] = [];
    const className = this.character.class.name.toLowerCase();

    // Most classes restore all spell slots on long rest
    if (['wizard', 'sorcerer', 'cleric', 'druid', 'paladin', 'ranger', 'bard'].includes(className)) {
      spellSlots.push('All spell slots');
    }

    switch (className) {
      case 'wizard':
        features.push('Arcane Recovery');
        break;
      case 'cleric':
        features.push('Channel Divinity');
        break;
      case 'paladin':
        features.push('Lay on Hands', 'Channel Divinity');
        break;
      case 'barbarian':
        features.push('Rage');
        break;
      case 'rogue':
        if (this.character.level >= 3) {
          features.push('Sneak Attack');
        }
        break;
    }

    return { features, spellSlots };
  }

  /**
   * Check if character can take a long rest
   */
  canTakeLongRest(): { canRest: boolean; reason?: string } {
    if (this.character.exhaustionLevel >= 6) {
      return { canRest: false, reason: "Character is dead" };
    }

    return { canRest: true };
  }

  /**
   * Check if character can take a short rest
   */
  canTakeShortRest(): { canRest: boolean; reason?: string } {
    if (this.character.exhaustionLevel >= 6) {
      return { canRest: false, reason: "Character is dead" };
    }

    if (this.character.exhaustionLevel === 5) {
      return { canRest: false, reason: "Character's speed is reduced to 0" };
    }

    return { canRest: true };
  }

  /**
   * Get available hit dice for spending
   */
  getAvailableHitDice(): { current: number; maximum: number; size: number } {
    return {
      current: this.character.hitDice.current,
      maximum: this.character.hitDice.maximum,
      size: this.character.hitDice.size
    };
  }
}


/**
 * Calculate effective maximum hit points considering exhaustion
 */
export function getEffectiveMaxHitPoints(character: DNDCharacter): number {
  if (character.exhaustionLevel >= 4) {
    return Math.floor(character.hitPoints.maximum / 2);
  }
  return character.hitPoints.maximum;
}

/**
 * Calculate effective speed considering exhaustion
 */
export function getEffectiveSpeed(character: DNDCharacter): number {
  if (character.exhaustionLevel >= 5) {
    return 0;
  }
  if (character.exhaustionLevel >= 2) {
    return Math.floor(character.speed / 2);
  }
  return character.speed;
}

/**
 * Check if character has disadvantage on ability checks due to exhaustion
 */
export function hasAbilityCheckDisadvantage(character: DNDCharacter): boolean {
  return character.exhaustionLevel >= 1;
}

/**
 * Check if character has disadvantage on attack rolls and saving throws due to exhaustion
 */
export function hasAttackAndSaveDisadvantage(character: DNDCharacter): boolean {
  return character.exhaustionLevel >= 3;
}