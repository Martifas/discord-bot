import 'dotenv/config'
import type { Insertable } from 'kysely'
import type { Completion, Database } from '@/database'
import compileMessage from '../bot/compileMessage'

type Row = Completion
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type CompletionResultRow = Omit<Completion, 'id'> & { id: number }

interface CompletionResult {
  result: CompletionResultRow
  message: {
    message: string
  }
}

export default async (db: Database) => ({
  async create(data: RowInsert): Promise<CompletionResult> {
    const { messageBot, messageDb } = await compileMessage(data)

    return await db.transaction().execute(async (trx) => {
      const completion = await trx
        .insertInto('completion')
        .values({ sprintCode: data.sprintCode, username: data.username })
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('message')
        .values({ messageId: completion.id, message: messageDb })
        .returningAll()
        .executeTakeFirstOrThrow()

      const result: CompletionResultRow = {
        id: completion.id as number,
        sprintCode: completion.sprintCode,
        username: completion.username,
      }

      return {
        result,
        message: { message: messageBot ?? '' },
      }
    })
  },
})
