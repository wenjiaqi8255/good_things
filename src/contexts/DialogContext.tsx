// src/contexts/DialogContext.tsx
import React, { createContext, useReducer, useContext, useCallback } from 'react';
import type { Option, SceneType } from '../types';
import {  MessageType, DialogPhase, DialogContextType } from '../types';
import { useLLMService } from '../hooks/useLLM';
import { dialogReducer
  , initialDialogState as initialState
 } from '../reducers/dialogReducer';
import { useRef, useEffect, useMemo} from 'react';
import { generateImage } from '../services/api/imageGeneration';

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dialogReducer, initialState);
  const llmService = useLLMService(); // 假设我们有这个 hook

  // 确保异步操作安全
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const startDialog = useCallback(async (userId: string, sceneType: SceneType) => {
    try {
      dispatch({ type: 'START_DIALOG', payload: { userId, sceneType } });
      
      const response = await llmService.getInitialMessage(sceneType);
      if (!isMounted.current) return;

      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          message: response.message,
          options: response.options
        }
      });
    } catch (error) {
      if (!isMounted.current) return;
      dispatch({ type: 'SET_ERROR', payload: error as Error });
    }
  }, [llmService]);

  const sendMessage = useCallback(async (content: string) => {
    if (state.phase !== DialogPhase.IN_PROGRESS) return;

    try {
      dispatch({
        type: 'SEND_MESSAGE',
        payload: {
          message: {
            id: Date.now().toString(),
            content,
            type: MessageType.USER,
            timestamp: Date.now()
          }
        }
      });

      const response = await llmService.sendMessage(content, state.runtime.messages);
      if (!isMounted.current) return;

      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          message: response.message,
          options: response.options
        }
      });

      // 检查是否需要进入总结阶段
      if (response.shouldSummarize) {
        await handleSummary();
      }
    } catch (error) {
      if (!isMounted.current) return;
      dispatch({ type: 'SET_ERROR', payload: error as Error });
    }
  }, [state.phase, state.runtime.messages, llmService]);

  const handleImageGeneration = useCallback(async (imagePrompt: string) => {
    if (!state.dialog?.id || state.phase !== DialogPhase.GENERATING_IMAGE) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const imageUrl = await generateImage(state.dialog.id, imagePrompt);
      
      if (!isMounted.current) return;
      
      dispatch({
        type: 'SET_IMAGE',
        payload: imageUrl
      });
      
      dispatch({ type: 'SET_PHASE', payload: DialogPhase.COMPLETED });
    } catch (error) {
      if (!isMounted.current) return;
      dispatch({ type: 'SET_ERROR', payload: error as Error });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.dialog?.id, state.phase]);

  // 在handleSummary中调用
  const handleSummary = useCallback(async () => {
    if (state.phase !== DialogPhase.SUMMARIZING) return;

    try {
      const { summary, imagePrompt } = await llmService.generateSummary(
        state.runtime.messages,
        state.runtime.emotions
      );
      
      if (!isMounted.current) return;

      dispatch({
        type: 'SET_SUMMARY',
        payload: { summary, imagePrompt }
      });

      dispatch({ type: 'SET_PHASE', payload: DialogPhase.GENERATING_IMAGE });
      
      // 自动开始生成图片
      await handleImageGeneration(imagePrompt);
    } catch (error) {
      if (!isMounted.current) return;
      dispatch({ type: 'SET_ERROR', payload: error as Error });
    }
  }, [state.phase, state.runtime.messages, state.runtime.emotions, llmService, handleImageGeneration]);

  const value = useMemo(() => ({
    state,
    startDialog,
    sendMessage,
    selectOption: (option: Option) => {
      dispatch({ type: 'SELECT_OPTION', payload: option });
    },
    toggleEmotion: (emotion: string) => {
      const currentEmotions = state.runtime.emotions;
      const newEmotions = currentEmotions.includes(emotion)
        ? currentEmotions.filter(e => e !== emotion)
        : [...currentEmotions, emotion];
      dispatch({ type: 'UPDATE_EMOTIONS', payload: newEmotions });
    },
    resetDialog: () => dispatch({ type: 'RESET' }),
    updateEmotions: (emotions: string[]) => 
      dispatch({ type: 'UPDATE_EMOTIONS', payload: emotions })
  }), [state, startDialog, sendMessage]);

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

