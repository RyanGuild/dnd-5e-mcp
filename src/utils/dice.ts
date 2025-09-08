import { DiceRoll, RollResult } from '../types/character';
import { z } from 'zod';
import { DiceRollSchema, RollResultSchema } from './validation';

export function rollDice(dice: number, sides: number, modifier: number = 0): RollResult {
  // Validate input parameters
  const diceRollValidation = DiceRollSchema.safeParse({ dice, sides, modifier });
  
  if (!diceRollValidation.success) {
    throw new Error(`Invalid dice roll parameters: ${diceRollValidation.error.message}`);
  }

  const rolls: number[] = [];
  let total = 0;

  for (let i = 0; i < dice; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  total += modifier;

  const result: RollResult = {
    rolls,
    total,
    natural20: rolls.some(roll => roll === 20),
    natural1: rolls.some(roll => roll === 1)
  };

  // Validate the result
  const resultValidation = RollResultSchema.safeParse(result);
  
  if (!resultValidation.success) {
    throw new Error(`Invalid roll result: ${resultValidation.error.message}`);
  }

  return result;
}

export function rollWithAdvantage(dice: number, sides: number, modifier: number = 0): RollResult {
  const roll1 = rollDice(dice, sides, 0); // No modifier for individual rolls
  const roll2 = rollDice(dice, sides, 0);
  
  // Combine rolls and take the higher total
  const total1 = roll1.rolls.reduce((sum, roll) => sum + roll, 0);
  const total2 = roll2.rolls.reduce((sum, roll) => sum + roll, 0);
  
  if (total1 >= total2) {
    return {
      rolls: [...roll1.rolls, ...roll2.rolls],
      total: total1 + modifier,
      natural20: roll1.natural20 || roll2.natural20,
      natural1: roll1.natural1 || roll2.natural1
    };
  } else {
    return {
      rolls: [...roll1.rolls, ...roll2.rolls],
      total: total2 + modifier,
      natural20: roll1.natural20 || roll2.natural20,
      natural1: roll1.natural1 || roll2.natural1
    };
  }
}

export function rollWithDisadvantage(dice: number, sides: number, modifier: number = 0): RollResult {
  const roll1 = rollDice(dice, sides, 0); // No modifier for individual rolls
  const roll2 = rollDice(dice, sides, 0);
  
  // Combine rolls and take the lower total
  const total1 = roll1.rolls.reduce((sum, roll) => sum + roll, 0);
  const total2 = roll2.rolls.reduce((sum, roll) => sum + roll, 0);
  
  if (total1 <= total2) {
    return {
      rolls: [...roll1.rolls, ...roll2.rolls],
      total: total1 + modifier,
      natural20: roll1.natural20 || roll2.natural20,
      natural1: roll1.natural1 || roll2.natural1
    };
  } else {
    return {
      rolls: [...roll1.rolls, ...roll2.rolls],
      total: total2 + modifier,
      natural20: roll1.natural20 || roll2.natural20,
      natural1: roll1.natural1 || roll2.natural1
    };
  }
}

export function rollAbilityCheck(abilityScore: number, proficiencyBonus: number, proficient: boolean = false): RollResult {
  const modifier = Math.floor((abilityScore - 10) / 2);
  const totalModifier = modifier + (proficient ? proficiencyBonus : 0);
  
  return rollDice(1, 20, totalModifier);
}

export function rollSavingThrow(abilityScore: number, proficiencyBonus: number, proficient: boolean = false): RollResult {
  return rollAbilityCheck(abilityScore, proficiencyBonus, proficient);
}

export function rollSkillCheck(abilityScore: number, proficiencyBonus: number, proficient: boolean = false): RollResult {
  return rollAbilityCheck(abilityScore, proficiencyBonus, proficient);
}

export function rollAttack(abilityScore: number, proficiencyBonus: number, proficient: boolean = false, advantage?: boolean, disadvantage?: boolean): RollResult {
  const modifier = Math.floor((abilityScore - 10) / 2) + (proficient ? proficiencyBonus : 0);
  
  if (advantage && !disadvantage) {
    return rollWithAdvantage(1, 20, modifier);
  } else if (disadvantage && !advantage) {
    return rollWithDisadvantage(1, 20, modifier);
  } else {
    return rollDice(1, 20, modifier);
  }
}

export function rollDamage(dice: number, sides: number, modifier: number = 0): RollResult {
  return rollDice(dice, sides, modifier);
}

export function rollHitDie(hitDie: number, constitutionModifier: number): RollResult {
  const result = rollDice(1, hitDie, constitutionModifier);
  
  // Ensure minimum 1 HP gain
  if (result.total < 1) {
    result.total = 1;
  }
  
  return result;
}
