<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const error = ref('')
const warning = ref('')
const loading = ref(false)
const googleLoading = ref(false)

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  return 'Something went wrong. Please try again.'
}

function clearMessages() {
  error.value = ''
  warning.value = ''
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  clearMessages()
}

async function handleSubmit() {
  clearMessages()
  loading.value = true

  try {
    if (isSignUp.value) {
      await auth.signUp(email.value, password.value)
    } else {
      await auth.signIn(email.value, password.value)
    }
    router.push('/')
  } catch (e: unknown) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  clearMessages()
  googleLoading.value = true

  try {
    await auth.signInWithGoogle()
    // On success, Supabase redirects the browser. If we reach this line,
    // it usually means the redirect was blocked or the provider isn't enabled.
  } catch (e: unknown) {
    // Supabase doesn't expose a stable error code for "provider disabled",
    // so we surface the raw message and add a hint about the most likely fix.
    error.value = errorMessage(e)
    warning.value =
      'If Google sign-in keeps failing, enable the Google provider in your Supabase dashboard under Authentication > Providers.'
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-6">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
      </h1>
      <p class="text-gray-500 mb-7">
        {{ isSignUp ? 'Sign up to get started' : 'Sign in to your account' }}
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col text-left">
          <label for="email" class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20 transition"
          />
        </div>

        <div class="flex flex-col text-left">
          <label for="password" class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your password"
            required
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
            class="w-full px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20 transition"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 px-4 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In' }}
        </button>
      </form>

      <div class="flex items-center gap-4 my-6 text-xs text-gray-400 uppercase tracking-wide">
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span>or</span>
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <button
        type="button"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleGoogleSignIn"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" class="shrink-0" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {{ googleLoading ? 'Redirecting...' : 'Continue with Google' }}
      </button>

      <p
        v-if="error"
        role="alert"
        class="mt-4 px-3 py-2.5 text-sm rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      >
        {{ error }}
      </p>
      <p
        v-if="warning"
        role="status"
        class="mt-4 px-3 py-2.5 text-sm rounded-lg text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
      >
        {{ warning }}
      </p>

      <p class="text-sm text-center mt-6">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <button type="button" class="text-accent font-medium hover:underline" @click="toggleMode">
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </button>
      </p>
    </div>
  </div>
</template>
