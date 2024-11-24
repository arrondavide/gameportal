// types.ts (in the same directory as supabaseClient.ts)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          title: string
          description: string
          game_url: string
          youtube_url: string | null
          thumbnail_url: string | null
          author_id: string
          author_username: string
          created_at: string
          updated_at: string
          likes_count: number
          views_count: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          game_url: string
          youtube_url?: string | null
          thumbnail_url?: string | null
          author_id: string
          author_username: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          views_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          game_url?: string
          youtube_url?: string | null
          thumbnail_url?: string | null
          author_id?: string
          author_username?: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          views_count?: number
        }
      }
      game_likes: {
        Row: {
          id: string
          game_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

// Also export the Game type for easier use throughout the application
export interface Game {
  id: string
  title: string
  description: string
  game_url: string
  youtube_url?: string | null
  thumbnail_url?: string | null
  author_id: string
  author_username: string
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
}

export interface GameLike {
  id: string
  game_id: string
  user_id: string
  created_at: string
}