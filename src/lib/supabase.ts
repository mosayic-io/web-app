import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigured = !!(supabaseUrl && supabasePublishableKey)

export const supabase: SupabaseClient = supabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : new Proxy({} as SupabaseClient, {
      get() {
        throw new Error('Supabase is not configured')
      },
    })
