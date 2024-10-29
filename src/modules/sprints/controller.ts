import { Database } from '@/database'
import { Router } from 'express'
import type { Request, Response } from 'express'
import * as schema from './schema'
import buildRepository from './repository'
import { z } from 'zod'
import { getSprintIdHandlers } from './handlers/sprintIdHandlers'
import { getSprintCodeHandlers } from './handlers/sprintCodeHandlers'

const ID_ROUTE = '/:id(\\d+)'
const SPRINT_CODE_ROUTE = '/:sprintcode([wW][dD]-\\d+\\.\\d+)'

export default (db: Database) => {
  const router = Router()
  const sprints = buildRepository(db)
  const idHandlers = getSprintIdHandlers(sprints)
  const codeHandlers = getSprintCodeHandlers(sprints)
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
            error: { message: 'Failed to create' },
          })
        }
        return res.status(201).json(result)
      } catch (error) {
        console.error('Error creating sprint:', error)
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            error: { message: 'Validation error' },
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          })
        }
        return res.status(500).json({
          error: { message: 'Failed to create sprint' },
        })
      }
    })
  router
    .route(ID_ROUTE)
    .get(idHandlers.get)
    .patch(idHandlers.patch)
    .delete(idHandlers.delete)
  router
    .route(SPRINT_CODE_ROUTE)
    .get(codeHandlers.get)
    .patch(codeHandlers.patch)
    .delete(codeHandlers.delete)
  return router
}
