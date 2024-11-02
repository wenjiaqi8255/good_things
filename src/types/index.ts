export enum SceneType {
  CAREER = 'CAREER',
  RELATIONSHIP = 'RELATIONSHIP',
  HEALTH = 'HEALTH',
  WEALTH = 'WEALTH',
  GROWTH = 'GROWTH'
}

export interface UserPreferences {
  preferredScenes?: SceneType[];
  notifications?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

// Base user type without Clerk dependency
export interface User {
  id: string;
  preferences?: UserPreferences;
  lastActiveAt?: number;
  dialogHistory?: {
    dialogId: string;
    sceneType: SceneType;
    completedAt: number;
  }[];
}

// Clerk user properties we care about
export interface ClerkUserData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
  emailAddresses?: { emailAddress: string }[];
}

// Combined type for when we need full user data
export type AppUser = User & {
  clerkData: ClerkUserData;
}

// 持久化模型
export interface Dialog {
  id: string;
  userId: string;
  sceneType: SceneType;  // 改为 SceneType
  status: DialogStatus;
  startTime: number;
  endTime?: number;
  summary?: string;
  imagePrompt?: string;
  imageUrl?: string;
}

// 运行时状态
export interface DialogState {
  phase: DialogPhase;
  dialog: Dialog | null;
  runtime: {
    messages: Message[];
    currentOptions: Option[];
    emotions: string[];
    error: Error | null;
    isLoading: boolean;  // 添加 loading 状态
    selectedOption: Option | null;  // 添加选中选项
  }
}

export enum DialogStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

// Context 类型定义
export interface DialogContextType {
  state: DialogState;
  startDialog: (userId: string, sceneType: SceneType) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  selectOption: (option: Option) => void;
  toggleEmotion: (emotion: string) => void;
  resetDialog: () => void;
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
  options?: Option[];  
  sensoryDetails?: {
    visual?: string[];
    auditory?: string[];
    tactile?: string[];
  };
  emotionalResponse?: string[];
}

export enum MessageType {
  SYSTEM = 'system',
  USER = 'user'
}

export interface Option {
  id: string;
  text: string;
  type: string;
}
export interface DialogServiceResponse {
  response: Message;
  shouldEnd: boolean;
}

// types/dialog.ts
export enum DialogPhase {
  INITIAL = 'INITIAL',
  SCENE_SELECTED = 'SCENE_SELECTED',
  IN_PROGRESS = 'IN_PROGRESS', 
  SUMMARIZING = 'SUMMARIZING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type DialogAction = 
  | { type: 'START_DIALOG'; payload: { userId: string; sceneType: SceneType } }
  | { type: 'RECEIVE_MESSAGE'; payload: { message: Message; options: Option[] } }
  | { type: 'SEND_MESSAGE'; payload: { message: Message } }
  | { type: 'UPDATE_EMOTIONS'; payload: string[] }
  | { type: 'START_SUMMARY' }
  | { type: 'SET_SUMMARY'; payload: { summary: string; imagePrompt: string } }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PHASE'; payload: DialogPhase }
  | { type: 'SELECT_OPTION'; payload: Option };

