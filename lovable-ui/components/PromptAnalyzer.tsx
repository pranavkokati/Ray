"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Wrench, Lightbulb, TrendingUp } from 'lucide-react';
import { analyzePrompt, generateCodeSuggestions, type CodeAnalysis } from '@/lib/huggingface';
import { cn, getComplexityColor, getComplexityBg } from '@/lib/utils';

interface PromptAnalyzerProps {
  prompt: string;
  isVisible: boolean;
}

export default function PromptAnalyzer({ prompt, isVisible }: PromptAnalyzerProps) {
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (prompt.length > 20 && isVisible) {
      analyzePromptDebounced();
    }
  }, [prompt, isVisible]);

  const analyzePromptDebounced = async () => {
    setIsAnalyzing(true);
    try {
      const [analysisResult, suggestionsResult] = await Promise.all([
        analyzePrompt(prompt),
        generateCodeSuggestions(prompt)
      ]);
      setAnalysis(analysisResult);
      setSuggestions(suggestionsResult);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isVisible || !prompt || prompt.length < 20) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
        {isAnalyzing && (
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Complexity */}
          <div className={cn(
            "p-4 rounded-lg border",
            getComplexityBg(analysis.complexity)
          )}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={cn("w-4 h-4", getComplexityColor(analysis.complexity))} />
              <span className="text-sm font-medium text-gray-300">Complexity</span>
            </div>
            <div className={cn("text-2xl font-bold", getComplexityColor(analysis.complexity))}>
              {analysis.complexity}/10
            </div>
          </div>

          {/* Maintainability */}
          <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Maintainability</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {analysis.maintainability}/10
            </div>
          </div>

          {/* Estimated Time */}
          <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Est. Time</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {analysis.estimatedTime}
            </div>
          </div>
        </div>
      )}

      {/* Technologies */}
      {analysis?.technologies && analysis.technologies.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recommended Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-medium text-gray-300">AI Suggestions</h4>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-300">{suggestion}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}