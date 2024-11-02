import type { Dialog } from '../../types';

// Together API configuration
const TOGETHER_API_URL = 'https://api.together.xyz/inference';
const DEFAULT_MODEL = 'black-forest-labs/FLUX.1-schnell-Free';

interface TogetherImageResponse {
  data: {
    b64_json: string;
  }[];
}

interface GenerateImageOptions {
  width?: number;
  height?: number;
  steps?: number;
  samples?: number;
}

export class ImageGenerationService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateImage(
    prompt: string, 
    options: GenerateImageOptions = {}
  ): Promise<string> {
    const {
      width = 1024,
      height = 768,
      steps = 4,
      samples = 1
    } = options;

    try {
      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          width,
          height,
          steps,
          n: samples,
          response_format: 'b64_json'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Image generation failed: ${errorData.error?.message || response.statusText}`
        );
      }

      const data: TogetherImageResponse = await response.json();
      
      if (!data.data?.[0]?.b64_json) {
        throw new Error('Invalid response format from Together API');
      }

      // Convert base64 to URL
      return `data:image/png;base64,${data.data[0].b64_json}`;
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw new Error('图片生成失败，请稍后重试');
    }
  }

  async processDialog(dialog: Dialog): Promise<string> {
    if (!dialog.imagePrompt) {
      throw new Error('对话中没有可用的图像提示');
    }

    try {
      // Customize image parameters based on dialog context
      const options: GenerateImageOptions = {
        width: 1024,
        height: 768,
        steps: 4, 
        samples: 1
      };

      const imageUrl = await this.generateImage(dialog.imagePrompt, options);
      return imageUrl;
    } catch (error) {
      console.error('Dialog image processing failed:', error);
      throw error;
    }
  }

  // Helper method to change model if needed
  setModel(model: string) {
    this.model = model;
  }
}

// Export default configuration
export const DEFAULT_IMAGE_CONFIG = {
  model: DEFAULT_MODEL,
  width: 1024,
  height: 768,
  steps: 4,
  samples: 1
};
