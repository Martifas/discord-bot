import { z } from 'zod'
import { Router, Request } from 'express'
import type { Database } from '@/database'
import buildRepository from './repository'
import sendMessage from '../bot/sendMessage'
import * as schema from './schema'

export default async (db: Database) => {
  const router = Router()
  const completions = await buildRepository(db)

  router.post('/', async (req: Request, res: any): Promise<any> => {
    try {
      const body = schema.parseInsertable(req.body)
      const result = await completions.create(body)
      await sendMessage(result.username)

      if (!result) {
        return res.status(500).json({
          error: 'Failed to create',
        })
      }

      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating completion:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }

      // Handle other types of errors
      return res.status(500).json({
        error: 'Failed to create completion',
      })
    }
  })

  return router
}
