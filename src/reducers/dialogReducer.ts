import { 
    DialogState, 
    DialogAction, 
    DialogPhase, 
    Message, 
    Dialog,
    DialogStatus,
    SceneType
  } from '../types';
  
  // 工具函数：检查是否应该进入总结阶段
  const checkShouldSummarize = (messages: Message[]): boolean => {
    const messageCount = messages.length;
    if (messageCount < 4) return false;
  
    // 检查最近的消息是否包含总结关键词
    const recentMessages = messages.slice(-2);
    const summaryKeywords = ['总结', '回顾', '这段时间'];
    
    return recentMessages.some(message => 
      summaryKeywords.some(keyword => message.content.includes(keyword))
    );
  };
  
  // 初始状态
  export const initialDialogState: DialogState = {
    phase: DialogPhase.INITIAL,
    dialog: null,
    runtime: {
      messages: [],
      currentOptions: [],
      emotions: [],
      error: null,
      isLoading: false,
      selectedOption: null
    }
  };
  
  // Reducer实现
  export const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
    switch (action.type) {
      case 'START_DIALOG': {
        const newDialog: Dialog = {
          id: `dialog-${Date.now()}`,
          userId: action.payload.userId,
          sceneType: action.payload.sceneType,
          status: DialogStatus.ACTIVE,
          startTime: Date.now()
        };
  
        return {
          ...state,
          phase: DialogPhase.SCENE_SELECTED,
          dialog: newDialog,
          runtime: {
            ...state.runtime,
            messages: [],
            currentOptions: [],
            emotions: [],
            error: null
          }
        };
      }
  
      case 'RECEIVE_MESSAGE': {
        const shouldSummarize = checkShouldSummarize(state.runtime.messages);
        const newMessages = [...state.runtime.messages, action.payload.message];
  
        return {
          ...state,
          phase: shouldSummarize ? DialogPhase.SUMMARIZING : DialogPhase.IN_PROGRESS,
          runtime: {
            ...state.runtime,
            messages: newMessages,
            currentOptions: action.payload.options
          }
        };
      }
  
      case 'SEND_MESSAGE': {
        return {
          ...state,
          runtime: {
            ...state.runtime,
            messages: [...state.runtime.messages, action.payload.message],
            currentOptions: []  // 清空当前选项
          }
        };
      }
  
      case 'UPDATE_EMOTIONS': {
        return {
          ...state,
          runtime: {
            ...state.runtime,
            emotions: action.payload
          }
        };
      }
  
      case 'START_SUMMARY': {
        if (!state.dialog) return state;
  
        return {
          ...state,
          phase: DialogPhase.SUMMARIZING,
          dialog: {
            ...state.dialog,
            status: DialogStatus.COMPLETED
          }
        };
      }
  
      case 'SET_SUMMARY': {
        if (!state.dialog) return state;
  
        return {
          ...state,
          phase: DialogPhase.GENERATING_IMAGE,
          dialog: {
            ...state.dialog,
            summary: action.payload.summary,
            imagePrompt: action.payload.imagePrompt
          }
        };
      }
  
      case 'SET_IMAGE': {
        if (!state.dialog) return state;
  
        return {
          ...state,
          phase: DialogPhase.COMPLETED,
          dialog: {
            ...state.dialog,
            imageUrl: action.payload
          }
        };
      }
  
      case 'SET_ERROR': {
        return {
          ...state,
          phase: DialogPhase.ERROR,
          runtime: {
            ...state.runtime,
            error: action.payload
          }
        };
      }
  
      case 'RESET': {
        return initialDialogState;
      }
  
      default: {
        return state;
      }
    }
  };