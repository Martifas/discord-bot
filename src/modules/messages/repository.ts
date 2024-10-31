import { Database } from '@/database'
import { RowInsert, RowSelect } from './types/messages.types'
import { keys } from './schema'
import { completionKeys } from '../completions/schema'
import { DuplicateRecordError } from './errors'
import { Params } from './types/messages-repository'

const MESSAGE_TABLE = 'message'
const COMPLETION_TABLE = 'completion'

export default async (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(MESSAGE_TABLE).select(keys).execute()
  },
  async create(data: RowInsert): Promise<RowSelect | undefined> {
    const existing = await db
      .selectFrom('completion')
      .select(completionKeys)
      .where('sprintCode', '=', data.sprintCode)
      .where('username', '=', data.username)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateRecordError()
    }
    const messageDb = `@${data.username} has completed the course!`

    return await db.transaction().execute(async (trx) => {
      const completion = await trx
        .insertInto('completion')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow()

      const message = await trx
        .insertInto(MESSAGE_TABLE)
        .values({
          messageId: completion.id,
          sprintCode: completion.sprintCode,
          username: completion.username,
          message: messageDb,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return message
    })
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
