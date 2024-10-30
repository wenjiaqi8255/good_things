import type { Session } from '../types';

const SD_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

export class ImageGenerationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch(SD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          steps: 30,
          width: 1024,
          height: 1024,
          samples: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      return data.artifacts[0].base64;
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw new Error('图片生成失败，请稍后重试');
    }
  }

  async processSession(session: Session): Promise<string> {
    if (!session.imagePrompt) {
      throw new Error('No image prompt available');
    }

    try {
      const imageUrl = await this.generateImage(session.imagePrompt);
      return imageUrl;
    } catch (error) {
      console.error('Session image processing failed:', error);
      throw error;
    }
  }
}