export interface Scene {
  id: string;
  type: '事业' | '关系' | '健康' | '财富' | '成长';
  template: string;
  prompts: string[];
}

export interface Session {
  id: string;
  userId: string;
  sceneId: string;
  choices: {
    promptId: string;
    answer: string;
    timestamp: number;
  }[];
  emotions: string[];
  imagePrompt?: string;
  imageUrl?: string;
  completedAt?: number;
  createdAt: number;
}

export interface User {
  id: string;
  openId: string;
  nickname?: string;
  lastLoginAt: number;
  createdAt: number;
}