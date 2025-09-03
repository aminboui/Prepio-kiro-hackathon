// Level system for Prepio - Gamification like Duolingo!

export interface Level {
  level: number;
  name: string;
  description: string;
  minChallenges: number;
  maxChallenges: number;
  badge: string;
  color: string;
  emoji: string;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    name: "Code Hatchling",
    description: "Just starting your coding journey!",
    minChallenges: 1,
    maxChallenges: 10,
    badge: "🥚",
    color: "#10b981", // emerald
    emoji: "🐣"
  },
  {
    level: 2,
    name: "Bug Hunter",
    description: "Learning to spot and fix bugs!",
    minChallenges: 11,
    maxChallenges: 20,
    badge: "🔍",
    color: "#3b82f6", // blue
    emoji: "🐛"
  },
  {
    level: 3,
    name: "Code Ninja",
    description: "Stealthy problem solver!",
    minChallenges: 21,
    maxChallenges: 50,
    badge: "🥷",
    color: "#8b5cf6", // violet
    emoji: "⚔️"
  },
  {
    level: 4,
    name: "Algorithm Wizard",
    description: "Master of efficient solutions!",
    minChallenges: 51,
    maxChallenges: 100,
    badge: "🧙‍♂️",
    color: "#f59e0b", // amber
    emoji: "✨"
  },
  {
    level: 5,
    name: "Code Dragon",
    description: "Legendary programming skills!",
    minChallenges: 101,
    maxChallenges: 200,
    badge: "🐉",
    color: "#ef4444", // red
    emoji: "🔥"
  },
  {
    level: 6,
    name: "Syntax Sage",
    description: "Wise in the ways of code!",
    minChallenges: 201,
    maxChallenges: 500,
    badge: "🧠",
    color: "#06b6d4", // cyan
    emoji: "📚"
  },
  {
    level: 7,
    name: "Debug Deity",
    description: "Divine debugging powers!",
    minChallenges: 501,
    maxChallenges: 1000,
    badge: "⚡",
    color: "#8b5cf6", // violet
    emoji: "👑"
  },
  {
    level: 8,
    name: "Code Cosmos",
    description: "Your skills are out of this world!",
    minChallenges: 1001,
    maxChallenges: Infinity,
    badge: "🌌",
    color: "#6366f1", // indigo
    emoji: "🚀"
  }
];

export function getUserLevel(totalChallenges: number): Level {
  for (const level of LEVELS) {
    if (totalChallenges >= level.minChallenges && totalChallenges <= level.maxChallenges) {
      return level;
    }
  }
  return LEVELS[0]; // Default to first level
}

export function getNextLevel(currentLevel: Level): Level | null {
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
}

export function getProgressToNextLevel(totalChallenges: number, currentLevel: Level): {
  current: number;
  needed: number;
  percentage: number;
} {
  const nextLevel = getNextLevel(currentLevel);
  if (!nextLevel) {
    return { current: totalChallenges, needed: 0, percentage: 100 };
  }
  
  const current = totalChallenges - currentLevel.minChallenges + 1;
  const needed = nextLevel.minChallenges - currentLevel.minChallenges;
  const percentage = Math.min((current / needed) * 100, 100);
  
  return { current, needed, percentage };
}