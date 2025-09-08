import { DNDCharacter, ClassFeatureInstance } from '../types/character.js';
import { FIGHTER_CLASS, FIGHTING_STYLES, getFighterFeaturesByLevel, getFighterFeatureUses, getFighterAttacks } from '../data/classes.js';
import { rollDice } from './dice.js';

// Initialize Fighter class features for a character
export function initializeFighterFeatures(character: DNDCharacter, fightingStyle?: string): void {
  if (character.class.name !== 'Fighter') {
    return;
  }

  // Set fighting style if provided
  if (fightingStyle && FIGHTING_STYLES.some(style => style.name === fightingStyle)) {
    character.class.fightingStyle = fightingStyle;
  }

  // Initialize class features based on level
  const features = getFighterFeaturesByLevel(character.level);
  character.class.classFeatures = features.map(feature => ({
    name: feature.name,
    level: feature.level,
    description: feature.description,
    type: feature.type,
    uses: feature.uses ? getFighterFeatureUses(feature.name, character.level) : undefined,
    maxUses: feature.uses ? getFighterFeatureUses(feature.name, character.level) : undefined,
    usesType: feature.usesType,
    rechargeOn: feature.rechargeOn
  }));

  // Add fighting style to features if selected
  if (character.class.fightingStyle) {
    const style = FIGHTING_STYLES.find(s => s.name === character.class.fightingStyle);
    if (style) {
      character.features.push(`Fighting Style: ${style.name} - ${style.description}`);
    }
  }
}

// Use Second Wind feature
export function useSecondWind(character: DNDCharacter): { success: boolean; healing: number; message: string } {
  if (character.class.name !== 'Fighter') {
    return { success: false, healing: 0, message: 'Only Fighters can use Second Wind.' };
  }

  const secondWindFeature = character.class.classFeatures?.find(f => f.name === 'Second Wind');
  if (!secondWindFeature) {
    return { success: false, healing: 0, message: 'Second Wind feature not available at this level.' };
  }

  if (!secondWindFeature.uses || secondWindFeature.uses <= 0) {
    return { success: false, healing: 0, message: 'No Second Wind uses remaining. Requires a short or long rest.' };
  }

  // Roll 1d10 + Fighter level
  const healingRoll = rollDice(1, 10, character.level);
  const healing = healingRoll.total;

  // Apply healing
  const oldHP = character.hitPoints.current;
  character.hitPoints.current = Math.min(character.hitPoints.maximum, character.hitPoints.current + healing);
  const actualHealing = character.hitPoints.current - oldHP;

  // Use the feature
  secondWindFeature.uses--;

  return { 
    success: true, 
    healing: actualHealing, 
    message: `Used Second Wind! Rolled ${healingRoll.rolls[0]} + ${character.level} = ${healing} healing. Healed ${actualHealing} HP.` 
  };
}

// Use Action Surge feature
export function useActionSurge(character: DNDCharacter): { success: boolean; message: string } {
  if (character.class.name !== 'Fighter') {
    return { success: false, message: 'Only Fighters can use Action Surge.' };
  }

  const actionSurgeFeature = character.class.classFeatures?.find(f => f.name === 'Action Surge' || f.name === 'Action Surge (2 uses)');
  if (!actionSurgeFeature) {
    return { success: false, message: 'Action Surge feature not available at this level.' };
  }

  if (!actionSurgeFeature.uses || actionSurgeFeature.uses <= 0) {
    return { success: false, message: 'No Action Surge uses remaining. Requires a short or long rest.' };
  }

  // Use the feature
  actionSurgeFeature.uses--;

  return { 
    success: true, 
    message: `Used Action Surge! You gain one additional action on your turn. Uses remaining: ${actionSurgeFeature.uses}` 
  };
}

// Use Indomitable feature
export function useIndomitable(character: DNDCharacter): { success: boolean; message: string } {
  if (character.class.name !== 'Fighter') {
    return { success: false, message: 'Only Fighters can use Indomitable.' };
  }

  const indomitableFeature = character.class.classFeatures?.find(f => 
    f.name === 'Indomitable' || f.name === 'Indomitable (2 uses)' || f.name === 'Indomitable (3 uses)'
  );
  if (!indomitableFeature) {
    return { success: false, message: 'Indomitable feature not available at this level.' };
  }

  if (!indomitableFeature.uses || indomitableFeature.uses <= 0) {
    return { success: false, message: 'No Indomitable uses remaining. Requires a long rest.' };
  }

  // Use the feature
  indomitableFeature.uses--;

  return { 
    success: true, 
    message: `Used Indomitable! You can reroll a failed saving throw. Uses remaining: ${indomitableFeature.uses}` 
  };
}

// Get number of attacks for Fighter
export function getFighterNumberOfAttacks(character: DNDCharacter): number {
  if (character.class.name !== 'Fighter') {
    return 1;
  }

  return getFighterAttacks(character.level);
}

