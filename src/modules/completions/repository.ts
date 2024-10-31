import type { Database } from '@/database'
import { RowInsert, RowSelect, RowUpdate } from './types/completion.types'
import { keys } from './schema'
import { DuplicateCompletionError } from './errors'

const COMPLETION_TABLE = 'completion'

export default async (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(COMPLETION_TABLE).select(keys).execute()
  },
  async create(data: RowInsert): Promise<RowSelect | undefined> {
    const existing = await db
      .selectFrom(COMPLETION_TABLE)
      .select(keys)
      .where('sprintCode', '=', data.sprintCode)
      .where('username', '=', data.username)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateCompletionError()
    }
    const messageDb = `@${data.username} has completed the course!`

    return await db.transaction().execute(async (trx) => {
      const completion = await trx
        .insertInto(COMPLETION_TABLE)
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('message')
        .values({ messageId: completion.id, message: messageDb })
        .returningAll()
        .executeTakeFirstOrThrow()

      return completion
    })
  },

  findById(id: number): Promise<RowSelect | undefined> {
    const record = db
      .selectFrom(COMPLETION_TABLE)
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
      .updateTable(COMPLETION_TABLE)
      .set(partial)
      .returning(keys)
      .where('id', '=', id)
      .executeTakeFirst()

    return record
  },

  remove(id: number): Promise<RowSelect | undefined> {
    const record = db
      .deleteFrom(COMPLETION_TABLE)
      .returning(keys)
      .where('id', '=', id)
      .executeTakeFirst()

    return record
  },
})
