// decrapite this file //

import React, { useCallback, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import type { Dialog, Message, Option } from '../../types';
import { MessageType } from '../../types';
import { useDialog } from '../../contexts/DialogContext';

interface GuidedDialogProps {
  dialogId: string;
  onComplete: (dialog: Dialog) => void;
  onError: (error: Error) => void;
}

export function GuidedDialog({ onComplete, onError }: GuidedDialogProps) {
  const {
    state: { dialog, isLoading, error, selectedOption },
    sendMessage,
    selectOption,
    toggleEmotion
  } = useDialog();

  const [userInput, setUserInput] = React.useState('');

  // 1. 添加加载状态显示
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // 2. 添加错误状态显示
  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          重试
        </button>
      </div>
    );
  }

  // 3. 添加初始化状态显示
  if (!dialog) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">正在初始化对话...</p>
      </div>
    );
  }
  
  // Handle errors from context
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  // Handle dialog completion
  useEffect(() => {
    if (dialog?.endTime && dialog?.summary) {
      onComplete(dialog);
    }
  }, [dialog, onComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    await sendMessage(userInput);
    setUserInput('');
  };

  const handleOptionSelect = useCallback((option: Option) => {
    selectOption(option);
    setUserInput(option.text);
  }, [selectOption]);

  const renderSensoryDetails = useCallback((message: Message) => {
    if (!message.sensoryDetails) return null;

    return (
      <div className="mt-2 text-sm">
        {message.sensoryDetails.visual && (
          <div className="mb-1">👁️ {message.sensoryDetails.visual.join(', ')}</div>
        )}
        {message.sensoryDetails.auditory && (
          <div className="mb-1">👂 {message.sensoryDetails.auditory.join(', ')}</div>
        )}
        {message.sensoryDetails.tactile && (
          <div className="mb-1">✋ {message.sensoryDetails.tactile.join(', ')}</div>
        )}
      </div>
    );
  }, []);

  if (!dialog) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-6 mb-6">
          {dialog.messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.type === MessageType.USER ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === MessageType.USER
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div>{message.content}</div>
                {renderSensoryDetails(message)}
                {message.options && (
                  <div className="mt-3 space-y-2">
                    {message.options.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        className={`block w-full text-left px-3 py-2 rounded 
                          ${selectedOption?.id === option.id 
                            ? 'bg-white/30' 
                            : 'bg-white/10 hover:bg-white/20'
                          } transition-colors`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
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
              onClick={() => toggleEmotion(emotion)}
              className={`px-4 py-2 rounded-full text-sm ${
                dialog.emotions?.includes(emotion)
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