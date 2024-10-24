export type PartsNames = "engine" | "chassis" | "brakes" | "visual";

const PARTS_BASE = {
  visual: 1,
  chassis: 2,
  brakes: 4,
  engine: 7,
} as const;

export const REFERER_REWARDS = {
  5: 25_000,
  10: 50_000,
  25: 250_000,
  50: 500_000,
  100: 5_000_000,
} as const;

export type PartsBaseKey = keyof typeof PARTS_BASE;
export type RefererRewardsKey = keyof typeof REFERER_REWARDS;

type AllParts = {
  [key in PartsBaseKey]: number;
};

export const getPartCost = (part: PartsNames, oldLevel: number) => {
  return PARTS_BASE[part] * 1.5 ** oldLevel;
};

export const getLevelAndPower = (parts: AllParts) => {
  let power = 0;
  let level = 0;

  let key: PartsBaseKey;
  for (key in parts) {
    const partLevel = parts[key];

    level += partLevel;
    power += partLevel * PARTS_BASE[key];
  }

  return {
    level,
    power,
  };
};
