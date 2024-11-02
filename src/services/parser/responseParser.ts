import { LLMResponse } from '../external/types';

export interface ParsedResponse {
  content: string;
  options?: Option[];
  sensoryDetails?: {
    visual?: string[];
    auditory?: string[];
    tactile?: string[];
  };
  emotionalResponse?: string[];
  shouldEnd?: boolean;
}

interface Option {
  id: string;
  text: string;
  type: string;
}

export class ResponseParser {
  parse(response: LLMResponse): ParsedResponse {
    const content = response.content;
    
    return {
      content,
      options: this.extractOptions(content),
      sensoryDetails: this.extractSensoryDetails(content),
      emotionalResponse: this.extractEmotionalResponse(content),
      shouldEnd: this.checkShouldEnd(content)
    };
  }

  private extractOptions(content: string): Option[] {
    // 提取选项的逻辑，例如寻找数字列表或者特定格式
    const optionMatches = content.match(/\d+\.\s+([^\n]+)/g) || [];
    
    return optionMatches.map((match, index) => ({
      id: `option-${index + 1}`,
      text: match.replace(/^\d+\.\s+/, '').trim(),
      type: 'default'
    }));
  }

  private extractSensoryDetails(content: string): ParsedResponse['sensoryDetails'] {
    const sensoryDetails: ParsedResponse['sensoryDetails'] = {};
    
    // 提取视觉细节
    const visualMatch = content.match(/(?:看到|视觉|眼前)([^。]+)。/);
    if (visualMatch) {
      sensoryDetails.visual = visualMatch[1].split('、').map(s => s.trim());
    }

    // 提取听觉细节
    const auditoryMatch = content.match(/(?:听到|声音|耳边)([^。]+)。/);
    if (auditoryMatch) {
      sensoryDetails.auditory = auditoryMatch[1].split('、').map(s => s.trim());
    }

    // 提取触觉细节
    const tactileMatch = content.match(/(?:感受到|触觉|身体)([^。]+)。/);
    if (tactileMatch) {
      sensoryDetails.tactile = tactileMatch[1].split('、').map(s => s.trim());
    }

    return Object.keys(sensoryDetails).length ? sensoryDetails : undefined;
  }

  private extractEmotionalResponse(content: string): string[] {
    // 提取情感相关的词语
    const emotionalWords = [
      '开心', '快乐', '满足', '兴奋', '期待', '平静', '自信',
      '充实', '感激', '温暖', '放松', '安心'
    ];
    
    const emotions = emotionalWords.filter(word => content.includes(word));
    return emotions.length ? emotions : [];
  }

  private checkShouldEnd(content: string): boolean {
    // 检查是否应该结束对话的逻辑
    const endSignals = [
      '总结一下',
      '让我们回顾',
      '这段时间以来',
      '通过我们的对话'
    ];
    
    return endSignals.some(signal => content.includes(signal));
  }
}

export const responseParser = new ResponseParser();