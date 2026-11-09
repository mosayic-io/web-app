<script setup lang="ts">
// A stand-in start page, so there's something to look at the first time the
// app runs. Everything here is built from the theme's tokens and plain
// Tailwind: replace it as soon as you know what this page is for.
import { computed, ref, type Component } from 'vue'
import { AppWindow, Check, Database, Layers, Lightbulb, Palette, Rocket } from '@lucide/vue'
import AppShell from '@/components/layout/AppShell.vue'

interface Step {
  id: string
  title: string
  detail: string
  time: string
  icon: Component
  done: boolean
}

// The road this app takes from an idea to the internet.
const steps = ref<Step[]>([
  {
    id: 'idea',
    title: 'Describe the idea',
    detail: 'Who it’s for, on one page',
    time: 'An evening',
    icon: Lightbulb,
    done: true,
  },
  {
    id: 'browser',
    title: 'Get it in a browser',
    detail: 'You’re looking at it',
    time: 'An afternoon',
    icon: AppWindow,
    done: true,
  },
  {
    id: 'look',
    title: 'Give it a look',
    detail: 'Colours and fonts live in theme.css',
    time: 'A day',
    icon: Palette,
    done: false,
  },
  {
    id: 'pages',
    title: 'Build the real pages',
    detail: 'Starting with this one',
    time: 'A few weeks',
    icon: Layers,
    done: false,
  },
  {
    id: 'backend',
    title: 'Connect the backend',
    detail: 'Supabase keeps your users and data',
    time: 'A day',
    icon: Database,
    done: false,
  },
  {
    id: 'online',
    title: 'Put it online',
    detail: 'Pushed to GitHub, served by Cloudflare',
    time: 'An hour',
    icon: Rocket,
    done: false,
  },
])

const filter = ref<'todo' | 'done'>('todo')
const shown = computed(() => steps.value.filter((s) => s.done === (filter.value === 'done')))
const doneCount = computed(() => steps.value.filter((s) => s.done).length)
const percent = computed(() => Math.round((doneCount.value / steps.value.length) * 100))

function toggle(step: Step) {
  step.done = !step.done
}

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const FILES = [
  { path: 'src/views/Home.vue', what: 'This page' },
  { path: 'src/styles/theme.css', what: 'Colours and fonts' },
  { path: 'src/router/index.ts', what: 'Every page and who may see it' },
  { path: 'src/components/layout/AppShell.vue', what: 'The sidebar and top bar' },
]
</script>

<template>
  <AppShell>
    <header class="mb-8 max-w-2xl">
      <p class="mb-2 text-sm font-medium text-accent">{{ today }}</p>
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Your web app starts here</h1>
      <p class="mt-3 text-[15px] leading-relaxed text-muted">
        Everything on this page is a stand-in, built from the same pieces your real pages will use.
        Swap it out as soon as you know what goes here.
      </p>
    </header>

    <div class="grid items-start gap-5 lg:grid-cols-3">
      <!-- The road -->
      <section class="min-w-0 rounded-2xl bg-card p-2 shadow-card lg:col-span-2">
        <div class="flex items-center justify-between gap-4 px-4 pt-4 pb-3">
          <h2 class="text-[15px] font-semibold">The road to launch</h2>
          <div class="flex rounded-lg bg-sunken p-1 text-sm" role="tablist">
            <button
              v-for="tab in [
                { value: 'todo', label: 'To do' },
                { value: 'done', label: 'Done' },
              ] as const"
              :key="tab.value"
              type="button"
              role="tab"
              :aria-selected="filter === tab.value"
              class="rounded-md px-3 py-1 font-medium transition"
              :class="
                filter === tab.value ? 'bg-card text-ink shadow-card' : 'text-muted hover:text-ink'
              "
              @click="filter = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <ul v-if="shown.length" class="flex flex-col">
          <li v-for="step in shown" :key="step.id">
            <button
              type="button"
              class="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-sunken"
              :aria-pressed="step.done"
              @click="toggle(step)"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
              >
                <component :is="step.icon" class="size-5" :stroke-width="1.75" />
              </span>
              <span class="min-w-0 flex-1">
                <span
                  class="block truncate text-[15px] font-medium"
                  :class="step.done ? 'text-muted line-through decoration-faint' : ''"
                  >{{ step.title }}</span
                >
                <span class="block truncate text-sm text-muted">{{ step.detail }}</span>
              </span>
              <span class="hidden text-xs text-faint sm:block">{{ step.time }}</span>
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-full border transition"
                :class="
                  step.done
                    ? 'border-accent bg-accent text-accent-ink'
                    : 'border-line text-transparent group-hover:border-accent group-hover:text-accent'
                "
              >
                <Check class="size-3.5" :stroke-width="3" />
              </span>
            </button>
          </li>
        </ul>
        <p v-else class="px-4 py-10 text-center text-sm text-muted">
          {{
            filter === 'done'
              ? 'Nothing done yet. Tick a step off.'
              : 'Every step is done. Ship it.'
          }}
        </p>
      </section>

      <div class="flex min-w-0 flex-col gap-5">
        <!-- Progress -->
        <section class="rounded-2xl bg-card p-6 shadow-card">
          <p class="text-sm text-muted">Progress</p>
          <p class="mt-1 text-3xl font-semibold tracking-tight">
            {{ doneCount }}<span class="text-faint"> / {{ steps.length }}</span>
          </p>
          <div class="mt-4 h-2 overflow-hidden rounded-full bg-sunken">
            <div
              class="h-full rounded-full bg-accent transition-[width] duration-500"
              :style="{ width: `${percent}%` }"
            />
          </div>
          <p class="mt-3 text-sm text-muted">{{ percent }}% of the way to launch</p>
        </section>

        <!-- Where things live -->
        <section class="rounded-2xl bg-card p-6 shadow-card">
          <h2 class="text-[15px] font-semibold">Where things live</h2>
          <ul class="mt-4 flex flex-col gap-3">
            <li v-for="file in FILES" :key="file.path">
              <p class="text-sm">{{ file.what }}</p>
              <p class="truncate font-mono text-xs text-muted">{{ file.path }}</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </AppShell>
</template>
