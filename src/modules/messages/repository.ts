import 'dotenv/config'
import type { Insertable, Selectable } from 'kysely'
import type { Completion, Database } from '@/database'
import compileMessage from '../bot/compileMessage'

const TABLE = 'completion'
type Row = Completion
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

interface CreateResult {
  result: RowSelect | undefined
  message: string
}
export default (db: Database) => ({
  async create(record: RowInsert): Promise<CreateResult> {
    const messageBot = await compileMessage(record)

    const completionBody: RowInsert = {
      username: record.username,
      sprintCode: record.sprintCode,
    }
    const result = await db
      .insertInto(TABLE)
      .values(completionBody)
      .returning(['id', 'username', 'sprintCode'])
      .executeTakeFirst()
    return {
      result: result || undefined,
      message: messageBot,
    }
  },
})
