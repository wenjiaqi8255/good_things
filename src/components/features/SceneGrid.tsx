import React from 'react';
import { Sparkles, Users, Brain, Coins, GraduationCap } from 'lucide-react';
import { useDialog } from '../../contexts/DialogContext';
import { useAuth } from '../../contexts/AuthContext';
import { SceneType } from '../../types';

interface Scene {
  id: string;
  type: SceneType;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  template: string;
  prompts: string[];
}

const scenes: Scene[] = [
  {
    id: 'career',
    type: SceneType.CAREER,
    icon: Sparkles,
    title: '事业成就',
    description: '探索职业理想，实现事业突破',
    template: '让我们一起探索你的职业理想',
    prompts: ['你理想的工作是什么样的？', '你希望在事业上达到什么样的高度？']
  },
  {
    id: 'relationship',
    type: SceneType.RELATIONSHIP,
    icon: Users,
    title: '人际关系',
    description: '建立深层连接，拓展社交圈层',
    template: '让我们一起探索你的人际关系',
    prompts: ['你期待的人际关系是什么样的？', '你希望如何改善现有的人际关系？']
  },
  {
    id: 'health',
    type: SceneType.HEALTH,
    icon: Brain,
    title: '身心健康',
    description: '平衡身心，提升生活质量',
    template: '让我们一起探索你的健康状态',
    prompts: ['你理想的健康状态是什么样的？', '你希望如何改善当前的生活方式？']
  },
  {
    id: 'wealth',
    type: SceneType.WEALTH,
    icon: Coins,
    title: '经济自由',
    description: '规划财务，实现经济独立',
    template: '让我们一起探索你的财务目标',
    prompts: ['你对经济自由的定义是什么？', '你期望达到什么样的财务状况？']
  },
  {
    id: 'growth',
    type: SceneType.GROWTH,
    icon: GraduationCap,
    title: '个人成长',
    description: '持续学习，突破自我边界',
    template: '让我们一起探索你的成长之路',
    prompts: ['你希望在哪些方面实现突破？', '你理想的学习和成长路径是什么？']
  }
];

interface SceneCardProps {
  scene: Scene;
  onClick: (scene: Scene) => void;
}

function SceneCard({ scene, onClick }: SceneCardProps) {
  const Icon = scene.icon;
  
  return (
    <button
      onClick={() => onClick(scene)}
      className="w-full text-left bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <Icon className="w-10 h-10 text-purple-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{scene.title}</h3>
      <p className="text-gray-600">{scene.description}</p>
    </button>
  );
}

interface SceneGridProps {
  onSceneSelect: (scene: Scene) => void;
}

export function SceneGrid({ onSceneSelect }: SceneGridProps) {
  const { user } = useAuth();
  const { startDialog, sendMessage } = useDialog();

  const handleSceneSelect = async (scene: Scene) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 初始化对话
      await startDialog(user.id, scene.type);

      // 构造初始提示信息
      const initialPrompt = `让我们开始体验你理想的生活状态。此刻的你处在最理想的人生阶段，正在${scene.description}`;

      // 发送初始消息并获取响应
      await sendMessage(initialPrompt);

      // 通知父组件场景已选择
      onSceneSelect(scene);
    } catch (error) {
      console.error('Failed to start dialog:', error);
      // 这里可以添加错误处理UI反馈
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onClick={handleSceneSelect}
          />
        ))}
      </div>
    </section>
  );
}

export type { Scene };