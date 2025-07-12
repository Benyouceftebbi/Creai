import type { Settings, ReelSettings } from "@/app/page" // Import these types

export type CreativeMode = "image" | "reel" | "history"

export interface HistoryItem {
  id: string
  productUrl?: string
  type: "image" | "reel"
  prompt: string
  results: string[]
  results2?: string[] // Add support for high-quality images
  settings: Settings | ReelSettings // Use specific types
  createdAt: Date // Use createdAt consistently
  status: "completed" | "failed"
  imageType?: "added" | "modified" // Add image type field
}

export interface ChatMessage {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  suggestions?: string[]
  images?: string[]
  metadata?: any
}

export interface CreationDetail {
  id: string
  image: string
  beforeImage?: string // Changed back to string
  user: string
  avatar?: string
  prompt: string
  likes: number
  type: "image" | "reel"
  duration?: string
  settings?: {
    model?: string
    reelModel?: "normal" | "expert"
    aspectRatio?: string
    creativity?: number | number[]
    quality?: string
    language?: string
    outputs?: number
  }
  createdAt?: Date // Added for displaying creation time
}
