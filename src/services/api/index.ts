// // src/services/api/index.ts
// import type { Dialog, Message, Option, SceneType } from '../../types';
// import { MessageType } from '../../types';

// interface ApiResponse<T> {
//   data: T;
//   error?: string;
// }

// class ApiService {
//   private baseUrl: string;
  
//   constructor() {
//     this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
//   }

//   private async fetchApi<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     try {
//       const response = await fetch(`${this.baseUrl}${endpoint}`, {
//         ...options,
//         headers: {
//           'Content-Type': 'application/json',
//           ...options.headers,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'API request failed');
//       }

//       return { data };
//     } catch (error) {
//       console.error('API Error:', error);
//       return {
//         data: null as any,
//         error: error instanceof Error ? error.message : 'Unknown error occurred'
//       };
//     }
//   }

//   // Dialog related endpoints
//   async startDialog(userId: string, sceneType: SceneType): Promise<ApiResponse<Dialog>> {
//     return this.fetchApi<Dialog>('/dialogs', {
//       method: 'POST',
//       body: JSON.stringify({
//         userId,
//         sceneType,
//       }),
//     });
//   }

//   async sendMessage(
//     dialogId: string,
//     content: string,
//     options?: {
//       selectedOption?: Option;
//       emotions?: string[];
//     }
//   ): Promise<ApiResponse<{
//     message: Message;
//     shouldEnd: boolean;
//   }>> {
//     return this.fetchApi(`/dialogs/${dialogId}/messages`, {
//       method: 'POST',
//       body: JSON.stringify({
//         content,
//         ...options,
//       }),
//     });
//   }

//   async endDialog(
//     dialogId: string,
//     emotions: string[]
//   ): Promise<ApiResponse<{
//     summary: string;
//     imagePrompt: string;
//     imageUrl?: string;
//   }>> {
//     return this.fetchApi(`/dialogs/${dialogId}/end`, {
//       method: 'POST',
//       body: JSON.stringify({
//         emotions,
//       }),
//     });
//   }

//   async generateImage(
//     dialogId: string,
//     prompt: string
//   ): Promise<ApiResponse<{
//     imageUrl: string;
//   }>> {
//     return this.fetchApi(`/dialogs/${dialogId}/image`, {
//       method: 'POST',
//       body: JSON.stringify({
//         prompt,
//       }),
//     });
//   }
// }

// export const apiService = new ApiService();