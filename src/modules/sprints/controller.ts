import { Database } from '@/database'
import { Router } from 'express'
import type { Request, Response } from 'express'
import * as schema from './schema'
import buildRepository from './repository'
import { z } from 'zod'

export default (db: Database) => {
  const router = Router()
  const sprints = buildRepository(db)

  router
    .route('/')
    .get(async (req: Request, res: any) => {
      try {
        const records = await sprints.findAll()

        return res.status(200).json(records)
      } catch (error) {
        console.error('Error fetching sprints:', error)
        return res.status(500).json({
          error: { message: 'Internal server error while fetching sprints' },
        })
      }
    })
    .post(async (req: Request, res: any) => {
      try {
        const body = schema.parseInsertable(req.body)
        const result = await sprints.create(body)

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

        return res.status(500).json({
          error: 'Failed to create completion',
        })
      }
    })

  // router.patch('/', (req, res) => {})

  // router.delete('/', (req, res) => {})

  return router
}
