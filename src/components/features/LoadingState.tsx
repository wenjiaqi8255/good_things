import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  isGenerating: boolean;
  error: Error | null;
  onRetry: () => void;
  hasImage: boolean;
}

export function LoadingState({ isGenerating, error, onRetry, hasImage }: LoadingStateProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">显化过程已完成</h2>
        <p className="text-gray-600 mb-8">
          {isGenerating 
            ? '正在为你生成专属的理想画面，请稍候...' 
            : error 
              ? '图片生成失败，请重试' 
              : '准备生成你的理想画面'
          }
        </p>
        {error && (
          <p className="text-red-600 mb-4">{error.message}</p>
        )}
        {!isGenerating && (
          <button
            onClick={onRetry}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={isGenerating}
          >
            {hasImage ? '重新生成' : '生成画面'}
          </button>
        )}
      </div>
    </div>
  );
}
