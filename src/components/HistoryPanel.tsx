import React, { useState } from 'react';
import { History, Calendar, BookOpen, Trash2, ChevronDown, ChevronUp, Star, Target, Edit3 } from 'lucide-react';
import { HistoryEntry } from '../hooks/useHistory';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onDeleteEntry,
  onClearHistory
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'custom' | 'random'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `今日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `昨日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getFilteredHistory = () => {
    const today = new Date().toDateString();
    
    switch (filter) {
      case 'today':
        return history.filter(entry => 
          new Date(entry.date).toDateString() === today
        );
      case 'custom':
        return history.filter(entry => entry.mode === 'custom');
      case 'random':
        return history.filter(entry => entry.mode === 'random');
      default:
        return history;
    }
  };

  const filteredHistory = getFilteredHistory();

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < score
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">学習履歴はまだありません</h3>
          <p className="text-gray-600">
            説明を投稿すると、ここに履歴が表示されます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">学習履歴</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {history.length}件
            </span>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              全削除
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'すべて', icon: BookOpen },
            { key: 'today', label: '今日', icon: Calendar },
            { key: 'random', label: 'ランダム', icon: Target },
            { key: 'custom', label: '自由テーマ', icon: Edit3 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            このフィルターに該当する履歴がありません
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredHistory.map((entry) => (
              <div key={entry.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {entry.mode === 'random' ? (
                        <Target className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Edit3 className="w-4 h-4 text-green-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">{entry.topic}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">正確さ:</span>
                        <div className="flex">{renderStars(entry.feedback.accuracy)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">わかりやすさ:</span>
                        <div className="flex">{renderStars(entry.feedback.clarity)}</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {entry.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setExpandedEntry(
                        expandedEntry === entry.id ? null : entry.id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {expandedEntry === entry.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedEntry === entry.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">あなたの説明</h5>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {entry.explanation}
                      </p>
                    </div>
                    
                    {entry.feedback.correct && (
                      <div>
                        <h5 className="font-medium text-green-800 mb-1">✅ 正しい点</h5>
                        <p className="text-sm text-gray-700">{entry.feedback.correct}</p>
                      </div>
                    )}
                    
                    {entry.feedback.mistakes && (
                      <div>
                        <h5 className="font-medium text-orange-800 mb-1">❌ 不明瞭な点</h5>
                        <p className="text-sm text-gray-700">{entry.feedback.mistakes}</p>
                      </div>
                    )}
                    
                    {entry.feedback.advice && (
                      <div>
                        <h5 className="font-medium text-blue-800 mb-1">💡 改善アドバイス</h5>
                        <p className="text-sm text-gray-700">{entry.feedback.advice}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};