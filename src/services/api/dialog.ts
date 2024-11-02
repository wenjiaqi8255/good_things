import type { Dialog, Message, Option, SceneType } from '../../types';
import { MessageType, DialogStatus } from '../../types';
import { llmService } from '../external/llm';
import { promptBuilder } from '../prompt/builder';
import { responseParser } from '../parser/responseParser';
import { LLMError } from '../external/types';

export class DialogService {
  async startDialog(userId: string, sceneType: SceneType): Promise<Dialog> {
    try {
      // 创建新对话
      const dialog: Dialog = {
        id: `dialog-${Date.now()}`,
        userId,
        sceneId: sceneType,
        messages: [],
        status: DialogStatus.ACTIVE,
        emotions: [],
        startTime: Date.now()
      };

      // 准备并发送初始提示
      const initialMessages = promptBuilder.reset().buildInitialPrompt(sceneType);
      const llmResponse = await llmService.generateResponse(initialMessages);
      const parsedResponse = responseParser.parse(llmResponse);

      // 添加系统响应消息
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        content: parsedResponse.content,
        options: parsedResponse.options,
        timestamp: Date.now(),
        sensoryDetails: parsedResponse.sensoryDetails,
        emotionalResponse: parsedResponse.emotionalResponse
      };

      dialog.messages = [systemMessage];
      return dialog;
    } catch (error) {
      console.error('Failed to start dialog:', error);
      throw error;
    }
  }

  async sendMessage(
    dialog: Dialog,
    content: string,
    selectedOption?: Option  // 改为可选参数
  ): Promise<{ 
    response: Message,
    shouldEnd: boolean
  }> {
    try {
      // 构建发送到 LLM 的消息
      const prompt = selectedOption 
        ? `选择的选项: ${selectedOption.text}\n${content}`
        : content;

      // 获取 LLM 响应
      const llmResponse = await llmService.generateResponse(
        promptBuilder.getMessages()
      );
      
      // 解析响应
      const parsedResponse = responseParser.parse(llmResponse);
      
      // 构建响应消息
      const responseMessage: Message = {
        id: Date.now().toString(),
        type: MessageType.SYSTEM,
        content: parsedResponse.content,
        options: parsedResponse.options || undefined,  // 明确处理空值情况
        timestamp: Date.now(),
        sensoryDetails: parsedResponse.sensoryDetails,
        emotionalResponse: parsedResponse.emotionalResponse
      };

      return {
        response: responseMessage,
        shouldEnd: parsedResponse.shouldEnd || false
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async endDialog(dialog: Dialog): Promise<{
    summary: string;
    imagePrompt: string;
  }> {
    try {
      // 生成对话总结
      const summaryMessages = promptBuilder.buildSummaryPrompt(dialog.emotions || []);
      const summaryResponse = await llmService.generateResponse(summaryMessages);
      const summary = summaryResponse.content;

      // 生成图像提示
      const imagePromptMessages = promptBuilder.buildImagePrompt(summary);
      const imagePromptResponse = await llmService.generateResponse(imagePromptMessages);
      const imagePrompt = imagePromptResponse.content;

      return {
        summary,
        imagePrompt
      };
    } catch (error) {
      console.error('Failed to end dialog:', error);
      throw error;
    }
  }
}

export const dialogService = new DialogService();