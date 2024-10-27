import 'dotenv/config'
import type { Insertable, Selectable } from 'kysely'
import type { Completion, Database } from '@/database'
import { getClient } from '../bot'

const TABLE = 'completion'
type Row = Completion
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
    let messageBot = `@${record.username} has completed the course!`

    if (process.env.NODE_ENV !== 'test') {
      try {
        const client = getClient()
        if (client) {
          const guild = await client.guilds.fetch(process.env.GUILD_ID!)
          console.log('Looking for username:', record.username)

          // Use search instead of fetching all members
          const searchResults = await guild.members.search({
            query: record.username,
            limit: 1,
          })

          console.log('Search results:', searchResults.size)

          const member = searchResults.first()
          console.log('Found member:', member?.user.username || 'Not found')

          if (member) {
            messageBot = `<@${member.id}> has completed the course!`
          }
        }
      } catch (error) {
        console.error('Discord error:', error)
      }
    }

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
