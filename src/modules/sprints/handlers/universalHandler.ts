import { z } from 'zod'
import * as schema from '../schema'
import { Request } from 'express'

type SprintIdentifier = {
  id?: string
  sprintCode?: string
}

export const getSprintHandlers = (sprints: any) => ({
  get: async (req: Request, res: any) => {
    try {
      const identifier = parseIdentifier(req.params)
      const record = await sprints.findByIdOrSprintCode(identifier)

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
  },

  patch: async (req: Request, res: any) => {
    try {
      const identifier = parseIdentifier(req.params)

      if (identifier.sprintCode && 'sprintCode' in req.body) {
        return res.status(400).json({
          error: { message: 'Cannot update sprint code' },
        })
      }

      if (identifier.sprintCode) {
        const existingSprint = await sprints.findByIdOrSprintCode(identifier)
        if (!existingSprint) {
          return res.status(404).json({
            error: { message: 'Sprint not found' },
          })
        }
      }

      const bodyPatch = schema.parseUpdatable(req.body)
      const record = await sprints.updateByIdOrSprintCode(identifier, bodyPatch)

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
  },

  delete: async (req: Request, res: any) => {
    try {
      const identifier = parseIdentifier(req.params)
      const record = await sprints.removeByIdOrSprintCode(identifier)

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

function parseIdentifier(params: any): SprintIdentifier {
  if ('id' in params) {
    // Convert number to string if necessary
    const parsedId = schema.parseId(params.id)
    return { id: String(parsedId) } // Ensure id is always a string
  }
  if ('sprintcode' in params) {
    return { sprintCode: schema.parseSprintCode(params.sprintcode) }
  }
  throw new Error(
    'Invalid route parameters: must provide either id or sprintcode'
  )
}
