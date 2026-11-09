<script setup lang="ts">
// The frame around every signed-in-or-not page: a sidebar on wide screens,
// a top bar on narrow ones, and the page in the middle. Add a page to the
// app by adding a route AND a line to NAV.
import { House, CircleUser, LogIn } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { APP_NAME } from '@/lib/app'

const auth = useAuthStore()
const route = useRoute()

const NAV = [
  { to: '/', label: 'Home', icon: House },
  { to: '/account', label: 'Account', icon: CircleUser },
]

const initial = APP_NAME.trim().charAt(0).toUpperCase() || 'A'
</script>

<template>
  <div class="min-h-screen lg:flex">
    <!-- Sidebar (wide screens) -->
    <aside class="hidden w-60 shrink-0 flex-col border-r border-line px-4 py-6 lg:flex">
      <RouterLink to="/" class="mb-8 flex items-center gap-2.5 px-2">
        <span
          class="flex size-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-ink"
          >{{ initial }}</span
        >
        <span class="text-[15px] font-semibold tracking-tight">{{ APP_NAME }}</span>
      </RouterLink>

      <nav class="flex flex-col gap-1">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="
            route.path === item.to
              ? 'bg-card text-ink shadow-card'
              : 'text-muted hover:bg-sunken hover:text-ink'
          "
        >
          <component :is="item.icon" class="size-[18px]" :stroke-width="1.75" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="mt-auto px-2">
        <p v-if="auth.user" class="truncate text-xs text-muted">{{ auth.user.email }}</p>
        <RouterLink
          v-else
          to="/login"
          class="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
        >
          <LogIn class="size-4" :stroke-width="2" /> Sign in
        </RouterLink>
      </div>
    </aside>

    <!-- Top bar (narrow screens) -->
    <header class="flex h-14 items-center gap-3 border-b border-line px-4 lg:hidden">
      <RouterLink to="/" class="flex items-center gap-2">
        <span
          class="flex size-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-accent-ink"
          >{{ initial }}</span
        >
        <span class="text-sm font-semibold tracking-tight">{{ APP_NAME }}</span>
      </RouterLink>
      <nav class="ml-auto flex items-center gap-1">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          :aria-label="item.label"
          class="flex size-9 items-center justify-center rounded-lg transition"
          :class="route.path === item.to ? 'bg-card text-ink shadow-card' : 'text-muted'"
        >
          <component :is="item.icon" class="size-[18px]" :stroke-width="1.75" />
        </RouterLink>
      </nav>
    </header>

    <main class="min-w-0 flex-1">
      <div class="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
        <slot />
      </div>
    </main>
  </div>
</template>
