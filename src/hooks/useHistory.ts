import { useState, useEffect } from 'react';

export interface HistoryEntry {
  id: string;
  date: string;
  topic: string;
  explanation: string;
  feedback: {
    correct: string;
    mistakes: string;
    advice: string;
    accuracy: number;
    clarity: number;
  };
  mode: 'random' | 'custom';
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('teachai-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teachai-history', JSON.stringify(history));
  }, [history]);

  const addHistoryEntry = (
    topic: string,
    explanation: string,
    feedback: HistoryEntry['feedback'],
    mode: 'random' | 'custom'
  ) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      topic,
      explanation,
      feedback,
      mode
    };

    setHistory(prev => [newEntry, ...prev]);
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('teachai-history');
  };

  const getHistoryByDate = (date: string) => {
    return history.filter(entry => 
      new Date(entry.date).toDateString() === new Date(date).toDateString()
    );
  };

  const getCustomTopicHistory = () => {
    return history.filter(entry => entry.mode === 'custom');
  };

  const getRandomTopicHistory = () => {
    return history.filter(entry => entry.mode === 'random');
  };

  const getTodayHistory = () => {
    const today = new Date().toDateString();
    return history.filter(entry => 
      new Date(entry.date).toDateString() === today
    );
  };

  return {
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    getHistoryByDate,
    getCustomTopicHistory,
    getRandomTopicHistory,
    getTodayHistory
  };
};