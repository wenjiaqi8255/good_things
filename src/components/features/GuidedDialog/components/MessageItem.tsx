
// components/MessageItem.tsx
import React from 'react';
import type { Message, Option } from '../../../../types/index';
import { MessageType } from '../../../../types/index';

interface MessageItemProps {
  message: Message;
  selectedOption: Option | null;
  onOptionSelect: (option: Option) => void;
}

export function MessageItem({ message, selectedOption, onOptionSelect }: MessageItemProps) {
  const renderSensoryDetails = () => {
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
  };

  return (
    <div
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
        {renderSensoryDetails()}
        {message.options && (
          <div className="mt-3 space-y-2">
            {message.options.map(option => (
              <button
                key={option.id}
                onClick={() => onOptionSelect(option)}
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
  );
}
