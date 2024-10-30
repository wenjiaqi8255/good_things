import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { GuidedDialog } from './GuidedDialog';
import { ImageResult } from './ImageResult';
import { OpenAIService } from '../services/openai';
import { ImageGenerationService } from '../services/imageGeneration';
import type { Scene, Session } from '../types';

interface SceneSessionProps {
  scene: Scene;
  onBack: () => void;
  onComplete: (session: Session) => void;
}

export function SceneSession({ scene, onBack, onComplete }: SceneSessionProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (session && !session.imageUrl) {
      generateImage();
    }
  }, [session]);

  const handleDialogComplete = async (answers: string[], emotions: string[]) => {
    const newSession: Session = {
      id: Date.now().toString(),
      userId: 'temp-user-id',
      sceneId: scene.id,
      choices: answers.map((answer, index) => ({
        promptId: index.toString(),
        answer,
        timestamp: Date.now() + index
      })),
      emotions,
      createdAt: Date.now()
    };

    setSession(newSession);
    setIsCompleted(true);
    onComplete(newSession);
  };

  const generateImage = async () => {
    if (!session) return;

    setIsGenerating(true);
    try {
      const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || '');
      const imageService = new ImageGenerationService(process.env.STABILITY_API_KEY || '');

      const imagePrompt = await openAIService.generateImagePrompt(session);
      const imageUrl = await imageService.generateImage(imagePrompt);

      const updatedSession = {
        ...session,
        imagePrompt,
        imageUrl,
        completedAt: Date.now()
      };

      setSession(updatedSession);
      onComplete(updatedSession);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (session?.imageUrl) {
      try {
        await navigator.share({
          title: '我的理想画面 - GoodThings',
          text: session.imagePrompt,
          url: session.imageUrl
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (session?.imageUrl) {
      const link = document.createElement('a');
      link.href = session.imageUrl;
      link.download = `goodthings-${session.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回
            </button>
            <h1 className="text-xl font-semibold flex items-center">
              <scene.icon className="w-6 h-6 text-purple-600 mr-2" />
              {scene.title}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isCompleted ? (
          <GuidedDialog scene={scene} onComplete={handleDialogComplete} />
        ) : session?.imageUrl ? (
          <ImageResult
            imageUrl={session.imageUrl}
            prompt={session.imagePrompt || ''}
            onShare={handleShare}
            onDownload={handleDownload}
          />
        ) : (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">显化过程已完成</h2>
              <p className="text-gray-600 mb-8">
                {isGenerating ? '正在为你生成专属的理想画面，请稍候...' : '图片生成失败，请重试'}
              </p>
              {!isGenerating && (
                <button
                  onClick={generateImage}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  重新生成
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}