// // 创建 Context
// const DialogContext = createContext<DialogContextType | undefined>(undefined);

// // 修改 DialogState，使用可选类型
// interface DialogState {
//   dialog: Dialog | null;
//   isLoading: boolean;
//   error: Error | null;
//   selectedOption?: Option;  // 使用可选属性
// }

// // 修改 action 类型定义，确保与 state 类型匹配
// type DialogAction =
//   | { type: 'START_DIALOG'; payload: { userId: string; sceneId: string } }
//   | { type: 'SET_DIALOG'; payload: Dialog }
//   | { type: 'ADD_MESSAGE'; payload: Message }
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_ERROR'; payload: Error | null }
//   | { type: 'SELECT_OPTION'; payload?: Option }  // 使用可选参数
//   | { type: 'SET_EMOTIONS'; payload: string[] }
//   | { type: 'COMPLETE_DIALOG'; payload: { summary: string; imagePrompt: string } }
//   | { type: 'RESET_DIALOG' };

// const initialState: DialogState = {
//   dialog: null,
//   isLoading: false,
//   error: null
//   // selectedOption 不设置初始值，默认为 undefined
// };

// function dialogReducer(state: DialogState, action: DialogAction): DialogState {
//   switch (action.type) {
//     case 'START_DIALOG':
//       return {
//         ...state,
//         isLoading: true,
//         error: null,
//         selectedOption: undefined  // 明确重置选项
//       };
//     case 'SET_DIALOG':
//       return {
//         ...state,
//         dialog: action.payload,
//         isLoading: false,
//         error: null
//       };
//     case 'ADD_MESSAGE':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           messages: [...state.dialog.messages, action.payload],
//         } : null
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload
//       };
//     case 'SET_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false
//       };
//     case 'SELECT_OPTION':
//       return {
//         ...state,
//         selectedOption: action.payload  // action.payload 已经是可选的了
//       };
//     case 'SET_EMOTIONS':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           emotions: action.payload,
//         } : null
//       };
//     case 'COMPLETE_DIALOG':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           status: DialogStatus.COMPLETED,
//           summary: action.payload.summary,
//           imagePrompt: action.payload.imagePrompt,
//           endTime: Date.now(),
//         } : null,
//         selectedOption: undefined  // 完成时清除选项
//       };
//     case 'RESET_DIALOG':
//       return initialState;
//     default:
//       return state;
//   }
// }

// export function DialogProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(dialogReducer, initialState);

//   const startDialog = useCallback(async (userId: string, sceneType: SceneType) => {
//     try {
//       dispatch({ type: 'START_DIALOG', payload: { userId, sceneId: sceneType } });
//       const dialog = await dialogService.startDialog(userId, sceneType);
//       dispatch({ type: 'SET_DIALOG', payload: dialog });
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error as Error });
//     }
//   }, []);

//   const sendMessage = useCallback(async (content: string) => {
//     if (!state.dialog) return;

//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });

//       const userMessage: Message = {
//         id: Date.now().toString(),
//         type: MessageType.USER,
//         content,
//         timestamp: Date.now(),
//       };
//       dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

//       const { response, shouldEnd } = await dialogService.sendMessage(
//         state.dialog,
//         content,
//         state.selectedOption
//       );

//       dispatch({ type: 'ADD_MESSAGE', payload: response });

//       if (shouldEnd) {
//         const { summary, imagePrompt } = await dialogService.endDialog(state.dialog);
//         dispatch({ 
//           type: 'COMPLETE_DIALOG',
//           payload: { summary, imagePrompt }
//         });
//       }
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: error as Error });
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//       dispatch({ type: 'SELECT_OPTION' });  // 不传 payload，会设置为 undefined
//     }
//   }, [state.dialog, state.selectedOption]);

