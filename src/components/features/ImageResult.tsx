import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface ImageResultProps {
  imageUrl: string;
  prompt: string;
  onShare: () => void;
  onDownload: () => void;
}

export function ImageResult({ imageUrl, prompt, onShare, onDownload }: ImageResultProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={imageUrl}
            alt="Generated visualization"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">你的理想画面</h3>
          <p className="text-gray-600 mb-6">{prompt}</p>
          
          <div className="flex gap-4">
            <button
              onClick={onShare}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              分享画面
            </button>
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              下载图片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}