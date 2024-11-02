// components/EmotionPanel.tsx
import React from 'react';

interface EmotionPanelProps {
  selectedEmotions: string[];
  onToggle: (emotion: string) => void;
}

export function EmotionPanel({ selectedEmotions, onToggle }: EmotionPanelProps) {
  const emotions = ['期待', '兴奋', '平静', '担忧', '焦虑', '充满希望'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">当前的情绪状态</h3>
      <div className="flex flex-wrap gap-2">
        {emotions.map(emotion => (
          <button
            key={emotion}
            onClick={() => onToggle(emotion)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedEmotions?.includes(emotion)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            {emotion}
          </button>
        ))}
      </div>
    </div>
  );
}