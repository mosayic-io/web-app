# AGENTS.md -- AI Agent Instructions

This file provides context and rules for any AI agent (Claude, Copilot, Cursor, etc.) working on this codebase.

## Project Overview

This is a Vue 3 SPA built with Vite, TypeScript, Tailwind CSS, and Supabase. It serves as a template for building web applications with authentication and database access out of the box.

**Stack:** Vue 3 (Composition API) | Vite | TypeScript | Tailwind CSS v4 | Pinia | Vue Router | Supabase

## Architecture

```
src/
  components/ui/    # Reusable UI components
  lib/              # Service layer (supabase client, db access)
  router/           # Vue Router with auth guards
  stores/           # Pinia stores (auth)
  styles/
    theme.css       # Tailwind import + theme customization (single file)
  views/            # Page-level components
```

## Critical Rules

### Vue Components

- Always use `<script setup lang="ts">` syntax. Never use the Options API.
- Use the Composition API with `ref()`, `computed()`, `watch()`, and composables.
- Props are defined with `defineProps<{}>()` using TypeScript generics, not runtime declarations.
- Emits are defined with `defineEmits<{}>()`.
- Use `v-model` with `defineModel()` for two-way binding in custom components.
- Keep components small. If a template exceeds ~100 lines, extract sub-components.

### Styling -- Tailwind CSS

**All styling uses Tailwind utility classes applied directly in templates.**

- The single theme file is `src/styles/theme.css`. It contains the Tailwind import, `@theme` overrides (fonts, brand colors, custom tokens), and `@layer base` defaults.
- To change the brand color, fonts, or add custom design tokens, edit the `@theme` block in `theme.css`.
- Use Tailwind classes in templates: `class="flex items-center gap-4 text-sm text-gray-500"`.
- Use the custom theme colors via Tailwind: `bg-accent`, `text-accent`, `hover:bg-accent-hover`, etc.
- For dark mode, use the `dark:` variant: `class="text-gray-900 dark:text-gray-100"`.
- Use `<style scoped>` sparingly -- only for complex component-specific layout that would be unwieldy as utility classes.
- NEVER create additional top-level CSS files. All theme customization goes in `theme.css`.
- NEVER hardcode colors or spacing outside of `theme.css`. If you need a new reusable value, add it to the `@theme` block.

### Supabase & Database

- The Supabase client is in `src/lib/supabase.ts`. Never create a second client.
- `supabaseConfigured` is exported as a boolean -- use it to guard against missing env vars.
- For database access, use the `db()` helper from `src/lib/db.ts`:

```ts
import { db } from '../lib/db'

interface Todo { id: string; title: string; done: boolean }
const todos = db<Todo>('todos')

const all = await todos.getAll()
const one = await todos.getById(id)
const created = await todos.create({ title: 'New' })
await todos.update(id, { done: true })
await todos.remove(id)

// Complex queries:
const { data } = await todos.query().select('*').eq('done', false).order('created_at')
```

- For new database interactions, extend the `db()` helper or use `query()` for one-off queries. Do not call `supabase.from()` directly in components.

### Auth

- Auth state lives in the `useAuthStore()` Pinia store.
- The store provides: `user`, `session`, `isAuthenticated`, `loading`, `signIn()`, `signUp()`, `signInWithGoogle()`, `signOut()`.
- Session is initialized before the app mounts (in `main.ts`).
- Route guards are in `router/index.ts`: `meta.requiresAuth` and `meta.guestOnly`.
- After login, navigate to `/`. After logout, navigate to `/login`.

### Router

- All routes are in `src/router/index.ts`.
- Use `meta: { requiresAuth: true }` for authenticated pages.
- Use `meta: { guestOnly: true }` for pages like login/signup.
- Import view components directly (no lazy loading until the app grows large).

### Pinia Stores

- Use the setup syntax: `defineStore('name', () => { ... })`.
- Stores go in `src/stores/`.
- Export one store per file with the `use{Name}Store` naming convention.

## Reference Links

- Vue 3 docs: https://vuejs.org/guide/introduction.html
- Vue Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Vue `<script setup>`: https://vuejs.org/api/sfc-script-setup.html
- Vue Style Guide: https://vuejs.org/style-guide/
- Vite docs: https://vite.dev/guide/
- Vue Router: https://router.vuejs.org/
- Pinia: https://pinia.vuejs.org/
- Tailwind CSS v4: https://tailwindcss.com/docs
- Supabase JS client: https://supabase.com/docs/reference/javascript/introduction
- Supabase Auth: https://supabase.com/docs/guides/auth
- TypeScript with Vue: https://vuejs.org/guide/typescript/overview.html

## Common Pitfalls

- **Reactive destructuring**: Don't destructure props or store state -- it breaks reactivity. Use `props.foo` or `storeToRefs()`.
- **Template refs**: Use `const el = ref<HTMLElement | null>(null)` with `ref="el"` in the template.
- **Async in setup**: `<script setup>` is synchronous. Use `onMounted()` for async work or call async functions without awaiting at the top level.
- **Supabase RLS**: Remember that Supabase uses Row Level Security. If queries return empty results unexpectedly, check your RLS policies in the Supabase dashboard.
- **Vite env vars**: Only variables prefixed with `VITE_` are exposed to client code. Never put secrets in `VITE_` variables.
- **Tailwind v4 `@theme`**: Custom values are added in the `@theme` block, not in a `tailwind.config.js` file. Tailwind v4 does not use a JS config file.
