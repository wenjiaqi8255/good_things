// components/LoadingState.tsx
import React from 'react';
import { Loader } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Loader className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );
}