import type { Database } from '@/database'
import type { Sprint } from '@/database'
import type { Insertable } from 'kysely'

type Row = Sprint
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>

export default (db: Database) => ({
  async create(data: RowInsert): Promise<any> {},
  async get(data: any): Promise<any> {},
  async update(data: any): Promise<any> {},
  async delete(data: any): Promise<any> {},
})