//   const selectOption = useCallback((option: Option) => {
//     dispatch({ type: 'SELECT_OPTION', payload: option });
//   }, []);

//   const toggleEmotion = useCallback((emotion: string) => {
//     if (!state.dialog) return;
    
//     const currentEmotions = state.dialog.emotions || [];
//     const newEmotions = currentEmotions.includes(emotion)
//       ? currentEmotions.filter(e => e !== emotion)
//       : [...currentEmotions, emotion];
    
//     dispatch({ type: 'SET_EMOTIONS', payload: newEmotions });
//   }, [state.dialog]);

//   const resetDialog = useCallback(() => {
//     dispatch({ type: 'RESET_DIALOG' });
//   }, []);

//   return (
//     <DialogContext.Provider value={{
//       state,
//       startDialog,
//       sendMessage,
//       selectOption,
//       toggleEmotion,
//       resetDialog
//     }}>
//       {children}
//     </DialogContext.Provider>
//   );
// }

// export function useDialog() {
//   const context = useContext(DialogContext);
//   if (context === undefined) {
//     throw new Error('useDialog must be used within a DialogProvider');
//   }
//   return context;
// }



/*下面是测试代码 */

// import React, { createContext, useContext, useReducer, useCallback } from 'react';
// import type { Dialog, Message, Option, SceneType } from '../types';
// import { dialogService } from '../services/api/dialog';
// import { DialogStatus, MessageType } from '../types';

// interface DialogState {
//   dialog: Dialog | null;
//   isLoading: boolean;
//   error: Error | null;
//   selectedOption?: Option;
// }

// interface DialogContextType {
//   state: DialogState;
//   startDialog: (userId: string, sceneType: SceneType) => Promise<void>;
//   sendMessage: (content: string) => Promise<void>;
//   selectOption: (option: Option) => void;
//   toggleEmotion: (emotion: string) => void;
//   resetDialog: () => void;
// }

// const DialogContext = createContext<DialogContextType | undefined>(undefined);

// const initialState: DialogState = {
//   dialog: null,
//   isLoading: false,
//   error: null
// };

// type DialogAction = 
//   | { type: 'RESET_DIALOG' }
//   | { type: 'SELECT_OPTION'; payload?: Option }
//   | { type: 'SET_EMOTIONS'; payload: string[] }
//   | { type: 'SET_ERROR'; payload: Error | null }
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_DIALOG'; payload: Dialog }
//   | { type: 'ADD_MESSAGE'; payload: Message }
//   | { type: 'COMPLETE_DIALOG'; payload: { summary: string; imagePrompt: string } };

// function dialogReducer(state: DialogState, action: DialogAction): DialogState {
//   console.log('Reducer called with action:', action.type);
  
//   switch (action.type) {
//     case 'RESET_DIALOG':
//       return initialState;
      
//     case 'SELECT_OPTION':
//       return {
//         ...state,
//         selectedOption: action.payload
//       };
      
//     case 'SET_EMOTIONS':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           emotions: action.payload,
//         } : null
//       };
      
//     case 'SET_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false
//       };
      
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload,
//         error: null
//       };
      
//     case 'SET_DIALOG':
//       return {
//         ...state,
//         dialog: action.payload,
//         isLoading: false,
//         error: null
//       };

//     case 'ADD_MESSAGE':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           messages: [...state.dialog.messages, action.payload],
//         } : null
//       };

//     case 'COMPLETE_DIALOG':
//       return {
//         ...state,
//         dialog: state.dialog ? {
//           ...state.dialog,
//           status: DialogStatus.COMPLETED,
//           summary: action.payload.summary,
//           imagePrompt: action.payload.imagePrompt,
//           endTime: Date.now()
//         } : null,
//         isLoading: false
//       };
      
//     default:
//       return state;
//   }
// }

