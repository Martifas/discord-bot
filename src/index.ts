import 'dotenv/config'
import createApp from './app'
import createDatabase from './database'

const { DATABASE_URL } = process.env
const PORT = 3000

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in .env file')
}

const database = createDatabase(DATABASE_URL)

async function startServer() {
  try {
    const app = await createApp(database)

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
