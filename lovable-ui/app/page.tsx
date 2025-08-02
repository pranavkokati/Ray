"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Code2, Rocket, ArrowRight } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import EnhancedNavbar from "@/components/EnhancedNavbar";
import ProjectTemplates from "@/components/ProjectTemplates";
import PromptAnalyzer from "@/components/PromptAnalyzer";
import GenerationHistory from "@/components/GenerationHistory";
import { type ProjectTemplate } from "@/lib/huggingface";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate your project");
      return;
    }

    if (prompt.length < 10) {
      toast.error("Please provide a more detailed description");
      return;
    }

    setIsGenerating(true);
    toast.success("Starting generation...");

    // Add to history
    if ((window as any).addToGenerationHistory) {
      (window as any).addToGenerationHistory({
        prompt,
        timestamp: Date.now(),
        duration: 0,
        status: 'in-progress'
      });
    }

    // Navigate to generate page with prompt
    router.push(`/generate?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    setPrompt(template.prompt);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" loaded!`);
    textareaRef.current?.focus();
  };

  const handleSelectFromHistory = (historicalPrompt: string) => {
    setPrompt(historicalPrompt);
    toast.success("Prompt loaded from history");
    textareaRef.current?.focus();
  };

  const examplePrompts = [
    {
      title: "E-commerce Store",
      description: "Full-featured online store with cart and payments",
      prompt: "Create a modern e-commerce store with product catalog, shopping cart, user authentication, payment processing with Stripe, order management, and admin dashboard"
    },
    {
      title: "Social Platform",
      description: "Twitter-like social media with real-time features",
      prompt: "Build a social media platform with user profiles, posts, likes, comments, following system, real-time messaging, and notifications"
    },
    {
      title: "Analytics Dashboard",
      description: "Data visualization with interactive charts",
      prompt: "Create a comprehensive analytics dashboard with interactive charts, real-time data updates, customizable widgets, and data filtering"
    },
    {
      title: "Learning Platform",
      description: "Online courses with video lessons and tracking",
      prompt: "Build an online learning platform with course creation, video lessons, quizzes, progress tracking, and certificates"
    }
  ];
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151'
          }
        }}
      />

      {/* Navbar */}
      <EnhancedNavbar />

      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Build Anything
              </h1>
              <Wand2 className="w-8 h-8 text-purple-400" />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-xl sm:text-2xl text-gray-300 mb-4">
                AI-Powered Development Platform
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Code2 className="w-4 h-4" />
                  <span>HuggingFace AI</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="flex items-center gap-1">
                  <Rocket className="w-4 h-4" />
                  <span>Instant Deploy</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>Production Ready</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative max-w-3xl mx-auto mb-8"
          >
            <div className="relative flex items-center bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl px-2 hover:border-gray-600 transition-all">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder="Describe your dream application... (e.g., 'Create a task management app with real-time collaboration')"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setShowAnalyzer(e.target.value.length > 20);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                className="flex-1 px-6 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg resize-none min-h-[140px] max-h-[300px] leading-relaxed"
                rows={4}
              />

              {/* Send button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex-shrink-0 mr-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg border border-gray-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code2 className="w-4 h-4" />
                Templates
              </motion.button>
              
              <motion.button
                onClick={() => {
                  const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
                  setPrompt(randomPrompt.prompt);
                  toast.success(`Random idea: ${randomPrompt.title}`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg border border-gray-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                Surprise Me
              </motion.button>
            </div>
          </motion.div>

          {/* AI Analysis */}
          <AnimatePresence>
            {showAnalyzer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-3xl mx-auto mb-8"
              >
                <PromptAnalyzer prompt={prompt} isVisible={showAnalyzer} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Example prompts grid */}
          {!showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
            >
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={example.title}
                  onClick={() => {
                    setPrompt(example.prompt);
                    toast.success(`Template loaded: ${example.title}`);
                  }}
                  className="p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-gray-600 transition-all text-left group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {example.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {example.description}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Project Templates */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto"
              >
                <ProjectTemplates onSelectTemplate={handleSelectTemplate} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Generation History */}
      <GenerationHistory onSelectPrompt={handleSelectFromHistory} />

      {/* Floating stats */}
      <motion.div
        className="fixed bottom-6 left-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-sm text-gray-300"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>AI Ready</span>
          </div>
          <div className="text-gray-500">•</div>
          <span>HuggingFace Powered</span>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}