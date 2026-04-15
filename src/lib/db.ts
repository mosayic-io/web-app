import { supabase } from './supabase'

/**
 * Generic database layer for Supabase.
 *
 * Usage:
 *   const posts = db('posts')
 *   const all = await posts.getAll()
 *   const one = await posts.getById('some-id')
 *   const created = await posts.create({ title: 'Hello' })
 *   const updated = await posts.update('some-id', { title: 'Updated' })
 *   await posts.remove('some-id')
 *
 * For custom queries, use `posts.query()` to get the raw Supabase query builder.
 */
export function db<T extends Record<string, unknown> = Record<string, unknown>>(table: string) {
  function query() {
    return supabase.from(table)
  }

  async function getAll(options?: { column?: string; order?: 'asc' | 'desc'; limit?: number }) {
    let q = query().select('*')
    if (options?.column) {
      q = q.order(options.column, { ascending: options.order !== 'desc' })
    }
    if (options?.limit) {
      q = q.limit(options.limit)
    }
    const { data, error } = await q
    if (error) throw error
    return data as T[]
  }

  async function getById(id: string) {
    const { data, error } = await query().select('*').eq('id', id).single()
    if (error) throw error
    return data as T
  }

  async function getWhere(column: string, value: unknown) {
    const { data, error } = await query().select('*').eq(column, value)
    if (error) throw error
    return data as T[]
  }

  async function create(record: Partial<T>) {
    const { data, error } = await query().insert(record as any).select().single()
    if (error) throw error
    return data as T
  }

  async function createMany(records: Partial<T>[]) {
    const { data, error } = await query().insert(records as any).select()
    if (error) throw error
    return data as T[]
  }

  async function update(id: string, updates: Partial<T>) {
    const { data, error } = await query().update(updates as any).eq('id', id).select().single()
    if (error) throw error
    return data as T
  }

  async function upsert(record: Partial<T>) {
    const { data, error } = await query().upsert(record as any).select().single()
    if (error) throw error
    return data as T
  }

  async function remove(id: string) {
    const { error } = await query().delete().eq('id', id)
    if (error) throw error
  }

  async function count() {
    const { count: total, error } = await query().select('*', { count: 'exact', head: true })
    if (error) throw error
    return total ?? 0
  }

  return { query, getAll, getById, getWhere, create, createMany, update, upsert, remove, count }
}
