<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const error = ref('')
const warning = ref('')
const loading = ref(false)
const googleLoading = ref(false)

async function handleSubmit() {
  error.value = ''
  warning.value = ''
  loading.value = true

  try {
    if (isSignUp.value) {
      await auth.signUp(email.value, password.value)
    } else {
      await auth.signIn(email.value, password.value)
    }
    router.push('/')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  error.value = ''
  warning.value = ''
  googleLoading.value = true

  try {
    await auth.signInWithGoogle()
  } catch (e: any) {
    const msg = e.message?.toLowerCase() ?? ''
    if (msg.includes('provider') || msg.includes('oauth') || msg.includes('google') || msg.includes('not enabled')) {
      warning.value = 'Google sign-in is not configured yet. Enable the Google provider in your Supabase dashboard under Authentication > Providers.'
    } else {
      error.value = e.message
    }
  } finally {
    googleLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</h1>
      <p class="subtitle">{{ isSignUp ? 'Sign up to get started' : 'Sign in to your account' }}</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="you@example.com" required autocomplete="email" />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Your password" required autocomplete="current-password" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
        </button>
      </form>

      <div class="divider">
        <span>or</span>
      </div>

      <button class="btn btn-google" :disabled="googleLoading" @click="handleGoogleSignIn">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ googleLoading ? 'Redirecting...' : 'Continue with Google' }}
      </button>

      <p v-if="error" class="message error">{{ error }}</p>
      <p v-if="warning" class="message warning">{{ warning }}</p>

      <p class="toggle">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <a href="#" @click.prevent="isSignUp = !isSignUp; error = ''; warning = ''">
          {{ isSignUp ? 'Sign In' : 'Sign Up' }}
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

h1 {
  font-size: 1.75rem;
  margin: 0 0 4px;
}

.subtitle {
  color: var(--text);
  margin-bottom: 28px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
}

input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  background: var(--bg);
  color: var(--text-h);
  transition: border-color 0.15s;
}

input::placeholder {
  color: var(--text);
  opacity: 0.5;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-google {
  background: var(--bg);
  color: var(--text-h);
  border: 1px solid var(--border);
}

.btn-google:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--text);
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: var(--text);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.message {
  font-size: 14px;
  line-height: 1.4;
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.warning {
  color: #a16207;
  background: #fefce8;
  border: 1px solid #fde68a;
}

@media (prefers-color-scheme: dark) {
  .error {
    color: #fca5a5;
    background: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.3);
  }
  .warning {
    color: #fcd34d;
    background: rgba(161, 98, 7, 0.1);
    border-color: rgba(161, 98, 7, 0.3);
  }
}

.toggle {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
}

.toggle a {
  color: var(--accent);
  font-weight: 500;
}
</style>
