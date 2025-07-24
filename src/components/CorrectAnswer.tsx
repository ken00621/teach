import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

interface CorrectAnswerProps {
  topic: string;
  answer: string;
}

export const CorrectAnswer: React.FC<CorrectAnswerProps> = ({ topic, answer }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!answer) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">
            正解・模範解答
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200"
        >
          {isVisible ? (
            <>
              <EyeOff className="w-4 h-4" />
              隠す
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              答えを見る
            </>
          )}
        </button>
      </div>

      {isVisible ? (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h4 className="font-medium text-gray-900 mb-2">お題: {topic}</h4>
            <p className="text-gray-700 leading-relaxed">{answer}</p>
          </div>
          <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
            💡 <strong>学習のコツ:</strong> あなたの説明と比較して、どの部分が不足していたか、どの表現がより適切かを確認してみましょう。
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-green-700 mb-2">
            まずは自分で説明してから答えを確認しましょう
          </p>
          <p className="text-sm text-green-600">
            「答えを見る」ボタンをクリックすると模範解答が表示されます
          </p>
        </div>
      )}
    </div>
  );
};