// export function DialogProvider({ children }: { children: React.ReactNode }) {
//   console.log('DialogProvider initializing');
  
//   const [state, dispatch] = useReducer(dialogReducer, initialState);

//   const startDialog = useCallback(async (userId: string, sceneType: SceneType) => {
//     console.log('startDialog called with:', { userId, sceneType });
    
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const dialog = await dialogService.startDialog(userId, sceneType);
//       dispatch({ type: 'SET_DIALOG', payload: dialog });
//     } catch (error) {
//       console.error('Failed to start dialog:', error);
//       dispatch({ 
//         type: 'SET_ERROR', 
//         payload: error instanceof Error ? error : new Error('Failed to start dialog') 
//       });
//     }
//   }, []);

//   const sendMessage = useCallback(async (content: string) => {
//     console.log('sendMessage called with:', content);
    
//     if (!state.dialog) {
//       console.error('No active dialog');
//       return;
//     }

//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });

//       // 添加用户消息
//       const userMessage: Message = {
//         id: Date.now().toString(),
//         type: MessageType.USER,
//         content,
//         timestamp: Date.now()
//       };
//       dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

//       // 调用服务发送消息
//       const { response, shouldEnd } = await dialogService.sendMessage(
//         state.dialog,
//         content,
//         state.selectedOption
//       );

//       // 添加系统响应
//       dispatch({ type: 'ADD_MESSAGE', payload: response });

//       // 如果对话应该结束
//       if (shouldEnd) {
//         const { summary, imagePrompt } = await dialogService.endDialog(state.dialog);
//         dispatch({ 
//           type: 'COMPLETE_DIALOG',
//           payload: { summary, imagePrompt }
//         });
//       }
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       dispatch({ 
//         type: 'SET_ERROR', 
//         payload: error instanceof Error ? error : new Error('Failed to send message') 
//       });
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//       dispatch({ type: 'SELECT_OPTION', payload: undefined });  // 清除选中的选项
//     }
//   }, [state.dialog, state.selectedOption]);

//   const selectOption = useCallback((option: Option) => {
//     console.log('selectOption called with:', option);
//     try {
//       dispatch({ type: 'SELECT_OPTION', payload: option });
//     } catch (error) {
//       dispatch({ 
//         type: 'SET_ERROR', 
//         payload: error instanceof Error ? error : new Error('Failed to select option')
//       });
//     }
//   }, []);

//   const toggleEmotion = useCallback((emotion: string) => {
//     console.log('toggleEmotion called with:', emotion);
//     try {
//       if (!state.dialog) return;
      
//       const currentEmotions = state.dialog.emotions || [];
//       const newEmotions = currentEmotions.includes(emotion)
//         ? currentEmotions.filter(e => e !== emotion)
//         : [...currentEmotions, emotion];
      
//       dispatch({ type: 'SET_EMOTIONS', payload: newEmotions });
//     } catch (error) {
//       dispatch({ 
//         type: 'SET_ERROR', 
//         payload: error instanceof Error ? error : new Error('Failed to toggle emotion')
//       });
//     }
//   }, [state.dialog]);

//   const resetDialog = useCallback(() => {
//     console.log('resetDialog called');
//     try {
//       dispatch({ type: 'RESET_DIALOG' });
//     } catch (error) {
//       dispatch({ 
//         type: 'SET_ERROR', 
//         payload: error instanceof Error ? error : new Error('Failed to reset dialog')
//       });
//     }
//   }, []);

//   const value = {
//     state,
//     startDialog,
//     sendMessage,
//     selectOption,
//     toggleEmotion,
//     resetDialog
//   };

//   return (
//     <DialogContext.Provider value={value}>
//       {children}
//     </DialogContext.Provider>
//   );
// }

// export function useDialog() {
//   console.log('useDialog called');
//   const context = useContext(DialogContext);
//   if (context === undefined) {
//     console.error('Dialog context is undefined');
//     throw new Error('useDialog must be used within a DialogProvider');
//   }
//   return context;
// }