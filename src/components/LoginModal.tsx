import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 在实际应用中，这里会调用微信登录
      const code = 'mock_wx_code';
      await login(code);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">登录 GoodThings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          登录后即可保存你的显化记录，开启专属的理想生活之旅
        </p>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <img
            src="/wechat-icon.svg"
            alt="WeChat"
            className="w-6 h-6"
          />
          {isLoading ? '登录中...' : '微信一键登录'}
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
          登录即表示同意 GoodThings 的
          <a href="/terms" className="text-purple-600 hover:underline">服务条款</a>
          和
          <a href="/privacy" className="text-purple-600 hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
}