import 'dotenv/config'
import type { Insertable } from 'kysely'
import type { Completion, Database } from '@/database'
import compileMessage from '../bot/compileMessage'

type Row = Completion
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>

export default async (db: Database) => ({
  async create(data: RowInsert) {
    const messageBot = await compileMessage(data)

    return await db.transaction().execute(async (trx) => {
      const completion = await trx
        .insertInto('completion')
        .values({ sprintCode: data.sprintCode, username: data.username })
        .returningAll()
        .executeTakeFirstOrThrow()

      const messages = await trx
        .insertInto('message')
        .values({ messageId: completion.id, message: messageBot })
        .returningAll()
        .executeTakeFirstOrThrow()

      return {
        result: completion,
        message: messages,
      }
    })
  },
})
