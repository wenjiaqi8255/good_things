import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GuidedDialog } from './GuidedDialog';
import { ImageResult } from './ImageResult';
import { LoadingState } from './LoadingState';
import { SessionHeader } from './SessionHeader';
import type { Dialog, SceneType } from '../../types';
import { DialogStatus } from '../../types';

interface Scene {
  id: string;
  title: string;
  type: SceneType;
  icon: React.ComponentType<{ className?: string }>;
}

interface SceneSessionProps {
  scene: Scene;
  onBack: () => void;
  onComplete: (dialog: Dialog) => void;
}

export function SceneSession({ scene, onBack, onComplete }: SceneSessionProps) {
  const { user } = useAuth();
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentDialog && user) {
      const initialDialog: Dialog = {
        id: `dialog-${Date.now()}`,
        userId: user.id,
        sceneType: scene.type,
        status: DialogStatus.ACTIVE,
        startTime: Date.now()
      };
      setCurrentDialog(initialDialog);
    }
  }, [user, scene.id, currentDialog]);

  const handleDialogComplete = async (dialog: Dialog) => {
    try {
      const completedDialog: Dialog = {
        ...dialog,
        status: DialogStatus.COMPLETED,
        endTime: Date.now()
      };
      
      setCurrentDialog(completedDialog);
      onComplete(completedDialog);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to complete dialog'));
    }
  };

  const generateVisualization = async () => {
    if (!currentDialog) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/dialogs/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dialogId: currentDialog.id,
          messages: currentDialog.summary,
          // emotions: currentDialog.emotions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { imagePrompt, imageUrl } = await response.json();
      const updatedDialog = {
        ...currentDialog,
        imagePrompt,
        imageUrl
      };

      setCurrentDialog(updatedDialog);
      onComplete(updatedDialog);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to generate visualization'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (currentDialog?.imageUrl) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: '我的理想画面 - GoodThings',
            text: currentDialog.imagePrompt || '我在GoodThings上创建的理想画面',
            url: currentDialog.imageUrl
          });
        } else {
          await navigator.clipboard.writeText(currentDialog.imageUrl);
          alert('链接已复制到剪贴板');
        }
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (currentDialog?.imageUrl) {
      try {
        const response = await fetch(currentDialog.imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `goodthings-${currentDialog.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to download image'));
      }
    }
  };

  const handleError = (error: Error) => {
    setError(error);
    console.error('Dialog error:', error);
  };

  const renderContent = () => {
    if (!currentDialog) {
      return null;
    }

    if (currentDialog.status !== DialogStatus.COMPLETED) {
      return (
        <GuidedDialog 
          dialogId={currentDialog.id}
          onComplete={handleDialogComplete}
          onError={handleError}
        />
      );
    }

    if (currentDialog.imageUrl) {
      return (
        <ImageResult
          imageUrl={currentDialog.imageUrl}
          prompt={currentDialog.imagePrompt || ''}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      );
    }

    return (
      <LoadingState 
        isGenerating={isGenerating}
        error={error}
        onRetry={generateVisualization}
        hasImage={!!currentDialog.imageUrl}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionHeader 
        icon={scene.icon}
        title={scene.title}
        onBack={onBack}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}