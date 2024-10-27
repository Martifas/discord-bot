import 'dotenv/config'
import { Router, Request } from 'express'
import type { Database } from '@/database'
import buildRepository from './repository'
import sendMessage from '../bot/sendMessage'

export default (db: Database) => {
  const router = Router()
  const completions = buildRepository(db)
  router.post('/', async (req: Request, res: any) => {
    try {
      const { result, message } = await completions.create(req.body)
      await sendMessage(message)
      if (!result) {
        return res.status(500).json({
          error: 'Failed to create',
        })
      }
      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating completion:', error)
      return res.status(500).json({
        error: 'Failed to create completion',
      })
    }
  })
  return router
}
