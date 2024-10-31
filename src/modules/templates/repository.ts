import type { Database } from '@/database'
import { RowInsert, RowSelect, RowUpdate } from './types/template.types'
import { keys } from './schema'
import { DuplicateTemplateIdError } from './errors/errors'

const TABLE = 'template'

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    const existing = await db
      .selectFrom(TABLE)
      .select(keys)
      .where('template', '=', record.template)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateTemplateIdError(record.template)
    }

    const created = await db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()

    return created
  },

  findById(id: number): Promise<RowSelect | undefined> {
    const record = db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()

    return record
  },

  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id)
    }

    const record = db
      .updateTable(TABLE)
      .set(partial)
      .returning(keys)
      .where('id', '=', id)
      .executeTakeFirst()

    return record
  },

  remove(id: number): Promise<RowSelect | undefined> {
    const record = db
      .deleteFrom(TABLE)
      .returning(keys)
      .where('id', '=', id)
      .executeTakeFirst()

    return record
  },
})
