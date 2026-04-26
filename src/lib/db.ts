import { supabase } from './supabase'

/**
 * Generic database layer for Supabase.
 *
 * Usage:
 *   const posts = db<Post>('posts')
 *   const all = await posts.getAll({ orderBy: 'created_at', direction: 'desc' })
 *   const one = await posts.getById('some-id')
 *   const draft = await posts.findOneWhere('slug', 'hello-world')
 *   const created = await posts.create({ title: 'Hello' })
 *   const updated = await posts.update('some-id', { title: 'Updated' })
 *   await posts.remove('some-id')
 *
 * For complex queries, use `posts.query()` to drop down to the raw Supabase
 * query builder.
 *
 * Note: insert/update/upsert payloads are cast to `any` because Supabase's
 * generated types require a full Database schema. If you generate Supabase
 * types for your project, swap the casts for the typed signatures. Don't
 * scatter `as any` across your own code -- prefer fixing types at the boundary.
 */
export function db<T extends Record<string, unknown> = Record<string, unknown>>(table: string) {
  function query() {
    return supabase.from(table)
  }

  async function getAll(options?: {
    orderBy?: string
    direction?: 'asc' | 'desc'
    limit?: number
  }) {
    let q = query().select('*')
    if (options?.orderBy) {
      q = q.order(options.orderBy, { ascending: options.direction !== 'desc' })
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

  async function findOneWhere(column: string, value: unknown) {
    const { data, error } = await query().select('*').eq(column, value).maybeSingle()
    if (error) throw error
    return data as T | null
  }

  async function create(record: Partial<T>) {
    const { data, error } = await query()
      .insert(record as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single()
    if (error) throw error
    return data as T
  }

  async function createMany(records: Partial<T>[]) {
    const { data, error } = await query()
      .insert(records as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
    if (error) throw error
    return data as T[]
  }

  async function update(id: string, updates: Partial<T>) {
    const { data, error } = await query()
      .update(updates as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as T
  }

  async function upsert(record: Partial<T>) {
    const { data, error } = await query()
      .upsert(record as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .select()
      .single()
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

  return {
    query,
    getAll,
    getById,
    getWhere,
    findOneWhere,
    create,
    createMany,
    update,
    upsert,
    remove,
    count,
  }
}
