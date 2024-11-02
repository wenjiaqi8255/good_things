// hooks/useDialog.ts
import { createContext, useContext, useReducer } from 'react';
import { DialogContextType, DialogPhase } from '../types'; // 添加必要的类型导入

// 创建并声明Context类型
const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }

  // TypeScript现在可以正确识别context的结构
  const {
    state: { phase, runtime: { messages, currentOptions, emotions, error } },
    ...actions
  } = context;

  const canSendMessage = phase === DialogPhase.IN_PROGRESS;
  const canSelectEmotion = phase !== DialogPhase.COMPLETED && phase !== DialogPhase.ERROR;

  return {
    phase,
    messages,
    currentOptions,
    emotions,
    error,
    canSendMessage,
    canSelectEmotion,
    ...actions
  };
}