// Rest and restore Fighter features
export function restoreFighterFeatures(character: DNDCharacter, restType: 'short' | 'long'): string[] {
  if (character.class.name !== 'Fighter') {
    return [];
  }

  const restored: string[] = [];

  if (!character.class.classFeatures) {
    return restored;
  }

  for (const feature of character.class.classFeatures) {
    const shouldRestore = (
      (feature.rechargeOn === 'short_rest' && restType === 'short') ||
      (feature.rechargeOn === 'long_rest' && restType === 'long') ||
      (restType === 'long' && feature.rechargeOn === 'short_rest')
    );
    
    if (shouldRestore && feature.maxUses && feature.uses !== undefined && feature.uses < feature.maxUses) {
      feature.uses = feature.maxUses;
      restored.push(feature.name);
    }
  }

  return restored;
}

// Get Fighting Style bonus for attacks/damage
export function getFightingStyleBonus(character: DNDCharacter, context: {
  weaponType?: 'melee' | 'ranged';
  isOneHanded?: boolean;
  isTwoHanded?: boolean;
  hasShield?: boolean;
  isOffHand?: boolean;
}): { attackBonus: number; damageBonus: number; acBonus: number } {
  if (character.class.name !== 'Fighter' || !character.class.fightingStyle) {
    return { attackBonus: 0, damageBonus: 0, acBonus: 0 };
  }

  const style = character.class.fightingStyle;
  let attackBonus = 0;
  let damageBonus = 0;
  let acBonus = 0;

  switch (style) {
    case 'Archery':
      if (context.weaponType === 'ranged') {
        attackBonus = 2;
      }
      break;
    case 'Defense':
      // +1 AC while wearing armor - handled in armor calculation
      acBonus = 1;
      break;
    case 'Dueling':
      if (context.isOneHanded && !context.hasShield) {
        damageBonus = 2;
      }
      break;
    case 'Great Weapon Fighting':
      // Reroll 1s and 2s - handled in damage rolling
      break;
    case 'Protection':
      // Reaction ability - handled separately
      break;
    case 'Two-Weapon Fighting':
      if (context.isOffHand) {
        // Add ability modifier to off-hand damage - handled in damage calculation
      }
      break;
  }

  return { attackBonus, damageBonus, acBonus };
}

// Check if character can use a Fighting Style ability
export function canUseFightingStyleAbility(character: DNDCharacter, abilityName: string): boolean {
  if (character.class.name !== 'Fighter' || !character.class.fightingStyle) {
    return false;
  }

  switch (abilityName) {
    case 'Protection':
      return character.class.fightingStyle === 'Protection';
    case 'Great Weapon Fighting':
      return character.class.fightingStyle === 'Great Weapon Fighting';
    default:
      return false;
  }
}

// Get Fighter feature descriptions for display
export function getFighterFeatureDescriptions(character: DNDCharacter): string[] {
  if (character.class.name !== 'Fighter') {
    return [];
  }

  const descriptions: string[] = [];

  // Fighting Style
  if (character.class.fightingStyle) {
    const style = FIGHTING_STYLES.find(s => s.name === character.class.fightingStyle);
    if (style) {
      descriptions.push(`**Fighting Style - ${style.name}:** ${style.description}`);
    }
  }

  // Class Features
  if (character.class.classFeatures) {
    for (const feature of character.class.classFeatures) {
      let desc = `**${feature.name}:** ${feature.description}`;
      if (feature.uses !== undefined && feature.maxUses !== undefined) {
        desc += ` (${feature.uses}/${feature.maxUses} uses)`;
      }
      descriptions.push(desc);
    }
  }

  return descriptions;
}

// Level up Fighter - add new features and update existing ones
export function levelUpFighter(character: DNDCharacter, newLevel: number): string[] {
  if (character.class.name !== 'Fighter') {
    return [];
  }

  const changes: string[] = [];
  const oldLevel = character.level;
  character.level = newLevel;
  character.class.level = newLevel;

  // Get new features
  const newFeatures = getFighterFeaturesByLevel(newLevel).filter(f => f.level > oldLevel);
  
  if (!character.class.classFeatures) {
    character.class.classFeatures = [];
  }

  // Add new features
  for (const feature of newFeatures) {
    const featureInstance: ClassFeatureInstance = {
      name: feature.name,
      level: feature.level,
      description: feature.description,
      type: feature.type,
      uses: feature.uses ? getFighterFeatureUses(feature.name, newLevel) : undefined,
      maxUses: feature.uses ? getFighterFeatureUses(feature.name, newLevel) : undefined,
      usesType: feature.usesType,
      rechargeOn: feature.rechargeOn
    };
    
    character.class.classFeatures.push(featureInstance);
    changes.push(`Gained ${feature.name}`);
  }

  // Update existing features that scale with level
  for (const feature of character.class.classFeatures) {
    const newUses = getFighterFeatureUses(feature.name, newLevel);
    if (feature.maxUses && newUses > feature.maxUses) {
      feature.maxUses = newUses;
      feature.uses = newUses; // Restore to full when leveling up
      changes.push(`${feature.name} now has ${newUses} uses`);
    }
  }

  return changes;
}