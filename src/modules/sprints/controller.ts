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
    .route('/:id(\\d+)')
    .get(async (req: Request, res: any) => {
      try {
        const id = schema.parseId(req.params.id)
        const record = await sprints.findByIdOrSprintCode({ id })

        if (!record) {
          return res.status(404).json({
            error: { message: 'Sprint not found' },
          })
        }

        return res.status(200).json(record)
      } catch (error) {
        console.error('Error fetching sprint:', error)
        return res.status(500).json({
          error: { message: 'Internal server error while fetching sprint' },
        })
      }
    })
    .patch(async (req: Request, res: any) => {
      try {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdatable(req.body)
        const record = await sprints.updateByIdOrSprintCode({ id }, bodyPatch)

        if (!record) {
          return res.status(404).json({
            error: { message: 'Sprint not found' },
          })
        }
        return res.status(200).json(record)
      } catch (error) {
        console.error('Error updating sprint:', error)
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
          error: { message: 'Failed to update sprint' },
        })
      }
    })

    .delete(async (req: Request, res: any) => {
      try {
        const id = schema.parseId(req.params.id)
        const record = await sprints.remove(id)

        if (!record) {
          return res.status(404).json({
            error: { message: 'Sprint not found' },
          })
        }
        return res.status(200).json(record)
      } catch (error) {
        console.error('Error deleting sprint:', error)
        return res.status(500).json({
          error: { message: 'Internal server error while deleting sprint' },
        })
      }
    })

  return router
}
