#!/usr/bin/env node

// Test script for hit points functionality
import { 
  calculateHitPointsRolled, 
  calculateHitPointsAverage, 
  healCharacter, 
  damageCharacter, 
  setCurrentHitPoints, 
  addTemporaryHitPoints, 
  removeTemporaryHitPoints 
} from './dist/utils/character.js';

// Test hit points calculation
console.log('=== Hit Points Calculation Tests ===');

// Test average calculation
const avgHP = calculateHitPointsAverage(4, 8, 2);
console.log(`Average HP for level 4 with d8 hit die and +2 CON: ${avgHP}`);

// Test rolled calculation
const rolls = [6, 3, 7]; // Example rolls for levels 2, 3, 4
const rolledHP = calculateHitPointsRolled(4, 8, 2, rolls);
console.log(`Rolled HP for level 4 with d8 hit die, +2 CON, and rolls [${rolls.join(', ')}]: ${rolledHP}`);

// Test character manipulation (we'll create a mock character)
const mockCharacter = {
  hitPoints: {
    current: 25,
    maximum: 31,
    temporary: 0
  },
  name: 'Test Character'
};

console.log('\n=== Character Hit Points Manipulation Tests ===');
console.log(`Initial HP: ${mockCharacter.hitPoints.current}/${mockCharacter.hitPoints.maximum} + ${mockCharacter.hitPoints.temporary} temp`);

// Test healing
const healResult = healCharacter(mockCharacter, 5);
console.log(`After healing 5: ${healResult.newCurrent}/${mockCharacter.hitPoints.maximum} + ${mockCharacter.hitPoints.temporary} temp (healed: ${healResult.healed})`);

// Test damage
const damageResult = damageCharacter(mockCharacter, 8);
console.log(`After taking 8 damage: ${damageResult.newCurrent}/${mockCharacter.hitPoints.maximum} + ${mockCharacter.hitPoints.temporary} temp (damage: ${damageResult.damage})`);

// Test setting hit points
const setResult = setCurrentHitPoints(mockCharacter, 20);
console.log(`After setting to 20: ${setResult.newCurrent}/${mockCharacter.hitPoints.maximum} + ${mockCharacter.hitPoints.temporary} temp (change: ${setResult.changed})`);

// Test temporary hit points
const tempResult = addTemporaryHitPoints(mockCharacter, 10);
console.log(`After adding 10 temp HP: ${mockCharacter.hitPoints.current}/${mockCharacter.hitPoints.maximum} + ${tempResult.newTemporary} temp (added: ${tempResult.added})`);

// Test removing temporary hit points
const removeTempResult = removeTemporaryHitPoints(mockCharacter, 3);
console.log(`After removing 3 temp HP: ${mockCharacter.hitPoints.current}/${mockCharacter.hitPoints.maximum} + ${removeTempResult.newTemporary} temp (removed: ${removeTempResult.removed})`);

console.log('\n=== All tests completed successfully! ===');
