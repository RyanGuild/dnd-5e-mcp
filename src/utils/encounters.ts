import { 
  EncounterDifficulty, 
  EncounterThresholds, 
  EncounterCalculation, 
  MonsterEncounter,
  PartyWithMembers,
  ENCOUNTER_THRESHOLDS,
  XP_MULTIPLIERS
} from '../types/party.js';
import { MonsterEntity, isCharacter } from '../types/entity.js';
import { listEntitiesByType } from './entities.js';

export function getEncounterThresholdsForLevel(level: number): EncounterThresholds {
  // Clamp level to valid range (1-20)
  const clampedLevel = Math.max(1, Math.min(20, level));
  return ENCOUNTER_THRESHOLDS[clampedLevel - 1];
}

export function calculatePartyEncounterThresholds(party: PartyWithMembers): EncounterCalculation {
  const characters = party.members.filter(m => isCharacter(m.entity));
  
  if (characters.length === 0) {
    throw new Error('Party must have at least one character to calculate encounter thresholds');
  }

  let totalEasy = 0;
  let totalMedium = 0;
  let totalHard = 0;
  let totalDeadly = 0;

  // Sum up thresholds for each character based on their individual level
  characters.forEach(member => {
    if (isCharacter(member.entity)) {
      const thresholds = getEncounterThresholdsForLevel(member.entity.level);
      totalEasy += thresholds.easy;
      totalMedium += thresholds.medium;
      totalHard += thresholds.hard;
      totalDeadly += thresholds.deadly;
    }
  });

  return {
    partySize: characters.length,
    averageLevel: party.averageLevel,
    totalLevel: party.totalLevel,
    thresholds: {
      easy: totalEasy,
      medium: totalMedium,
      hard: totalHard,
      deadly: totalDeadly
    },
    adjustedXP: {
      multiplier: getPartyMultiplier(characters.length),
      description: getPartyMultiplierDescription(characters.length)
    }
  };
}

function getPartyMultiplier(partySize: number): number {
  if (partySize < 3) return 1.5;  // Small party
  if (partySize > 5) return 0.5;  // Large party
  return 1.0;  // Standard party (3-5 members)
}

function getPartyMultiplierDescription(partySize: number): string {
  if (partySize < 3) return "Small party - encounters are more difficult";
  if (partySize > 5) return "Large party - encounters are easier";
  return "Standard party size";
}

export function getXPMultiplier(monsterCount: number): { multiplier: number; description: string } {
  for (let i = XP_MULTIPLIERS.length - 1; i >= 0; i--) {
    if (monsterCount >= XP_MULTIPLIERS[i].monsters) {
      return {
        multiplier: XP_MULTIPLIERS[i].multiplier,
        description: XP_MULTIPLIERS[i].description
      };
    }
  }
  return XP_MULTIPLIERS[0]; // Default to single monster
}

export function calculateEncounterDifficulty(
  baseXP: number, 
  monsterCount: number, 
  partyThresholds: EncounterDifficulty,
  partySize: number
): { difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly'; adjustedXP: number; suitable: boolean } {
  const xpMultiplier = getXPMultiplier(monsterCount);
  const partyMultiplier = getPartyMultiplier(partySize);
  const adjustedXP = Math.round(baseXP * xpMultiplier.multiplier * partyMultiplier);

  let difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';
  let suitable = true;

  if (adjustedXP >= partyThresholds.deadly) {
    difficulty = 'deadly';
    suitable = false; // Deadly encounters are generally not suitable for regular play
  } else if (adjustedXP >= partyThresholds.hard) {
    difficulty = 'hard';
  } else if (adjustedXP >= partyThresholds.medium) {
    difficulty = 'medium';
  } else if (adjustedXP >= partyThresholds.easy) {
    difficulty = 'easy';
  } else {
    difficulty = 'trivial';
    suitable = false; // Trivial encounters are too easy to be interesting
  }

  return { difficulty, adjustedXP, suitable };
}

