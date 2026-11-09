<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { APP_NAME } from '@/lib/app'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const error = ref('')
const warning = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const initial = APP_NAME.trim().charAt(0).toUpperCase() || 'A'

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
  <div class="flex min-h-screen items-center justify-center p-6">
    <div class="w-full max-w-sm">
      <RouterLink to="/" class="mb-8 flex items-center gap-2.5">
        <span
          class="flex size-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-ink"
          >{{ initial }}</span
        >
        <span class="text-[15px] font-semibold tracking-tight">{{ APP_NAME }}</span>
      </RouterLink>

      <div class="rounded-2xl bg-card p-7 shadow-card">
        <h1 class="mb-1 text-2xl font-semibold tracking-tight">
          {{ isSignUp ? 'Create your account' : 'Welcome back' }}
        </h1>
        <p class="mb-6 text-sm text-muted">
          {{ isSignUp ? 'It takes a few seconds.' : 'Sign in to carry on where you left off.' }}
        </p>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col text-left">
            <label for="email" class="mb-1.5 text-sm font-medium">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
              class="w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink placeholder:text-faint transition focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20"
            />
          </div>

          <div class="flex flex-col text-left">
            <label for="password" class="mb-1.5 text-sm font-medium">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Your password"
              required
              :autocomplete="isSignUp ? 'new-password' : 'current-password'"
              class="w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink placeholder:text-faint transition focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ loading ? 'One moment…' : isSignUp ? 'Create account' : 'Sign in' }}
          </button>
        </form>

        <div class="my-6 flex items-center gap-4 text-xs text-faint">
          <div class="h-px flex-1 bg-line" />
          <span>or</span>
          <div class="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          :disabled="googleLoading"
          class="flex w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-50"
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
          {{ googleLoading ? 'Redirecting…' : 'Continue with Google' }}
        </button>

        <p
          v-if="error"
          role="alert"
          class="mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          {{ error }}
        </p>
        <p
          v-if="warning"
          role="status"
          class="mt-4 rounded-lg bg-sunken px-3 py-2.5 text-sm text-muted"
        >
          {{ warning }}
        </p>
      </div>

      <p class="mt-6 text-center text-sm text-muted">
        {{ isSignUp ? 'Already have an account?' : 'New here?' }}
        <button
          type="button"
          class="font-medium text-accent hover:text-accent-hover"
          @click="toggleMode"
        >
          {{ isSignUp ? 'Sign in' : 'Create an account' }}
        </button>
      </p>
    </div>
  </div>
</template>
