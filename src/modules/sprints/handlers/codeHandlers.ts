import * as schema from '../schema'
import { Request } from 'express'
import { jsonRoute } from '@/middleware'
import { CantUpdateSprint, SprintNotFound } from '../errors/errors'
import { SprintRepository } from '../types/sprint-repository.types'

const getSprintCode = (req: Request): string => {
  return schema.parseSprintCode(req.query.sprint).toUpperCase()
}

export const getSprintCodeHandlers = (sprints: SprintRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const sprint = getSprintCode(req)
    const record = await sprints.findBy({ sprint })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  patch: jsonRoute(async (req: Request) => {
    const sprint = getSprintCode(req)
    const existingSprint = await sprints.findBy({ sprint })

    if (!existingSprint) {
      throw new SprintNotFound()
    }
    if ('sprintCode' in req.body) {
      throw new CantUpdateSprint()
    }
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await sprints.updateBy({ sprint }, bodyPatch)

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
  delete: jsonRoute(async (req: Request) => {
    const sprint = getSprintCode(req)
    const record = await sprints.removeBy({ sprint })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
})
