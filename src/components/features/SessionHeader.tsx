import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SessionHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onBack: () => void;
}

export function SessionHeader({ icon: Icon, title, onBack }: SessionHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <h1 className="text-xl font-semibold flex items-center">
            <Icon className="w-6 h-6 text-purple-600 mr-2" />
            {title}
          </h1>
          <div className="w-20" />
        </div>
      </div>
    </header>
  );
}