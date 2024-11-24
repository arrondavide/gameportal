// lib/supabase/hooks.ts
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import type { Game, GameLike } from './types'

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setGames(data || [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()

    // Set up real-time subscription
    const subscription = supabase
      .channel('games')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'games' },
        (payload) => {
          console.log('Change received!', payload)
          fetchGames() // Refresh the games list when changes occur
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const addGame = async (newGame: Omit<Game, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([newGame])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (e) {
      throw e
    }
  }

  return {
    games,
    loading,
    error,
    addGame
  }
}

export function useGameLikes(gameId: string) {
  const [likes, setLikes] = useState<number>(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Get total likes
        const { count } = await supabase
          .from('game_likes')
          .select('*', { count: 'exact' })
          .eq('game_id', gameId)

        setLikes(count || 0)

        // Check if current user liked the game
        const user = supabase.auth.getUser()
        if (user) {
         const { data } = await supabase
           .from('game_likes')
           .select('*')
           .eq('game_id', gameId)
           .eq('user_id', (await user).data.user?.id ?? '')
           .single()

          setIsLiked(!!data)
        }
        
      } catch (e) {
        console.error('Error fetching likes:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()

    // Set up real-time subscription for likes
    const subscription = supabase
      .channel('game_likes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'game_likes', filter: `game_id=eq.${gameId}` },
        (payload) => {
          fetchLikes() // Refresh likes when changes occur
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [gameId])

  const toggleLike = async () => {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('Must be logged in to like games')

      if (isLiked) {
        // Unlike
        await supabase
          .from('game_likes')
          .delete()
          .eq('game_id', gameId)
          .eq('user_id', user.data.user.id)
      } else {
        // Like
        await supabase
          .from('game_likes')
          .insert([{ game_id: gameId, user_id: user.data.user.id }])
      }
    } catch (e) {
      throw e
    }
  }

  return {
    likes,
    isLiked,
    loading,
    toggleLike
  }
}