import 'dotenv/config'
import type { Insertable } from 'kysely'
import type { Completion, Database } from '@/database'

type Row = Completion
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type CompletionResultRow = Omit<Completion, 'id'> & { id: number }

export default async (db: Database) => ({
  async create(data: RowInsert): Promise<CompletionResultRow> {
    const messageDb = `@${data.username} has completed the course!`

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

      const response: CompletionResultRow = {
        id: completion.id as number,
        sprintCode: completion.sprintCode,
        username: completion.username,
      }

      return response
    })
  },
})
