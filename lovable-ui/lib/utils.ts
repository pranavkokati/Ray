import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function getComplexityColor(complexity: number): string {
  if (complexity <= 3) return 'text-green-500';
  if (complexity <= 6) return 'text-yellow-500';
  return 'text-red-500';
}

export function getComplexityBg(complexity: number): string {
  if (complexity <= 3) return 'bg-green-500/10 border-green-500/20';
  if (complexity <= 6) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-red-500/10 border-red-500/20';
}