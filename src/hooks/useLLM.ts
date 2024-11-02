// src/hooks/useLLM.ts
import { useCallback } from 'react';
import type { Message, Option, SceneType } from '../types';
import { llmService } from '../services/external/llm';
import { MessageType } from '../types';

interface LLMResponse {
  message: Message;
  options: Option[];
  shouldSummarize?: boolean;
}

export function useLLMService() {
  const getInitialMessage = useCallback(async (sceneType: SceneType): Promise<LLMResponse> => {
    // 实现初始消息获取逻辑
    const response = await llmService.generateResponse([/* 初始提示 */]);
    // 解析响应并返回合适的格式
    return {
      message: {
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        content: response.content,
        timestamp: Date.now()
      },
      options: [] // 解析选项
    };
  }, []);

  const sendMessage = useCallback(async (
    content: string, 
    messages: Message[]
  ): Promise<LLMResponse> => {
    // 实现消息发送逻辑
    return {
      message: {
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        content: '',
        timestamp: Date.now()
      },
      options: []
    };
  }, []);

  const generateSummary = useCallback(async (
    messages: Message[],
    emotions: string[]
  ) => {
    // 实现总结生成逻辑
    return {
      summary: '',
      imagePrompt: ''
    };
  }, []);

  return {
    getInitialMessage,
    sendMessage,
    generateSummary
  };
}