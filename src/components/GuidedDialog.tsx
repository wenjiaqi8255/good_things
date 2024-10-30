import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import type { Scene } from '../types';

interface Message {
  id: string;
  role: 'system' | 'user';
  content: string;
  timestamp: number;
}

interface GuidedDialogProps {
  scene: Scene;
  onComplete: (answers: string[], emotions: string[]) => void;
}

export function GuidedDialog({ scene, onComplete }: GuidedDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: scene.template,
      timestamp: Date.now()
    }
  ]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emotions, setEmotions] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // 在实际应用中，这里会调用 OpenAI API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentPrompt < scene.prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
        const nextSystemMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: scene.prompts[currentPrompt + 1],
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, nextSystemMessage]);
      } else {
        const answers = messages
          .filter(m => m.role === 'user')
          .map(m => m.content);
        onComplete(answers, emotions);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-6 mb-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="输入你的想法..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">当前的情绪状态</h3>
        <div className="flex flex-wrap gap-2">
          {['期待', '兴奋', '平静', '担忧', '焦虑', '充满希望'].map(emotion => (
            <button
              key={emotion}
              onClick={() => handleEmotionSelect(emotion)}
              className={`px-4 py-2 rounded-full text-sm ${
                emotions.includes(emotion)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}