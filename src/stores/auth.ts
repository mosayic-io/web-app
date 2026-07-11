import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const initError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // True when the user's JWT carries app_metadata.admin = true. Unlike
  // user_metadata, app_metadata cannot be modified by the user -- it is set
  // server-side (SQL editor / service role) and baked into every token, so
  // it's safe to gate admin UI on. Pair it with is_admin() RLS policies in
  // the database: this flag hides the door; RLS is the lock.
  const isAdmin = computed(() => user.value?.app_metadata?.admin === true)

  async function initialize() {
    if (!supabaseConfigured) {
      loading.value = false
      return
    }

    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      session.value = data.session
      user.value = data.session?.user ?? null

      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch (e) {
      initError.value = e instanceof Error ? e.message : String(e)
      console.error('[auth] failed to initialize session:', e)
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    session,
    loading,
    initError,
    isAuthenticated,
    isAdmin,
    initialize,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }
})
