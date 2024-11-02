import { Groq } from 'groq-sdk';
import { LLMResponse, LLMMessage, LLMError } from './types';

export class LLMService {
  private client: Groq;
  private defaultConfig = {
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: false
  };

  constructor(apiKey: string) {
    this.client = new Groq({
      apiKey: apiKey || import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: process.env.NODE_ENV === 'development'  // 只在开发环境允许
    });
  }

  async generateResponse(messages: LLMMessage[]): Promise<LLMResponse> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages,
        ...this.defaultConfig
      });

      // 显式处理 Promise 返回值类型
      if ('choices' in chatCompletion && Array.isArray(chatCompletion.choices)) {
        const response = chatCompletion.choices[0]?.message?.content;
        
        if (!response) {
          throw new LLMError('NO_RESPONSE', 'No response received from LLM');
        }

        return {
          content: response,
          rawResponse: chatCompletion
        };
      }

      // 处理流式响应
      throw new LLMError('INVALID_RESPONSE', 'Received stream instead of completion');
      
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      throw new LLMError(
        'API_ERROR',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  setConfig(config: Partial<typeof this.defaultConfig>) {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...config
    };
  }
}

// 单例模式导出实例
export const llmService = new LLMService(import.meta.env.VITE_GROQ_API_KEY);