export type LLMRole = 'system' | 'user' | 'assistant';

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export interface LLMResponse {
  content: string;
  rawResponse: any; // Groq API 响应类型
}

export class LLMError extends Error {
  constructor(
    public code: 'NO_RESPONSE' | 'API_ERROR' | 'INVALID_RESPONSE',
    message: string
  ) {
    super(message);
    this.name = 'LLMError';
  }
}