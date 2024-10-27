import { Database, Message } from '@/database'
import { Insertable } from 'kysely'

const TABLE = 'message'
type Row = Message
type RowInsert = Insertable<Row>

export default (db: Database) => ({
  async create(): Promise<any> {
    const messageBody: RowInsert = {
      messageId: 1,
      message: 'Congratulations',
    }

    const result = await db
      .insertInto(TABLE)
      .values(messageBody)
      .returning(['messageId', 'message'])
      .executeTakeFirst()

    return result
  },
})
