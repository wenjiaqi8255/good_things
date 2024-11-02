// components/MessageList.tsx
import React from 'react';
import { MessageItem } from './MessageItem';
import type { Message, Option } from '../../../../types';

interface MessageListProps {
  messages: Message[];
  selectedOption: Option | null;
  onOptionSelect: (option: Option) => void;
}

export function MessageList({ messages, selectedOption, onOptionSelect }: MessageListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-6 mb-6">
        {messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            selectedOption={selectedOption}
            onOptionSelect={onOptionSelect}
          />
        ))}
      </div>
    </div>
  );
}
