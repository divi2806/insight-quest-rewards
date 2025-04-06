
export type User = {
  id: string;
  address: string;
  username?: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  tokensEarned: number;
  timeSaved: number;
  tasksCompleted: number;
  insightValue: number;
  leetcodeVerified: boolean;
  leetcodeUsername?: string;
  verificationToken?: string;
  stage: "Spark" | "Glow" | "Blaze" | "Nova" | "Orbit";
  lastLogin?: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "leetcode" | "course" | "video";
  status: "pending" | "completed" | "verified";
  reward: number;
  xpReward: number;
  url?: string;
  dateCreated: string;
  dateCompleted?: string;
  platformId?: string;
};

export type LeaderboardEntry = {
  address: string;
  username?: string;
  avatarUrl?: string;
  level: number;
  tokensEarned: number;
  insightValue: number;
  tasksCompleted: number;
  rank: number;
  stage: "Spark" | "Glow" | "Blaze" | "Nova" | "Orbit";
};
