import { v4 as uuidv4 } from 'uuid';
import { 
  StatusEffect, 
  EntityStatus, 
  ConditionType, 
  StatusEffectTemplates, 
  StatusApplicationResult 
} from '../types/status';
import { GameEntity } from '../types/entity';
import { saveEntity } from './storage';

/**
 * Applies a status effect to an entity, returning a modified copy of the entity
 */
export function applyStatusEffect(
  entity: GameEntity,
  conditionType: ConditionType,
  options: {
    source?: string;
    duration?: StatusEffect['duration'];
    level?: number; // For exhaustion
    saveDC?: number;
    saveType?: StatusEffect['saveType'];
    canRepeatSave?: boolean;
    metadata?: Record<string, any>;
  } = {}
): { entity: GameEntity; result: StatusApplicationResult } {
  const modifiedEntity = { ...entity };
  
  // Initialize status if it doesn't exist
  if (!modifiedEntity.status) {
    modifiedEntity.status = {
      entityId: entity.id,
      activeConditions: [],
      immunities: [],
      resistances: [],
      lastUpdated: new Date(),
      originalStats: {}
    };
  }

  // Check immunity
  if (modifiedEntity.status.immunities.includes(conditionType)) {
      return {
        entity: modifiedEntity,
        result: {
          success: false,
          message: `${entity.name} is immune to ${conditionType}`,
          removedEffects: [],
          warnings: []
        }
      };
  }

  // Get template for the condition
  const template = StatusEffectTemplates[conditionType];
  
  // Create the status effect
  const statusEffect: StatusEffect = {
    id: uuidv4(),
    type: conditionType,
    name: template.name,
    description: template.description,
    source: options.source || 'Unknown',
    duration: options.duration || template.duration,
    level: options.level || template.level,
    saveType: options.saveType || template.saveType,
    saveDC: options.saveDC || template.saveDC,
    canRepeatSave: options.canRepeatSave ?? template.canRepeatSave,
    appliedAt: new Date(),
    metadata: options.metadata
  };

  // Handle special cases
  const warnings: string[] = [];
  const removedEffects: StatusEffect[] = [];

  // Handle exhaustion stacking
  if (conditionType === 'exhaustion') {
    const existingExhaustion = modifiedEntity.status.activeConditions.find(c => c.type === 'exhaustion');
    if (existingExhaustion) {
      const newLevel = (existingExhaustion.level || 1) + (statusEffect.level || 1);
      if (newLevel >= 6) {
        warnings.push(`${entity.name} has reached exhaustion level 6 and dies!`);
        statusEffect.level = 6;
      } else {
        statusEffect.level = newLevel;
      }
      // Remove old exhaustion effect
      modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(c => c.id !== existingExhaustion.id);
      removedEffects.push(existingExhaustion);
    }
  }

  // Handle conditions that remove other conditions
  if (conditionType === 'unconscious') {
    // Unconscious removes prone (it includes prone)
    const proneEffect = modifiedEntity.status.activeConditions.find(c => c.type === 'prone');
    if (proneEffect) {
      modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(c => c.id !== proneEffect.id);
      removedEffects.push(proneEffect);
    }
  }

  if (conditionType === 'paralyzed' || conditionType === 'stunned' || conditionType === 'unconscious') {
    // These conditions include incapacitated
    const incapacitatedEffect = modifiedEntity.status.activeConditions.find(c => c.type === 'incapacitated');
    if (incapacitatedEffect) {
      modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(c => c.id !== incapacitatedEffect.id);
      removedEffects.push(incapacitatedEffect);
    }
  }

  // Check for conflicting conditions (don't allow duplicates of non-stacking conditions)
  if (conditionType !== 'exhaustion') {
    const existingCondition = modifiedEntity.status.activeConditions.find(c => c.type === conditionType);
    if (existingCondition) {
      return {
        entity: modifiedEntity,
        result: {
          success: false,
          message: `${entity.name} already has the ${conditionType} condition`,
          removedEffects: [],
          warnings: []
        }
      };
    }
  }

  // Apply the status effect
  modifiedEntity.status.activeConditions.push(statusEffect);
  modifiedEntity.status.lastUpdated = new Date();

  // Apply mechanical effects to the entity
  applyMechanicalEffects(modifiedEntity, statusEffect);

  return {
    entity: modifiedEntity,
    result: {
      success: true,
      message: `Applied ${statusEffect.name} to ${entity.name}${statusEffect.level ? ` (level ${statusEffect.level})` : ''}`,
      appliedEffect: statusEffect,
      removedEffects,
      warnings
    }
  };
}

/**
 * Removes a status effect from an entity
 */
