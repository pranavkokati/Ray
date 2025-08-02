"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Clock, ExternalLink, Trash2, Star } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface GenerationRecord {
  id: string;
  prompt: string;
  timestamp: number;
  duration: number;
  previewUrl?: string;
  sandboxId?: string;
  status: 'completed' | 'failed' | 'in-progress';
  starred?: boolean;
}

interface GenerationHistoryProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function GenerationHistory({ onSelectPrompt }: GenerationHistoryProps) {
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('generation-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const saveHistory = (newHistory: GenerationRecord[]) => {
    setHistory(newHistory);
    localStorage.setItem('generation-history', JSON.stringify(newHistory));
  };

  const addToHistory = (record: Omit<GenerationRecord, 'id'>) => {
    const newRecord: GenerationRecord = {
      ...record,
      id: Date.now().toString(),
    };
    const newHistory = [newRecord, ...history].slice(0, 50); // Keep last 50
    saveHistory(newHistory);
  };

  const toggleStar = (id: string) => {
    const newHistory = history.map(record =>
      record.id === id ? { ...record, starred: !record.starred } : record
    );
    saveHistory(newHistory);
  };

  const deleteRecord = (id: string) => {
    const newHistory = history.filter(record => record.id !== id);
    saveHistory(newHistory);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  // Expose addToHistory function globally for other components to use
  useEffect(() => {
    (window as any).addToGenerationHistory = addToHistory;
  }, [history]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-all z-50"
      >
        <History className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-0 right-0 h-full w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 z-50 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-white">Generation History</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No generation history yet</p>
            <p className="text-sm">Your projects will appear here</p>
          </div>
        ) : (
          history.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 line-clamp-2 mb-1">
                    {record.prompt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(record.timestamp)}</span>
                    {record.duration > 0 && (
                      <span>• {formatTime(record.duration)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => toggleStar(record.id)}
                    className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                      record.starred ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${record.starred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  record.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400'
                    : record.status === 'failed'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {record.status}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPrompt(record.prompt)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
                  >
                    Reuse
                  </button>
                  {record.previewUrl && (
                    <a
                      href={record.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}