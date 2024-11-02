import { SceneType } from '../../types';
import { LLMMessage } from '../external/types';
import { SYSTEM_PROMPT, SCENE_TEMPLATES, SUMMARY_PROMPT, IMAGE_PROMPT } from './templates';

export class PromptBuilder {
  private messages: LLMMessage[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.messages = [{
      role: 'system',
      content: SYSTEM_PROMPT
    }];
    return this;
  }

  addUserMessage(content: string) {
    this.messages.push({
      role: 'user',
      content
    });
    return this;
  }

  addAssistantMessage(content: string) {
    this.messages.push({
      role: 'assistant',
      content
    });
    return this;
  }

  buildInitialPrompt(sceneType: SceneType): LLMMessage[] {
    return [
      ...this.messages,
      {
        role: 'user',
        content: SCENE_TEMPLATES[sceneType]
      }
    ];
  }

  buildSummaryPrompt(emotions: string[]): LLMMessage[] {
    return [
      ...this.messages,
      {
        role: 'user',
        content: SUMMARY_PROMPT(emotions)
      }
    ];
  }

  buildImagePrompt(summary: string): LLMMessage[] {
    return [{
      role: 'user',
      content: IMAGE_PROMPT(summary)
    }];
  }

  getMessages(): LLMMessage[] {
    return this.messages;
  }
}

// 导出实例
export const promptBuilder = new PromptBuilder();