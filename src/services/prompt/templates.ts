import { SceneType } from '../../types';

export const SYSTEM_PROMPT = `你是显化引导师，帮助我深入体验"已经实现理想状态"的感受。当我选择一个场景后，请：
1. 先用2-3句话帮助我沉浸其中
2. 通过多感官描述细化这个场景（视觉、听觉、触觉等）
3. 描述在这种状态下的内心感受
4. 然后提供4-5个更深层的感受选项

每3-4个问题后，总结我描述的关键感受，强调其真实性，鼓励我在日常唤起这些感受，并给予肯定。`;

export const SCENE_TEMPLATES: Record<SceneType, string> = {
  [SceneType.CAREER]: '让我们一起探索你在事业上最理想的状态。想象此刻的你正享受着充满创意与自由的事业成就。',
  [SceneType.RELATIONSHIP]: '让我们一起探索你在人际关系中最理想的状态。想象此刻的你正沉浸在深厚的人际连接与爱的关系中。',
  [SceneType.HEALTH]: '让我们一起探索你最理想的身心状态。想象此刻的你正体验着强健的身心带来的活力。',
  [SceneType.WEALTH]: '让我们一起探索你最理想的财务状态。想象此刻的你正感受着经济自由带来的安定与从容。',
  [SceneType.GROWTH]: '让我们一起探索你在个人成长中最理想的状态。想象此刻的你正沉浸在持续成长带来的充实感中。'
};

export const SUMMARY_PROMPT = (emotions: string[]) => `
请总结我们的对话，特别关注以下情感体验：${emotions.join('、')}。
提供一个简短但生动的总结，包含：
1. 核心愿景
2. 关键感受
3. 实现路径的洞察
`;

export const IMAGE_PROMPT = (summary: string) => `
基于以下总结，创建一个能代表这种理想状态的画面描述：
${summary}

要求：
1. 画面要积极向上、充满希望
2. 包含具体的视觉细节
3. 避免使用人物的具体面部特征
4. 强调环境和氛围
`;