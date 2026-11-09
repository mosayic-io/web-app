<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { supabaseConfigured } from '@/lib/supabase'

const auth = useAuthStore()
</script>

<template>
  <div v-if="!supabaseConfigured" class="flex min-h-screen items-center justify-center p-6">
    <div class="w-full max-w-md rounded-2xl bg-card p-7 shadow-card">
      <h1 class="mb-2 text-xl font-semibold tracking-tight">Supabase isn't set up yet</h1>
      <p class="mb-5 text-sm leading-relaxed text-muted">
        The app needs two values in its
        <code class="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink"
          >.env</code
        >
        file to reach your database:
        <code class="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink"
          >VITE_SUPABASE_URL</code
        >
        and
        <code class="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink"
          >VITE_SUPABASE_PUBLISHABLE_KEY</code
        >.
      </p>
      <ol class="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted">
        <li>
          Copy
          <code class="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink"
            >.env.example</code
          >
          to
          <code class="rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink"
            >.env</code
          >
        </li>
        <li>Fill in your Supabase project's URL and publishable key</li>
        <li>Restart the dev server</li>
      </ol>
    </div>
  </div>

  <div
    v-else-if="auth.loading"
    class="flex min-h-screen items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <span class="sr-only">Loading</span>
    <div
      class="size-7 animate-spin rounded-full border-3 border-line border-t-accent"
      aria-hidden="true"
    />
  </div>

  <div
    v-else-if="auth.initError"
    role="alert"
    class="flex min-h-screen items-center justify-center p-6"
  >
    <div class="w-full max-w-md rounded-2xl bg-card p-7 shadow-card">
      <h1 class="mb-2 text-xl font-semibold tracking-tight">Couldn't load your session</h1>
      <p class="mb-3 text-sm text-danger">{{ auth.initError }}</p>
      <p class="text-sm text-muted">
        Check your network connection and Supabase configuration, then refresh the page.
      </p>
    </div>
  </div>

  <router-view v-else />
</template>
