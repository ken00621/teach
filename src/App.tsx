import React, { useState } from 'react';
import { BookOpen, Send, RotateCcw, GraduationCap, Shuffle, Target, Edit3, Dice6, History } from 'lucide-react';
import { FeedbackSection } from './components/FeedbackSection';
import { ScoreDisplay } from './components/ScoreDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HistoryPanel } from './components/HistoryPanel';
import { CorrectAnswer } from './components/CorrectAnswer';
import { useFeedback } from './hooks/useFeedback';
import { useHistory } from './hooks/useHistory';

type AppMode = 'random' | 'custom';
type ViewMode = 'practice' | 'history';

function App() {
  const [explanation, setExplanation] = useState('');
  const [mode, setMode] = useState<AppMode>('random');
  const [customTopic, setCustomTopic] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
  const { 
    loading, 
    feedback, 
    error, 
    currentTopic, 
    selectedSubject,
    setSelectedSubject,
    availableSubjects,
    generateRandomTopic, 
    getCorrectAnswer, 
    submitExplanation, 
    clearFeedback 
  } = useFeedback();
  const { history, deleteHistoryEntry, clearHistory, getTodayHistory } = useHistory();

  React.useEffect(() => {
    // Generate initial topic on app load only for random mode
    if (mode === 'random') {
      generateRandomTopic();
    }
  }, []);

  React.useEffect(() => {
    // Generate topic when switching to random mode
    if (mode === 'random' && !currentTopic) {
      generateRandomTopic();
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = mode === 'random' ? currentTopic : customTopic;
    submitExplanation(explanation, topic, mode);
  };

  const handleReset = () => {
    setExplanation('');
    if (mode === 'custom') {
      setCustomTopic('');
    }
    clearFeedback();
  };

  const handleNewTopic = () => {
    generateRandomTopic(selectedSubject);
    setExplanation('');
    clearFeedback();
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setExplanation('');
    setCustomTopic('');
    clearFeedback();
    if (newMode === 'random') {
      generateRandomTopic(selectedSubject);
    }
  };

  const getCurrentTopic = () => {
    return mode === 'random' ? currentTopic : customTopic;
  };

  const todayCount = getTodayHistory().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              TeachAI - ランダムお題添削アプリ
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ランダム出題または自分で設定したテーマに対して説明し、AIが添削・フィードバックを返してくれるアプリです。
          </p>
        </div>

        {/* View Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
            {todayCount > 0 && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                今日 {todayCount}回 練習済み
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setViewMode('practice')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                viewMode === 'practice'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6" />
                <span className="font-semibold">練習する</span>
              </div>
              <p className="text-sm text-left">
                ランダム出題または自由テーマで説明練習
              </p>
            </button>
            
            <button
              onClick={() => setViewMode('history')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                viewMode === 'history'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <History className="w-6 h-6" />
                <span className="font-semibold">学習履歴</span>
              </div>
              <p className="text-sm text-left">
                過去の練習記録と成績を確認
              </p>
            </button>
          </div>
        </div>

        {viewMode === 'history' ? (
          <HistoryPanel
            history={history}
            onDeleteEntry={deleteHistoryEntry}
            onClearHistory={clearHistory}
          />
        ) : (
          <>
            {/* Practice Mode Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">学習モードを選択</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleModeChange('random')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mode === 'random'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Dice6 className="w-6 h-6" />
                    <span className="font-semibold">ランダム出題モード</span>
                  </div>
                  <p className="text-sm text-left">
                    様々な分野からランダムに出題されるお題に挑戦します
                  </p>
                </button>
                
                <button
                  onClick={() => handleModeChange('custom')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    mode === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Edit3 className="w-6 h-6" />
                    <span className="font-semibold">自由テーマモード</span>
                  </div>
                  <p className="text-sm text-left">
                    自分で設定したテーマについて説明を練習します
                  </p>
                </button>
              </div>
            </div>

            {/* Random Topic Display */}
            {mode === 'random' && currentTopic && (
              <>
                {/* Subject Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">教科を選択</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {availableSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject);
                          generateRandomTopic(subject);
                          setExplanation('');
                          clearFeedback();
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                          selectedSubject === subject
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Display */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-semibold">今回のお題</h2>
                          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                            {selectedSubject}
                          </span>
                        </div>
                        <p className="text-xl font-bold">{currentTopic}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleNewTopic}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                      disabled={loading}
                    >
                      <Shuffle className="w-4 h-4" />
                      新しいお題
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Custom Topic Input */}
            {mode === 'custom' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <label htmlFor="customTopic" className="block text-lg font-semibold text-gray-900 mb-3">
                  説明したいテーマを入力してください
                </label>
                <input
                  id="customTopic"
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="例：光合成について、江戸時代の文化、二次方程式の解き方..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={loading}
                />
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">使い方</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {mode === 'random' ? '上記のお題' : '設定したテーマ'}に対して、あなたの言葉で説明してみてください。
                    その説明にAIが添削とアドバイスを返してくれます。
                  </p>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <label htmlFor="explanation" className="block text-lg font-semibold text-gray-900 mb-3">
                    あなたの説明文
                  </label>
                  <textarea
                    id="explanation"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder={`${getCurrentTopic() ? `「${getCurrentTopic()}」について、` : ''}あなたの言葉で説明してください...

例：基本的な概念から始めて、具体例を交えながら説明してみましょう。`}
                    className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">
                      {explanation.length} 文字
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        disabled={loading}
                      >
                        <RotateCcw className="w-4 h-4" />
                        リセット
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !explanation.trim() || (mode === 'custom' && !customTopic.trim())}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        添削してもらう
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <LoadingSpinner />
              </div>
            )}

            {/* Feedback Display */}
            {feedback && !loading && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    AIからのフィードバック
                  </h2>
                  
                  <div className="space-y-6">
                    <FeedbackSection
                      title="正しい点"
                      content={feedback.correct}
                      type="correct"
                    />
                    
                    <FeedbackSection
                      title="間違いや不明瞭な点"
                      content={feedback.mistakes}
                      type="mistake"
                    />
                    
                    <FeedbackSection
                      title="改善アドバイス"
                      content={feedback.advice}
                      type="advice"
                    />
                  </div>
                </div>

                <ScoreDisplay 
                  accuracy={feedback.accuracy} 
                  clarity={feedback.clarity} 
                />

                {/* Correct Answer for Random Topics */}
                {mode === 'random' && currentTopic && (
                  <CorrectAnswer 
                    topic={currentTopic}
                    answer={getCorrectAnswer(currentTopic)}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            {viewMode === 'history' 
              ? '継続的な学習で説明力を向上させましょう！' 
              : mode === 'random' 
                ? '様々なお題に挑戦して' 
                : '自分の興味のあるテーマで'
            }説明力を向上させましょう！
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;