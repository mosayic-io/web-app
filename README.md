# Web App Template

A Vue 3 + Vite + TypeScript SPA template with Tailwind CSS, Supabase auth, a database access layer, and an HTTP client for talking to a backend API.

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
| `VITE_API_URL` | Base URL of the backend API (defaults to `http://localhost:8080`) |

## Project Structure

```
src/
  components/
    ui/                  # Reusable UI components (Button.vue is a sample)
  lib/
    supabase.ts          # Supabase client
    db.ts                # Database access layer (Supabase)
    api.ts               # HTTP client for the backend API
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
public/
  _redirects             # SPA fallback for static hosts (Cloudflare Pages, Netlify, etc.)
```

Imports use the `@/` alias (e.g. `import { db } from '@/lib/db'`) — `@` maps to `src/`.

## Styling

Tailwind CSS v4 is the styling system. All customization lives in one file: `src/styles/theme.css`.

This file:
- Imports Tailwind
- Overrides theme values (`@theme` block) -- fonts, brand colors, custom tokens
- Sets base element defaults (`@layer base` block)

To change the app's brand color, edit `--color-accent` in the `@theme` block. All components reference it via `bg-accent`, `text-accent`, etc.

Views and components use Tailwind utility classes directly in templates. No custom CSS framework to learn.

## Database Layer

`src/lib/db.ts` provides a thin wrapper over the Supabase client for CRUD operations. Use it for direct, RLS-protected reads and writes from the browser:

```ts
import { db } from '@/lib/db'

interface Post { id: string; title: string; body: string }

const posts = db<Post>('posts')

await posts.getAll({ orderBy: 'created_at', direction: 'desc' })
await posts.getById('some-id')
await posts.getWhere('author_id', userId)
await posts.findOneWhere('slug', 'hello-world')
await posts.create({ title: 'Hello', body: 'World' })
await posts.update('some-id', { title: 'Updated' })
await posts.remove('some-id')
await posts.count()

// For complex queries, drop down to the raw Supabase builder:
const { data } = await posts.query().select('id, title').ilike('title', '%search%')
```

## Backend API

`src/lib/api.ts` is the HTTP client for talking to a backend service (e.g. a FastAPI server). It:

- Reads its base URL from `VITE_API_URL` (defaults to `http://localhost:8080`).
- Auto-attaches the current Supabase access token as `Authorization: Bearer <token>` on every request — pass `{ auth: false }` to opt out for public endpoints.
- Throws `ApiError` (with `status`, `statusText`, `data`, `url`) on non-2xx responses.

```ts
import { api, resource, ApiError } from '@/lib/api'

// One-off calls
const hello = await api.get<{ message: string }>('/')
const me = await api.get<{ user_id: string }>('/protected')
await api.post('/things', { name: 'x' })
await api.get('/items', { params: { page: 2, q: 'foo' } })

// REST resource (mirrors db() but for HTTP)
interface Todo { id: string; title: string; done: boolean }
const todos = resource<Todo>('/todos')
const all = await todos.list()
const created = await todos.create({ title: 'New' })

try {
  await api.get('/protected', { auth: false })
} catch (e) {
  if (e instanceof ApiError && e.status === 401) {
    // ...
  }
}
```

**When to use which?** Use `db()` for reads and writes that go directly to Supabase tables (RLS-protected). Use `api()` for any custom backend logic (third-party integrations, complex aggregations, anything that needs a server secret).

## Auth

The auth store (`src/stores/auth.ts`) supports:

- Email/password sign-in and sign-up
- Google OAuth (gracefully warns if not configured)
- Persistent sessions via Supabase `onAuthStateChange`
- Router guards (`requiresAuth`, `guestOnly`)
- A surfaced `initError` so init failures don't silently leave the user on a blank screen

## Deployment

This template is built for static hosting. `npm run build` produces a `dist/` directory you can drop on any static host. The included `public/_redirects` file enables SPA fallback (so refreshing `/login` doesn't 404) on:

- Cloudflare Pages
- Netlify
- Render

For Vercel, deep-link rewrites are auto-detected for Vite SPAs — no extra config needed. For other hosts (S3, nginx), configure a fallback to `index.html` for unknown paths.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (Vue + TypeScript) |
| `npm run format` | Prettier write |
