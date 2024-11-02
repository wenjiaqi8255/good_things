import React, { useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Header } from './components/layout/Header';
import { SceneGrid } from './components/features/SceneGrid';
import { GuidedDialog } from './components/features/GuidedDialog';
import { ProcessSteps } from './components/features/ProcessSteps';
import { Footer } from './components/layout/Footer';
import { DialogProvider } from './contexts/DialogContext';
import type { Dialog, SceneType } from './types';
import { DialogStatus } from './types';
import { useDialog } from './contexts/DialogContext';
import { AuthProvider } from './contexts/AuthContext';

interface Scene {
  id: string;
  title: string;
  type: SceneType;
  icon: React.ComponentType<{ className?: string }>;
}

// 主应用内容组件
function AppContent() {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const { state, resetDialog, startDialog } = useDialog();  // 添加 startDialog
  const currentDialog = state.dialog;

  console.log('AppContent rendering');

  // 尝试使用 useDialog 并打印结果
  const dialog = useDialog();
  console.log('Dialog context:', dialog);
  const handleSceneSelect = async (scene: Scene) => {
    setSelectedScene(scene);
    // 使用 context 的方法创建对话
    if (scene) {
      await startDialog('', scene.type); // userId 可以从 Clerk 获取
    }
  };

  const handleDialogComplete = (dialog: Dialog) => {
    // 对话完成的处理已经在 DialogContext 中了
    // 这里只需要处理 UI 相关的逻辑
    setSelectedScene(null);
  };

  const handleReset = () => {
    setSelectedScene(null);
    resetDialog();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-8">
        <SignedIn>
          {!selectedScene ? (
            <SceneGrid onSceneSelect={handleSceneSelect} />
          ) : (
            <GuidedDialog
              dialogId={currentDialog?.id || ''}
              onComplete={handleDialogComplete}
              onError={(error) => console.error(error)}
            />
          )}
        </SignedIn>
        
        <SignedOut>
          <div className="text-center">
            <ProcessSteps />
            <RedirectToSignIn />
          </div>
        </SignedOut>
      </main>

      <Footer />
    </div>
  );
}

export {AppContent}; // 导出 AppContent 组件以便在测试中模拟

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 主应用组件
function App() {
  // 确保从环境变量获取 Clerk publishable key
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <AuthProvider>
          <DialogProvider>
            <AppContent />
          </DialogProvider>
          </AuthProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;