export function createMonsterEncounter(
  monsters: Array<{ monster: MonsterEntity; count: number }>,
  partyThresholds: EncounterDifficulty,
  partySize: number
): MonsterEncounter {
  const monsterData = monsters.map(({ monster, count }) => ({
    name: monster.name,
    count,
    challengeRating: monster.challengeRating,
    xp: monster.xp
  }));

  const totalXP = monsters.reduce((sum, { monster, count }) => sum + (monster.xp * count), 0);
  const totalMonsterCount = monsters.reduce((sum, { count }) => sum + count, 0);

  const { difficulty, adjustedXP, suitable } = calculateEncounterDifficulty(
    totalXP, 
    totalMonsterCount, 
    partyThresholds,
    partySize
  );

  return {
    monsters: monsterData,
    totalXP,
    adjustedXP,
    difficulty,
    suitable
  };
}

export async function generateRandomEncounter(
  party: PartyWithMembers,
  targetDifficulty: 'easy' | 'medium' | 'hard' = 'medium',
  maxMonsters: number = 6
): Promise<MonsterEncounter[]> {
  const partyCalc = calculatePartyEncounterThresholds(party);
  const targetXP = partyCalc.thresholds[targetDifficulty];
  
  // Get all available monsters
  const allMonsters = await listEntitiesByType('monster') as MonsterEntity[];
  
  if (allMonsters.length === 0) {
    throw new Error('No monsters available in the database');
  }

  const encounters: MonsterEncounter[] = [];
  
  // Generate single monster encounters
  for (const monster of allMonsters) {
    if (monster.xp > 0) {
      const encounter = createMonsterEncounter(
        [{ monster, count: 1 }],
        partyCalc.thresholds,
        partyCalc.partySize
      );
      
      if (encounter.difficulty === targetDifficulty) {
        encounters.push(encounter);
      }
    }
  }

  // Generate multi-monster encounters
  for (const monster of allMonsters) {
    if (monster.xp > 0) {
      for (let count = 2; count <= maxMonsters; count++) {
        const baseXP = monster.xp * count;
        if (baseXP > targetXP * 2) break; // Don't go too far over target
        
        const encounter = createMonsterEncounter(
          [{ monster, count }],
          partyCalc.thresholds,
          partyCalc.partySize
        );
        
        if (encounter.difficulty === targetDifficulty) {
          encounters.push(encounter);
        }
      }
    }
  }

  // Sort by how close they are to the target XP
  encounters.sort((a, b) => {
    const aDiff = Math.abs(a.adjustedXP - targetXP);
    const bDiff = Math.abs(b.adjustedXP - targetXP);
    return aDiff - bDiff;
  });

  // Return top 10 encounters
  return encounters.slice(0, 10);
}

export function getEncounterAdvice(encounter: MonsterEncounter, partyLevel: number): string[] {
  const advice: string[] = [];

  switch (encounter.difficulty) {
    case 'trivial':
      advice.push("This encounter is too easy and won't challenge the party.");
      advice.push("Consider adding more monsters or using stronger creatures.");
      break;
    case 'easy':
      advice.push("This is a good encounter for warming up or when resources are low.");
      advice.push("The party should handle this without much trouble.");
      break;
    case 'medium':
      advice.push("This encounter will challenge the party without being overwhelming.");
      advice.push("Perfect for regular adventuring encounters.");
      break;
    case 'hard':
      advice.push("This encounter will seriously challenge the party.");
      advice.push("Some characters may go down, and resources will be drained.");
      advice.push("Best used sparingly or as boss encounters.");
      break;
    case 'deadly':
      advice.push("⚠️ WARNING: This encounter could result in character deaths!");
      advice.push("Only use for climactic battles or with experienced players.");
      advice.push("Consider having escape routes or backup plans.");
      break;
  }

  if (encounter.monsters.length > 1) {
    const totalMonsters = encounter.monsters.reduce((sum, m) => sum + m.count, 0);
    if (totalMonsters >= 5) {
      advice.push("Multiple monsters can overwhelm the party with action economy.");
      advice.push("Consider the tactical complexity this adds to combat.");
    }
  }

  return advice;
}