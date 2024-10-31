import { Database } from '@/database'
import { RowInsert, RowSelect } from './types/messages.types'
import { keys } from './schema'
import { DuplicateRecordError } from './errors/errors'
import { createResults, Params } from './types/messages-repository'

const MESSAGE_TABLE = 'message'

export default async (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(MESSAGE_TABLE).select(keys).execute()
  },

  async create(data: RowInsert): Promise<createResults> {
    const existing = await db
      .selectFrom(MESSAGE_TABLE)
      .select(keys)
      .where('sprintCode', '=', data.sprintCode)
      .where('username', '=', data.username)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateRecordError()
    }

    const course = await db
      .selectFrom('sprint')
      .select('title')
      .where('sprintCode', '=', data.sprintCode)
      .executeTakeFirst()

    const messageDb = `@${data.username} has just completed ${course?.title}!`

    const record = await db
      .insertInto(MESSAGE_TABLE)
      .values({
        sprintCode: data.sprintCode,
        message: messageDb,
        username: data.username,
      })
      .returning(keys)
      .executeTakeFirst()

    return { result: record, message: messageDb }
  },

  findBy(params: Params): Promise<RowSelect | undefined> {
    let query = db.selectFrom(MESSAGE_TABLE).select(keys)
    if (params.username !== undefined) {
      query = query.where('username', '=', params.username)
    }
    if (params.sprintCode !== undefined) {
      query = query.where('sprintCode', '=', params.sprintCode)
    }
    return query.executeTakeFirst()
  },
})
