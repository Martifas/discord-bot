import 'dotenv/config'
import express from 'express'
import bot from './modules/bot'
import messages from './modules/completions/controller'
import sprints from './modules/sprints/controller'
import { type Database } from '../src/database'

export default async function createApp(db: Database) {
  const app = express()

  const completionsRouter = await messages(db)

  app.use(express.json())
  app.use('/messages', completionsRouter)
  app.use('/sprints', sprints(db))

  if (process.env.NODE_ENV !== 'test') {
    try {
      const discordClient = await bot()
      app.set('discordClient', discordClient)
    } catch (error) {
      console.error('Failed to initialize Discord bot:', error)
    }
  }

  return app
}
