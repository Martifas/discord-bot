import { z } from 'zod'
import * as schema from '../schema'
import { Request } from 'express'
import { jsonRoute } from '@/utils/errors/middleware'
import { SprintNotFound } from '../errors'
export const getSprintCodeHandlers = (sprints: any) => ({
  get: jsonRoute(async (req: Request) => {
    const sprintCode = schema.parseSprintCode(req.params.sprintcode)
    const record = await sprints.findByIdOrSprintCode({ sprintCode })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  patch: async (req: Request, res: any) => {
    try {
      const sprintCode = schema.parseSprintCode(req.params.sprintcode)

      const existingSprint = await sprints.findByIdOrSprintCode({ sprintCode })
      if (!existingSprint) {
        return res.status(404).json({
          error: { message: 'Sprint not found' },
        })
      }

      if ('sprintCode' in req.body) {
        return res.status(400).json({
          error: { message: 'Cannot update sprint code' },
        })
      }

      const bodyPatch = schema.parseUpdatable(req.body)
      const record = await sprints.updateByIdOrSprintCode(
        { sprintCode },
        bodyPatch
      )

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
  },
  delete: async (req: Request, res: any) => {
    try {
      const sprintCode = schema.parseSprintCode(req.params.sprintcode)
      const record = await sprints.removeByIdOrSprintCode({ sprintCode })
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
  },
})
