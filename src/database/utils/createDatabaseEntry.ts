import 'dotenv/config'
import createDatabase from '..'
import type { DB } from '../types'

function isValidTable(table: string): table is keyof DB {
  return table === 'sprint'
}

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not defined in .env')
  process.exit(1)
}

const args = process.argv.slice(2)
const [table, ...titleParts] = args
const title = titleParts.join(' ')

if (!table || !title) {
  console.error('Usage: npm run insert <table> <title>')
  console.error('Example: npm run insert sprint "Test Title"')
  process.exit(1)
}

if (!isValidTable(table)) {
  console.error(`Error: Invalid table name. Valid tables are: sprint`)
  process.exit(1)
}

const db = createDatabase(process.env.DATABASE_URL)

try {
  const result = await db.insertInto(table).values(title).executeTakeFirst()

  console.log(
    `Successfully inserted into ${table}. Insert ID: ${result.insertId}`
  )
} catch (error) {
  console.error(`Error inserting into ${table}:`, error)
  process.exit(1)
}
