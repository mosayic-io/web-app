# Web App Template

A Vue 3 + Vite + TypeScript SPA template with Tailwind CSS, Supabase auth, and a database access layer.

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your Supabase credentials
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key |

## Project Structure

```
src/
  components/
    ui/                  # Reusable UI components
  lib/
    supabase.ts          # Supabase client
    db.ts                # Database access layer
  router/
    index.ts             # Vue Router with auth guards
  stores/
    auth.ts              # Pinia auth store (email, Google OAuth)
  styles/
    theme.css            # Tailwind import + theme overrides (single file)
  views/
    Home.vue             # Authenticated homepage
    Login.vue            # Login / signup page
  App.vue
  main.ts
```

## Styling

Tailwind CSS v4 is the styling system. All customization lives in one file: `src/styles/theme.css`.

This file:
- Imports Tailwind
- Overrides theme values (`@theme` block) -- fonts, brand colors, custom tokens
- Sets base element defaults (`@layer base` block)

To change the app's brand color, edit `--color-accent` in the `@theme` block. All components reference it via `bg-accent`, `text-accent`, etc.

Views and components use Tailwind utility classes directly in templates. No custom CSS framework to learn.

## Database Layer

`src/lib/db.ts` provides a thin wrapper over the Supabase client for CRUD operations:

```ts
import { db } from '../lib/db'

interface Post { id: string; title: string; body: string }

const posts = db<Post>('posts')

await posts.getAll({ column: 'created_at', order: 'desc' })
await posts.getById('some-id')
await posts.getWhere('author_id', userId)
await posts.create({ title: 'Hello', body: 'World' })
await posts.update('some-id', { title: 'Updated' })
await posts.remove('some-id')
await posts.count()

// For complex queries, drop down to the raw Supabase builder:
const { data } = await posts.query().select('id, title').ilike('title', '%search%')
```

## Auth

The auth store (`src/stores/auth.ts`) supports:

- Email/password sign-in and sign-up
- Google OAuth (gracefully warns if not configured)
- Persistent sessions via Supabase `onAuthStateChange`
- Router guards (`requiresAuth`, `guestOnly`)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
