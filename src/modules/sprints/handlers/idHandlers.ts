import * as schema from '../schema'
import { Request } from 'express'
import { jsonRoute } from '@/middleware'
import { SprintNotFound } from '../errors'
import { SprintRepository } from '../types/sprint-repository.types'

export const getSprintIdHandlers = (sprints: SprintRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const id = schema.parseId(req.params.id)
    const record = await sprints.findByIdOrSprintCode({ id })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  patch: jsonRoute(async (req: Request) => {
    const id = schema.parseId(req.params.id)
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await sprints.updateByIdOrSprintCode({ id }, bodyPatch)

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  delete: jsonRoute(async (req: Request) => {
    const id = schema.parseId(req.params.id)
    const record = await sprints.removeByIdOrSprintCode({ id })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
})
