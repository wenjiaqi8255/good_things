import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="container mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold">GoodThings</span>
        </div>
        
        {!isLoading && (
          user ? (
            <UserMenu />
          ) : (
            <button
              onClick={onLoginClick}
              className="text-purple-600 hover:text-purple-700"
            >
              登录
            </button>
          )
        )}
      </div>

      <div className="pt-20 pb-32 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          具象化你的理想生活
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          GoodThings 是你的个人显化助手，通过沉浸式引导，帮助你清晰描绘并实现理想的生活状态
        </p>
        <button 
          onClick={() => window.location.href = '/scenes'}
          className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
        >
          开始体验 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}