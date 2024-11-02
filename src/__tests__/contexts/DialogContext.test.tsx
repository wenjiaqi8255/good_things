// src/__tests__/contexts/DialogContext.test.tsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DialogProvider, useDialog } from '../../contexts/DialogContext';
import { dialogService } from '../../services/api/dialog';
import { DialogStatus, MessageType, SceneType } from '../../types';

// 添加类型扩展
declare global {
  namespace jest {
    interface Matchers<R> {
    }
  }
}

// Mock dialog service
jest.mock('../../services/api/dialog', () => ({
  dialogService: {
    startDialog: jest.fn(),
    sendMessage: jest.fn(),
    endDialog: jest.fn(),
  },
}));

// 测试组件
const TestComponent = () => {
  const { state, startDialog, sendMessage, selectOption, toggleEmotion } = useDialog();
  
  return (
    <div>
      <div data-testid="loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error?.message || 'no error'}</div>
      <div data-testid="messages">
        {state.dialog?.messages.map(m => m.content).join(', ') || 'no messages'}
      </div>
      <button 
        onClick={() => startDialog('user123', SceneType.CAREER)}
        data-testid="start-dialog"
      >
        Start Dialog
      </button>
      <button 
        onClick={() => sendMessage('test message')}
        data-testid="send-message"
      >
        Send Message
      </button>
      <button 
        onClick={() => selectOption({ id: '1', text: 'test option', type: 'test' })}
        data-testid="select-option"
      >
        Select Option
      </button>
      <button 
        onClick={() => toggleEmotion('happy')}
        data-testid="toggle-emotion"
      >
        Toggle Emotion
      </button>
    </div>
  );
};

describe('DialogContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );
  });

  it('initializes with correct default state', () => {
    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
    expect(screen.getByTestId('messages')).toHaveTextContent('no messages');
  });

  it('starts dialog successfully', async () => {
    const mockDialog = {
      id: 'test-dialog',
      userId: 'user123',
      sceneId: SceneType.CAREER,
      messages: [],
      status: DialogStatus.ACTIVE,
      emotions: [],
      startTime: Date.now(),
    };

    (dialogService.startDialog as jest.Mock).mockResolvedValueOnce(mockDialog);

    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );

    fireEvent.click(screen.getByTestId('start-dialog'));

    await waitFor(() => {
      expect(dialogService.startDialog).toHaveBeenCalledWith(
        'user123',
        SceneType.CAREER
      );
    });
  });

  it('sends message successfully', async () => {
    const mockResponse = {
      response: {
        id: 'msg1',
        type: MessageType.SYSTEM,
        content: 'test response',
        timestamp: Date.now(),
      },
      shouldEnd: false,
    };

    (dialogService.sendMessage as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );

    // First start a dialog
    const mockDialog = {
      id: 'test-dialog',
      userId: 'user123',
      sceneId: SceneType.CAREER,
      messages: [],
      status: DialogStatus.ACTIVE,
      emotions: [],
      startTime: Date.now(),
    };

    (dialogService.startDialog as jest.Mock).mockResolvedValueOnce(mockDialog);
    fireEvent.click(screen.getByTestId('start-dialog'));
    await waitFor(() => {
      expect(dialogService.startDialog).toHaveBeenCalled();
    });

    // Then send a message
    fireEvent.click(screen.getByTestId('send-message'));

    await waitFor(() => {
      expect(dialogService.sendMessage).toHaveBeenCalled();
    });
  });

  it('handles errors correctly', async () => {
    const error = new Error('Test error');
    (dialogService.startDialog as jest.Mock).mockRejectedValueOnce(error);

    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    );

    fireEvent.click(screen.getByTestId('start-dialog'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    });
  });

  // Add more tests...
});
