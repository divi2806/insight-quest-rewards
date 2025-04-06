
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

export const formatTokenAmount = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

export const calculateInsightValue = (tokens: number): number => {
  // Simple conversion rate: 1 token = $5 of insight value
  return tokens * 5;
};

export const calculateLevel = (xp: number): number => {
  // Simple level calculation: Each level requires progressively more XP
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateLevelProgress = (xp: number): number => {
  // Calculate progress to the next level (0-100%)
  const currentLevel = calculateLevel(xp);
  const currentLevelMinXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelMinXP = Math.pow(currentLevel, 2) * 100;
  return ((xp - currentLevelMinXP) / (nextLevelMinXP - currentLevelMinXP)) * 100;
};

export const getRandomToken = (length = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};
