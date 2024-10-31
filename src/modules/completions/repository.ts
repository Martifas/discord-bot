import 'dotenv/config'
import type { Completion, Database } from '@/database'
import { RowInsert, RowSelect } from './types/completion.types'

const COMPLETION_TABLE = 'completion'
const MESSAGE_TABLE = 'message'

export default async (db: Database) => ({
  async create(data: RowInsert): Promise<RowSelect | undefined> {
    const messageDb = `@${data.username} has completed the course!`

    return await db.transaction().execute(async (trx) => {
      const completion = await trx
        .insertInto(COMPLETION_TABLE)
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto(MESSAGE_TABLE)
        .values({ messageId: completion.id, message: messageDb })
        .returningAll()
        .executeTakeFirstOrThrow()

      return completion
    })
  },
})
