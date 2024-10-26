import 'dotenv/config'
import type { Insertable, Selectable } from 'kysely'
import type { Message, Database } from '@/database'

const TABLE = 'message'
type Row = Message
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export default (db: Database, message: string) => ({
  async create(record: RowInsert): Promise<RowSelect | undefined> {
    const messageBody: RowInsert = {
      username: record.username,
      sprintCode: record.sprintCode,
      message: message,
    }

    const result = await db
      .insertInto(TABLE)
      .values(messageBody)
      .returning(['id', 'username', 'sprintCode', 'message'])
      .executeTakeFirst()

    return result || undefined
  },
})
