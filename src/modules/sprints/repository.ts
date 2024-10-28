import type { Database } from '@/database'
import type { Sprint } from '@/database'
import type { Insertable, Selectable } from 'kysely'
import { keys } from './schema'

type Row = Sprint
type RowWithoutId = Omit<Row, 'id'>
type RowSelect = Selectable<Row>
type RowInsert = Insertable<RowWithoutId>

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom('sprint').select(keys).execute()
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto('sprint')
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },
})
