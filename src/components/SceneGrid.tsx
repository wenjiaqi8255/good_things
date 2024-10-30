import React from 'react';
import { Sparkles, Users, Brain, Coins, GraduationCap } from 'lucide-react';
import type { Scene } from '../types';

const scenes = [
  {
    id: 'career',
    type: '事业',
    icon: Sparkles,
    title: '事业成就',
    description: '探索职业理想，实现事业突破',
    template: '让我们一起探索你的职业理想',
    prompts: ['你理想的工作是什么样的？', '你希望在事业上达到什么样的高度？']
  },
  {
    id: 'relationship',
    type: '关系',
    icon: Users,
    title: '人际关系',
    description: '建立深层连接，拓展社交圈层',
    template: '让我们一起探索你的人际关系',
    prompts: ['你期待的人际关系是什么样的？', '你希望如何改善现有的人际关系？']
  },
  {
    id: 'health',
    type: '健康',
    icon: Brain,
    title: '身心健康',
    description: '平衡身心，提升生活质量',
    template: '让我们一起探索你的健康状态',
    prompts: ['你理想的健康状态是什么样的？', '你希望如何改善当前的生活方式？']
  },
  {
    id: 'wealth',
    type: '财富',
    icon: Coins,
    title: '经济自由',
    description: '规划财务，实现经济独立',
    template: '让我们一起探索你的财务目标',
    prompts: ['你对经济自由的定义是什么？', '你期望达到什么样的财务状况？']
  },
  {
    id: 'growth',
    type: '成长',
    icon: GraduationCap,
    title: '个人成长',
    description: '持续学习，突破自我边界',
    template: '让我们一起探索你的成长之路',
    prompts: ['你希望在哪些方面实现突破？', '你理想的学习和成长路径是什么？']
  }
] as const;

interface SceneCardProps {
  scene: typeof scenes[number];
  onClick: (scene: Scene) => void;
}

function SceneCard({ scene, onClick }: SceneCardProps) {
  return (
    <div 
      onClick={() => onClick(scene)}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <scene.icon className="w-10 h-10 text-purple-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{scene.title}</h3>
      <p className="text-gray-600">{scene.description}</p>
    </div>
  );
}

interface SceneGridProps {
  onSceneSelect: (scene: Scene) => void;
}

export function SceneGrid({ onSceneSelect }: SceneGridProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scenes.map((scene) => (
          <SceneCard 
            key={scene.id} 
            scene={scene} 
            onClick={onSceneSelect}
          />
        ))}
      </div>
    </section>
  );
}