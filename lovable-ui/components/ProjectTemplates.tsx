"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Code, Zap, ArrowRight, Star } from 'lucide-react';
import { projectTemplates, type ProjectTemplate } from '@/lib/huggingface';
import { cn, getComplexityColor } from '@/lib/utils';

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export default function ProjectTemplates({ onSelectTemplate }: ProjectTemplatesProps) {
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');

  const filteredTemplates = selectedComplexity === 'all' 
    ? projectTemplates 
    : projectTemplates.filter(t => t.complexity === selectedComplexity);

  const complexityColors = {
    beginner: 'text-green-500 bg-green-500/10 border-green-500/20',
    intermediate: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    advanced: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Project Templates</h3>
        <div className="flex gap-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedComplexity(level)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-all",
                selectedComplexity === level
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer group"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {template.name}
              </h4>
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium border",
                complexityColors[template.complexity]
              )}>
                {template.complexity}
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {template.estimatedTime}
              </div>
              <div className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                {template.technologies.length} techs
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
              {template.technologies.length > 3 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  +{template.technologies.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs">Popular</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}