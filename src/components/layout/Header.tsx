import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

interface HeaderProps {
  onReset?: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="container mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        {/* Logo 和标题，点击可以返回首页 */}
        <button 
          onClick={onReset}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Heart className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold">GoodThings</span>
        </button>
        
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-purple-600 hover:text-purple-700 transition-colors">
                登录
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "right-0",
                  userButtonPopoverFooter: "hidden"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* 只在首页显示的欢迎区域 */}
      <SignedOut>
        <div className="pt-20 pb-32 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            具象化你的理想生活
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            GoodThings 是你的个人显化助手，通过沉浸式引导，帮助你清晰描绘并实现理想的生活状态
          </p>
          
          <SignInButton mode="modal">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto">
              开始体验 <ArrowRight className="w-5 h-5" />
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* 登录用户看到的简洁标头 */}
      <SignedIn>
        <div className="py-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            选择一个想要体验的场景
          </h2>
          <p className="text-gray-600">
            通过沉浸式对话，帮助你更清晰地描绘理想状态
          </p>
        </div>
      </SignedIn>
    </header>
  );
}