export function removeStatusEffect(
  entity: GameEntity,
  conditionType: ConditionType | string // Can be condition type or effect ID
): { entity: GameEntity; result: StatusApplicationResult } {
  const modifiedEntity = { ...entity };
  
  if (!modifiedEntity.status) {
    return {
      entity: modifiedEntity,
      result: {
        success: false,
        message: `${entity.name} has no active status effects`,
        removedEffects: [],
        warnings: []
      }
    };
  }

  // Find the effect to remove (by type or ID)
  const effectIndex = modifiedEntity.status.activeConditions.findIndex(effect => 
    effect.type === conditionType || effect.id === conditionType
  );

  if (effectIndex === -1) {
    return {
      entity: modifiedEntity,
      result: {
        success: false,
        message: `${entity.name} does not have the ${conditionType} condition`,
        removedEffects: [],
        warnings: []
      }
    };
  }

  const removedEffect = modifiedEntity.status.activeConditions[effectIndex];
  modifiedEntity.status.activeConditions.splice(effectIndex, 1);
  modifiedEntity.status.lastUpdated = new Date();

  // Remove mechanical effects from the entity
  removeMechanicalEffects(modifiedEntity, removedEffect);

  return {
    entity: modifiedEntity,
    result: {
      success: true,
      message: `Removed ${removedEffect.name} from ${entity.name}`,
      removedEffects: [removedEffect],
      warnings: []
    }
  };
}

/**
 * Checks if an entity has a specific condition
 */
export function hasCondition(entity: GameEntity, conditionType: ConditionType): boolean {
  return entity.status?.activeConditions.some(effect => effect.type === conditionType) || false;
}

/**
 * Gets all active conditions on an entity
 */
export function getActiveConditions(entity: GameEntity): StatusEffect[] {
  return entity.status?.activeConditions || [];
}

/**
 * Gets a specific condition by type
 */
export function getCondition(entity: GameEntity, conditionType: ConditionType): StatusEffect | undefined {
  return entity.status?.activeConditions.find(effect => effect.type === conditionType);
}

/**
 * Updates duration for timed status effects
 */
export function updateStatusDurations(entity: GameEntity, timeType: 'round' | 'minute' | 'hour'): GameEntity {
  const modifiedEntity = { ...entity };
  
  if (!modifiedEntity.status) return modifiedEntity;

  const expiredEffects: StatusEffect[] = [];
  
  modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(effect => {
    if (effect.duration.type === 'rounds' && timeType === 'round') {
      if (effect.duration.remaining && effect.duration.remaining > 0) {
        effect.duration.remaining--;
        return effect.duration.remaining > 0;
      }
    } else if (effect.duration.type === 'minutes' && timeType === 'minute') {
      if (effect.duration.remaining && effect.duration.remaining > 0) {
        effect.duration.remaining--;
        return effect.duration.remaining > 0;
      }
    } else if (effect.duration.type === 'hours' && timeType === 'hour') {
      if (effect.duration.remaining && effect.duration.remaining > 0) {
        effect.duration.remaining--;
        return effect.duration.remaining > 0;
      }
    }
    
    if (effect.duration.remaining === 0) {
      expiredEffects.push(effect);
      return false;
    }
    
    return true;
  });

  // Remove mechanical effects for expired conditions
  expiredEffects.forEach(effect => {
    removeMechanicalEffects(modifiedEntity, effect);
  });

  if (expiredEffects.length > 0) {
    modifiedEntity.status.lastUpdated = new Date();
  }

  return modifiedEntity;
}

/**
 * Handles long rest - removes appropriate conditions
 */
export function applyLongRest(entity: GameEntity): GameEntity {
  const modifiedEntity = { ...entity };
  
  if (!modifiedEntity.status) return modifiedEntity;

  const removedEffects: StatusEffect[] = [];
  
  modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(effect => {
    if (effect.duration.type === 'until_long_rest') {
      removedEffects.push(effect);
      return false;
    }
    
    // Reduce exhaustion by 1 level
    if (effect.type === 'exhaustion') {
      if (effect.level && effect.level > 1) {
        effect.level--;
        return true;
      } else {
        removedEffects.push(effect);
        return false;
      }
    }
    
    return true;
  });

  // Remove mechanical effects for removed conditions
  removedEffects.forEach(effect => {
    removeMechanicalEffects(modifiedEntity, effect);
  });

  if (removedEffects.length > 0) {
    modifiedEntity.status.lastUpdated = new Date();
  }

  return modifiedEntity;
}

/**
 * Handles short rest - removes appropriate conditions
 */
export function applyShortRest(entity: GameEntity): GameEntity {
  const modifiedEntity = { ...entity };
  
  if (!modifiedEntity.status) return modifiedEntity;

  const removedEffects: StatusEffect[] = [];
  
  modifiedEntity.status.activeConditions = modifiedEntity.status.activeConditions.filter(effect => {
    if (effect.duration.type === 'until_short_rest') {
      removedEffects.push(effect);
      return false;
    }
    return true;
  });

  // Remove mechanical effects for removed conditions
  removedEffects.forEach(effect => {
    removeMechanicalEffects(modifiedEntity, effect);
  });

  if (removedEffects.length > 0) {
    modifiedEntity.status.lastUpdated = new Date();
  }

  return modifiedEntity;
}

