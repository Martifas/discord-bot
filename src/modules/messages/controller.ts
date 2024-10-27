import 'dotenv/config'
import { Router, Request } from 'express'
import type { Database } from '@/database'
import buildRepository from './repository'
import sendMessage from '../bot/sendMessage'

export default (db: Database) => {
  const router = Router()
  const messages = buildRepository(db)
  router.post('/', async (req: Request, res: any) => {
    try {
      const { result, message } = await messages.create(req.body)
      await sendMessage(message)
      if (!result) {
        return res.status(500).json({
          error: 'Failed to create message',
        })
      }
      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating message:', error)
      return res.status(500).json({
        error: 'Failed to create message',
      })
    }
  })
  return router
}
