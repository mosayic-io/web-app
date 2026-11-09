<script setup lang="ts">
// A page only signed-in people see (the router's requiresAuth), as a
// pattern for every private page the app grows.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut } from '@lucide/vue'
import AppShell from '@/components/layout/AppShell.vue'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const signingOut = ref(false)

async function handleSignOut() {
  signingOut.value = true
  try {
    await auth.signOut()
    router.push('/login')
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <AppShell>
    <h1 class="mb-6 text-3xl font-semibold tracking-tight">Account</h1>

    <section class="max-w-xl rounded-2xl bg-card shadow-card">
      <div class="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div class="min-w-0">
          <p class="text-sm text-muted">Signed in as</p>
          <p class="truncate text-[15px] font-medium">{{ auth.user?.email }}</p>
        </div>
        <span
          v-if="auth.isAdmin"
          class="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
          >Admin</span
        >
      </div>
      <div class="flex justify-end px-6 py-4">
        <Button variant="secondary" :loading="signingOut" @click="handleSignOut">
          <LogOut v-if="!signingOut" class="size-4" :stroke-width="2" />
          Sign out
        </Button>
      </div>
    </section>
  </AppShell>
</template>