/**
 * Applies mechanical effects of a status condition to an entity
 * This modifies the entity's stats based on the condition
 */
function applyMechanicalEffects(entity: GameEntity, effect: StatusEffect): void {
  // Store original values if not already stored
  if (!entity.status?.originalStats) {
    entity.status = entity.status || {
      entityId: entity.id,
      activeConditions: [],
      immunities: [],
      resistances: [],
      lastUpdated: new Date(),
      originalStats: {}
    };
    
    entity.status.originalStats = {
      speed: entity.speed,
      // Store other original stats as needed
    };
  }

  switch (effect.type) {
    case 'grappled':
    case 'restrained':
      // Speed becomes 0
      if (typeof entity.speed === 'number') {
        entity.speed = 0;
      } else {
        entity.speed = { ...entity.speed, walk: 0 };
      }
      break;
      
    case 'prone':
      // No direct mechanical changes to stats, handled in combat
      break;
      
    case 'unconscious':
      // Speed becomes 0, and creature is prone
      if (typeof entity.speed === 'number') {
        entity.speed = 0;
      } else {
        entity.speed = { ...entity.speed, walk: 0 };
      }
      break;
      
    // Add more mechanical effects as needed
  }
}

/**
 * Removes mechanical effects of a status condition from an entity
 */
function removeMechanicalEffects(entity: GameEntity, effect: StatusEffect): void {
  const originalStats = entity.status?.originalStats;
  if (!originalStats) return;

  // Check if any remaining conditions would prevent restoration
  const remainingConditions = entity.status?.activeConditions.filter(c => c.id !== effect.id) || [];
  
  switch (effect.type) {
    case 'grappled':
    case 'restrained':
      // Restore speed if no other speed-affecting conditions remain
      const hasSpeedReduction = remainingConditions.some(c => 
        ['grappled', 'restrained', 'unconscious', 'paralyzed', 'stunned', 'petrified'].includes(c.type)
      );
      
      if (!hasSpeedReduction) {
        entity.speed = originalStats.speed;
      }
      break;
      
    case 'unconscious':
      // Restore speed if no other speed-affecting conditions remain
      const hasSpeedReductionUnconscious = remainingConditions.some(c => 
        ['grappled', 'restrained', 'paralyzed', 'stunned', 'petrified'].includes(c.type)
      );
      
      if (!hasSpeedReductionUnconscious) {
        entity.speed = originalStats.speed;
      }
      break;
  }
}

/**
 * Gets status effects that affect dice rolls
 */
export function getStatusModifiersForRoll(
  entity: GameEntity, 
  rollType: 'attack' | 'ability_check' | 'saving_throw' | 'skill_check',
  abilityType?: string
): { advantage: boolean; disadvantage: boolean; autoFail: boolean; autoSuccess: boolean } {
  const conditions = getActiveConditions(entity);
  let advantage = false;
  let disadvantage = false;
  let autoFail = false;
  let autoSuccess = false;

  for (const condition of conditions) {
    switch (condition.type) {
      case 'blinded':
        if (rollType === 'attack') disadvantage = true;
        break;
        
      case 'frightened':
        if (rollType === 'attack' || rollType === 'ability_check') disadvantage = true;
        break;
        
      case 'poisoned':
        if (rollType === 'attack' || rollType === 'ability_check') disadvantage = true;
        break;
        
      case 'prone':
        if (rollType === 'attack') disadvantage = true;
        break;
        
      case 'restrained':
        if (rollType === 'attack') disadvantage = true;
        if (rollType === 'saving_throw' && abilityType === 'dexterity') disadvantage = true;
        break;
        
      case 'paralyzed':
      case 'stunned':
      case 'unconscious':
        if (rollType === 'saving_throw' && (abilityType === 'strength' || abilityType === 'dexterity')) {
          autoFail = true;
        }
        break;
        
      case 'exhaustion':
        if (condition.level && condition.level >= 1) {
          if (rollType === 'ability_check') disadvantage = true;
        }
        if (condition.level && condition.level >= 3) {
          if (rollType === 'attack' || rollType === 'saving_throw') disadvantage = true;
        }
        break;
        
      case 'invisible':
        if (rollType === 'attack') advantage = true;
        break;
    }
  }

  return { advantage, disadvantage, autoFail, autoSuccess };
}

/**
 * Save status to persistent storage
 */
export async function saveEntityStatus(entity: GameEntity): Promise<void> {
  await saveEntity(entity);
}