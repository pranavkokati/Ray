"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, HelpCircle, Zap } from "lucide-react";

export default function EnhancedNavbar() {
  const [notifications] = useState(3);

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-md border-b border-gray-800/50">
      {/* Logo & main navigation */}
      <div className="flex items-center gap-10">
        <motion.a
          href="/"
          className="flex items-center gap-2 text-2xl font-semibold text-white hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <span className="inline-block w-6 h-6 rounded-sm bg-gradient-to-br from-orange-400 via-pink-500 to-blue-500" />
            <motion.div
              className="absolute inset-0 rounded-sm bg-gradient-to-br from-orange-400 via-pink-500 to-blue-500 opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          Lovable
          <span className="text-xs bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent font-bold">
            PRO
          </span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <motion.a 
            href="#" 
            className="hover:text-white transition-colors relative"
            whileHover={{ y: -2 }}
          >
            Templates
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.a>
          <motion.a 
            href="#" 
            className="hover:text-white transition-colors"
            whileHover={{ y: -2 }}
          >
            Community
          </motion.a>
          <motion.a 
            href="#" 
            className="hover:text-white transition-colors"
            whileHover={{ y: -2 }}
          >
            Docs
          </motion.a>
          <motion.a 
            href="#" 
            className="hover:text-white transition-colors flex items-center gap-1"
            whileHover={{ y: -2 }}
          >
            <Zap className="w-4 h-4" />
            API
          </motion.a>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 text-sm">
        {/* Notifications */}
        <motion.button
          className="relative p-2 text-gray-300 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {notifications}
            </motion.span>
          )}
        </motion.button>

        {/* Help */}
        <motion.button
          className="p-2 text-gray-300 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-2 text-gray-300 hover:text-white transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* User Profile */}
        <motion.div
          className="flex items-center gap-3 pl-4 border-l border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-right hidden sm:block">
            <div className="text-white font-medium">Developer</div>
            <div className="text-gray-400 text-xs">Pro Plan</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      </div>
    </nav>
  );
}