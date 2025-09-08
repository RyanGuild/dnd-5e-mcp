import { DiceRoll, RollResult } from '../types/character.js';

export function rollDice(dice: number, sides: number, modifier: number = 0): RollResult {
  const rolls: number[] = [];
  let total = 0;

  for (let i = 0; i < dice; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  total += modifier;

  return {
    rolls,
    total,
    natural20: rolls.some(roll => roll === 20),
    natural1: rolls.some(roll => roll === 1)
  };
}

export function rollWithAdvantage(dice: number, sides: number, modifier: number = 0): RollResult {
  const roll1 = rollDice(dice, sides, modifier);
  const roll2 = rollDice(dice, sides, modifier);
  
  return roll1.total >= roll2.total ? roll1 : roll2;
}

export function rollWithDisadvantage(dice: number, sides: number, modifier: number = 0): RollResult {
  const roll1 = rollDice(dice, sides, modifier);
  const roll2 = rollDice(dice, sides, modifier);
  
  return roll1.total <= roll2.total ? roll1 : roll2;
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
  return rollDice(1, hitDie, constitutionModifier);
}
