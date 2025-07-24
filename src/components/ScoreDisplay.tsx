import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

interface ScoreDisplayProps {
  accuracy: number;
  clarity: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ accuracy, clarity }) => {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < score
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">評価スコア</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">正確さ</span>
            <span className="text-sm text-gray-600">{accuracy}/5</span>
          </div>
          <div className="flex gap-1">{renderStars(accuracy)}</div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">わかりやすさ</span>
            <span className="text-sm text-gray-600">{clarity}/5</span>
          </div>
          <div className="flex gap-1">{renderStars(clarity)}</div>
        </div>
      </div>
    </div>
  );
};