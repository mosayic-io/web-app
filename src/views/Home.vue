<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleSignOut() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="flex items-center justify-between px-6 h-14 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="font-semibold text-lg text-gray-900 dark:text-gray-100">Web App</div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">{{ auth.user?.email }}</span>
        <button
          class="px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 transition"
          @click="handleSignOut"
        >
          Sign Out
        </button>
      </div>
    </nav>

    <main class="flex-1 flex flex-col items-center justify-center p-12 gap-3">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Home</h1>
      <p class="text-gray-500">You're signed in. Start building from here.</p>
    </main>
  </div>
</template>
