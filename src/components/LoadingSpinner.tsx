import React from 'react';
import { Brain } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
        <div className="absolute -inset-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">AIが添削中...</p>
      <p className="text-sm text-gray-500 mt-1">少々お待ちください</p>
    </div>
  );
};