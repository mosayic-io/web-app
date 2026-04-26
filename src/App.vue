<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { supabaseConfigured } from '@/lib/supabase'

const auth = useAuthStore()
</script>

<template>
  <div v-if="!supabaseConfigured" class="flex items-center justify-center min-h-screen p-6">
    <div class="max-w-md w-full text-center">
      <div
        class="w-12 h-12 mx-auto mb-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-2xl font-bold flex items-center justify-center"
      >
        !
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Supabase Not Configured
      </h1>
      <p class="text-gray-500 mb-6">
        The app can't connect to Supabase. Set the following environment variables to get started:
      </p>
      <div class="flex flex-col items-center gap-2 mb-6">
        <code
          class="px-3 py-1.5 rounded-md text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >VITE_SUPABASE_URL</code
        >
        <code
          class="px-3 py-1.5 rounded-md text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >VITE_SUPABASE_PUBLISHABLE_KEY</code
        >
      </div>
      <div
        class="text-left border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-3 text-sm"
      >
        <p>
          <strong>1.</strong> Copy
          <code
            class="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
            >.env.example</code
          >
          to
          <code
            class="px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
            >.env</code
          >
        </p>
        <p><strong>2.</strong> Fill in your Supabase project URL and publishable key</p>
        <p><strong>3.</strong> Restart the dev server</p>
      </div>
    </div>
  </div>

  <div
    v-else-if="auth.loading"
    class="flex items-center justify-center min-h-screen"
    role="status"
    aria-live="polite"
  >
    <span class="sr-only">Loading</span>
    <div
      class="size-8 rounded-full border-3 border-gray-200 dark:border-gray-700 border-t-accent animate-spin"
      aria-hidden="true"
    />
  </div>

  <div
    v-else-if="auth.initError"
    role="alert"
    class="flex items-center justify-center min-h-screen p-6"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Couldn't load your session
      </h1>
      <p class="text-gray-500 mb-4">{{ auth.initError }}</p>
      <p class="text-gray-500 text-sm">
        Check your network connection and Supabase configuration, then refresh the page.
      </p>
    </div>
  </div>

  <router-view v-else />
</template>
