import 'dotenv/config'
import type { Insertable, Selectable } from 'kysely'
import type { Message, Database } from '@/database'
import { getClient } from '../bot'
const TABLE = 'message'
type Row = Message
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowSelect = Selectable<Row>

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

interface CreateResult {
  result: RowSelect | undefined
  message: string
}

export default (db: Database) => ({
  async create(record: RowInsert): Promise<CreateResult> {
    // Store message without Discord mentions for DB
    const messageDB = `${record.username} has completed the course!`
    let messageBot = `@${record.username} has completed the course!` // Default message

    // Only try Discord functionality if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      try {
        const client = getClient()
        if (client) {
          const guild = await client.guilds.fetch(process.env.GUILD_ID!)
          const member = guild.members.cache.find(
            (m) =>
              m.user.username === record.username ||
              m.user.globalName === record.username
          )

          if (member) {
            messageBot = `<@${member.id}> has completed the course!`
          }
        }
      } catch (error) {
        console.error('Discord error:', error)
        // Continue with default message if Discord fails
      }
    }

    const messageBody: RowInsert = {
      username: record.username,
      sprintCode: record.sprintCode,
      message: messageDB,
    }

    const result = await db
      .insertInto(TABLE)
      .values(messageBody)
      .returning(['id', 'username', 'sprintCode', 'message'])
      .executeTakeFirst()

    return {
      result: result || undefined,
      message: messageBot,
    }
  },
})
