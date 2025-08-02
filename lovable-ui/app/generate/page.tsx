"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Share2, 
  Settings, 
  Maximize2, 
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Code,
  Terminal,
  Eye
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import EnhancedNavbar from "@/components/EnhancedNavbar";
import { formatTime } from "@/lib/utils";

interface Message {
  type: "claude_message" | "tool_use" | "tool_result" | "progress" | "error" | "complete";
  content?: string;
  name?: string;
  input?: any;
  result?: any;
  message?: string;
  previewUrl?: string;
  sandboxId?: string;
}

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prompt = searchParams.get("prompt") || "";
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating && startTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, startTime]);
  
  useEffect(() => {
    if (!prompt) {
      router.push("/");
      return;
    }
    
    // Prevent double execution in StrictMode
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;
    
    setStartTime(Date.now());
    setIsGenerating(true);
    generateWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, router]);
  
  const generateWebsite = async () => {
    try {
      toast.success("Starting generation...");
      const response = await fetch("/api/generate-daytona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate website");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setIsGenerating(false);
              break;
            }

            try {
              const message = JSON.parse(data) as Message;
              
              if (message.type === "error") {
                throw new Error(message.message);
              } else if (message.type === "complete") {
                setPreviewUrl(message.previewUrl || null);
                setIsGenerating(false);
                const duration = Math.floor((Date.now() - startTime) / 1000);
                toast.success(`Generation completed in ${formatTime(duration)}!`);
                
                // Add to history
                if ((window as any).addToGenerationHistory) {
                  (window as any).addToGenerationHistory({
                    prompt,
                    timestamp: Date.now(),
                    duration,
                    previewUrl: message.previewUrl,
                    sandboxId: message.sandboxId,
                    status: 'completed'
                  });
                }
              } else {
                setMessages((prev) => [...prev, message]);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Error generating website:", err);
      setError(err.message || "An error occurred");
      setIsGenerating(false);
      toast.error("Generation failed: " + err.message);
      
      // Add failed generation to history
      if ((window as any).addToGenerationHistory) {
        (window as any).addToGenerationHistory({
          prompt,
          timestamp: Date.now(),
          duration: Math.floor((Date.now() - startTime) / 1000),
          status: 'failed'
        });
      }
    }
  };
  
  const formatToolInput = (input: any) => {
    if (!input) return "";
    
    // Extract key information based on tool type
    if (input.file_path) {
      return `File: ${input.file_path}`;
    } else if (input.command) {
      return `Command: ${input.command}`;
    } else if (input.pattern) {
      return `Pattern: ${input.pattern}`;
    } else if (input.prompt) {
      return `Prompt: ${input.prompt.substring(0, 100)}...`;
    }
    
    // For other cases, show first meaningful field
    const keys = Object.keys(input);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const value = input[firstKey];
      if (typeof value === 'string' && value.length > 100) {
        return `${firstKey}: ${value.substring(0, 100)}...`;
      }
      return `${firstKey}: ${value}`;
    }
    
    return JSON.stringify(input).substring(0, 100) + "...";
  };

  const handleShare = useCallback(() => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      toast.success("Preview URL copied to clipboard!");
    }
  }, [previewUrl]);

  const handleDownload = useCallback(() => {
    toast.info("Download feature coming soon!");
  }, []);

  const handleRefresh = useCallback(() => {
    if (previewUrl) {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.src = iframe.src;
        toast.success("Preview refreshed!");
      }
    }
  }, [previewUrl]);

  return (
    <main className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col overflow-hidden relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' }
        }}
      />
      <EnhancedNavbar />
      {/* Spacer for navbar */}
      <div className="h-16" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Chat */}
        <div className="w-[30%] flex flex-col border-r border-gray-800">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Lovable AI
              </h2>
              {isGenerating && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {formatTime(Math.floor(elapsedTime / 1000))}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm break-words line-clamp-2">{prompt}</p>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2 mt-3">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Generating...</span>
                </div>
              ) : previewUrl ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs">Complete</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs">Failed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                  <span className="text-xs">Ready</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
            {messages.map((message, index) => (
              <div key={index}>
                {message.type === "claude_message" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">L</span>
                      </div>
                      <span className="text-white font-medium">Lovable</span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap break-words">{message.content}</p>
                  </motion.div>
                )}
                
                {message.type === "tool_use" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/30 rounded-lg p-3 border border-gray-700 overflow-hidden"
                  >
                    <div className="flex items-start gap-2 text-sm">
                      <div className="flex items-center gap-1 text-blue-400 flex-shrink-0">
                        {message.name === 'Write' && <Code className="w-3 h-3" />}
                        {message.name === 'Bash' && <Terminal className="w-3 h-3" />}
                        {!['Write', 'Bash'].includes(message.name || '') && <span>🔧</span>}
                        <span className="font-medium">{message.name}</span>
                      </div>
                      <span className="text-gray-500 break-all">{formatToolInput(message.input)}</span>
                    </div>
                  </motion.div>
                )}
                
                {message.type === "progress" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-sm font-mono break-all bg-gray-800/20 rounded p-2"
                  >
                    {message.message}
                  </motion.div>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400 bg-gray-800/30 rounded-lg p-3"
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                <span>Working...</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-4"
              >
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Bottom input area */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/30">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Lovable..."
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-gray-600 transition-colors"
                disabled={isGenerating}
              />
              <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side - Preview */}
        <div className="w-[70%] bg-gray-950 flex flex-col">
          {/* Preview header */}
          {previewUrl && (
            <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Live Preview</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleRefresh}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Preview content */}
          <div className="flex-1 flex items-center justify-center">
          {!previewUrl && isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Creating Your Application</h3>
              <p className="text-gray-400 mb-4">This may take a few minutes...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Elapsed: {formatTime(Math.floor(elapsedTime / 1000))}</span>
              </div>
            </motion.div>
          )}
          
          {previewUrl && (
            <motion.iframe
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={previewUrl}
              className={`w-full h-full border-0 ${isPreviewMaximized ? 'fixed inset-0 z-50' : ''}`}
              title="Website Preview"
            />
          )}
          
          {!previewUrl && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Eye className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Preview Ready</h3>
              <p className="text-gray-400">Your application preview will appear here</p>
            </motion.div>
          )}
          </div>
        </div>
      </div>
    </main>
  );
}