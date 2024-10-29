import type { Database } from '@/database'
import type { Sprint } from '@/database'
import type { Insertable, Selectable } from 'kysely'
import { keys } from './schema'

const TABLE = 'sprint'
type Row = Sprint
type RowWithoutId = Omit<Row, 'id'>
type RowSelect = Selectable<Row>
type RowInsert = Insertable<RowWithoutId>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },
})
