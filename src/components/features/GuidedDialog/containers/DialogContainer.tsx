import React from 'react';
import { useDialog } from '../../../../contexts/DialogContext';
import { MessageList } from '../components/MessageList';
import { InputArea } from '../components/InputArea';
import { EmotionPanel } from '../components/EmotionPanel';
import { LoadingState } from '../components/LoadingState';
import type { Dialog, Option } from '../../../../types';

interface DialogContainerProps {
  dialogId: string;
  onComplete: (dialog: Dialog) => void;
  onError: (error: Error) => void;
}

export function DialogContainer({ onComplete, onError }: DialogContainerProps) {
  const {
    state: { dialog, isLoading, error, selectedOption },
    sendMessage,
    selectOption,
    toggleEmotion
  } = useDialog();

  // Handle errors
  React.useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  // Handle completion
  React.useEffect(() => {
    if (dialog?.endTime && dialog?.summary) {
      onComplete(dialog);
    }
  }, [dialog, onComplete]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!dialog) return <InitializingState />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <MessageList 
        messages={dialog.messages}
        selectedOption={selectedOption}
        onOptionSelect={selectOption}
      />
      <InputArea
        isLoading={isLoading}
        onSubmit={sendMessage}
      />
      <EmotionPanel
        selectedEmotions={dialog.emotions}
        onToggle={toggleEmotion}
      />
    </div>
  );
}
