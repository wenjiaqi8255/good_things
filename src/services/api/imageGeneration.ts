// src/services/api/imageGeneration.ts
interface GenerateImageResponse {
    imageUrl: string;
    error?: string;
  }
  
  export async function generateImage(dialogId: string, imagePrompt: string): Promise<string> {
    try {
      const response = await fetch('/api/dialogs/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dialogId,
          imagePrompt
        })
      });
  
      if (!response.ok) {
        throw new Error('Image generation failed');
      }
  
      const data: GenerateImageResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
  
      return data.imageUrl;
    } catch (error) {
      console.error('Failed to generate image:', error);
      throw error;
    }
  }