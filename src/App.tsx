import React, { useState } from 'react';
import { Header } from './components/Header';
import { SceneGrid } from './components/SceneGrid';
import { ProcessSteps } from './components/ProcessSteps';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { SceneSession } from './components/SceneSession';
import { LoginModal } from './components/LoginModal';
import { AuthProvider } from './contexts/AuthContext';
import type { Scene, Session } from './types';

function App() {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [completedSession, setCompletedSession] = useState<Session | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSceneSelect = (scene: Scene) => {
    setSelectedScene(scene);
  };

  const handleSessionComplete = (session: Session) => {
    setCompletedSession(session);
  };

  if (selectedScene) {
    return (
      <SceneSession
        scene={selectedScene}
        onBack={() => setSelectedScene(null)}
        onComplete={handleSessionComplete}
      />
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Header onLoginClick={() => setIsLoginModalOpen(true)} />
        <SceneGrid onSceneSelect={handleSceneSelect} />
        <ProcessSteps />
        <CallToAction onStart={() => setIsLoginModalOpen(true)} />
        <Footer />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;