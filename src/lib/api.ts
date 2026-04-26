import { supabase, supabaseConfigured } from './supabase'

/**
 * Generic HTTP client for the backend API.
 *
 * Usage:
 *   import { api, resource, ApiError } from '@/lib/api'
 *
 *   // One-off calls
 *   const hello = await api.get<{ message: string }>('/')
 *   const me = await api.get<{ user_id: string }>('/protected')
 *   await api.post('/things', { name: 'x' })
 *   await api.get('/items', { params: { page: 2, q: 'foo' } })
 *
 *   // REST resource (mirrors the db() helper for HTTP)
 *   interface Todo { id: string; title: string; done: boolean }
 *   const todos = resource<Todo>('/todos')
 *   const all = await todos.list()
 *   const one = await todos.get(id)
 *   const created = await todos.create({ title: 'New' })
 *   await todos.update(id, { done: true })
 *   await todos.remove(id)
 *
 *   // Error handling
 *   try { await api.get('/protected') }
 *   catch (e) { if (e instanceof ApiError && e.status === 401) ... }
 */

export const apiBaseUrl: string =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080'

export class ApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data: unknown
  readonly url: string

  constructor(status: number, statusText: string, data: unknown, url: string) {
    super(`API ${status} ${statusText} (${url})`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
    this.url = url
  }
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>

export interface RequestOptions {
  params?: QueryParams
  headers?: Record<string, string>
  /** Attach the Supabase access token as a Bearer header. Default: true. */
  auth?: boolean
  signal?: AbortSignal
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabaseConfigured) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildUrl(path: string, params?: QueryParams): string {
  const root = path.startsWith('http')
    ? path
    : `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
  if (!params) return root
  const url = new URL(root)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    url.searchParams.append(key, String(value))
  }
  return url.toString()
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const url = buildUrl(path, options.params)
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.auth !== false) Object.assign(headers, await authHeader())

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  })

  const contentType = res.headers.get('content-type') ?? ''
  let data: unknown = undefined
  if (res.status !== 204) {
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => undefined)
    } else {
      data = await res.text().catch(() => undefined)
    }
  }

  if (!res.ok) throw new ApiError(res.status, res.statusText, data, url)
  return data as T
}

export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>('GET', path, undefined, options),
  post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
}

/**
 * Build a typed REST resource bound to a base path. Mirrors the shape of
 * the `db()` helper in `lib/db.ts` but for HTTP endpoints.
 */
export function resource<T extends Record<string, unknown> = Record<string, unknown>>(
  basePath: string,
) {
  const root = basePath.startsWith('/') ? basePath : `/${basePath}`
  const idPath = (id: string | number) => `${root}/${encodeURIComponent(String(id))}`

  return {
    list: (params?: QueryParams, options?: RequestOptions) =>
      api.get<T[]>(root, { ...options, params }),
    get: (id: string | number, options?: RequestOptions) => api.get<T>(idPath(id), options),
    create: (body: Partial<T>, options?: RequestOptions) => api.post<T>(root, body, options),
    update: (id: string | number, body: Partial<T>, options?: RequestOptions) =>
      api.patch<T>(idPath(id), body, options),
    replace: (id: string | number, body: Partial<T>, options?: RequestOptions) =>
      api.put<T>(idPath(id), body, options),
    remove: (id: string | number, options?: RequestOptions) =>
      api.delete<void>(idPath(id), options),
  }
}
