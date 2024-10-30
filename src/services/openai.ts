import type { Session } from '../types';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的显化引导师，擅长通过提问帮助用户具象化他们的理想状态。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI response generation failed:', error);
      throw new Error('生成回应时出现错误，请稍后重试');
    }
  }

  async generateImagePrompt(session: Session): Promise<string> {
    const prompt = `基于以下显化过程内容，生成一个详细的图像描述：\n\n${
      session.choices.map(c => c.answer).join('\n')
    }\n\n情绪关键词：${session.emotions.join(', ')}`;

    try {
      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('Image prompt generation failed:', error);
      throw new Error('生成图像提示词时出现错误，请稍后重试');
    }
  }
}