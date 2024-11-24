// lib/supabase/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = 'https://ywddxnqdinhdvxkrkzxk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZGR4bnFkaW5oZHZ4a3JrenhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODE0OTQsImV4cCI6MjA0Nzk1NzQ5NH0.VJe0og41mHph5vqjihNMWPtHi4kO04CuxhCerlzbXWg'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)