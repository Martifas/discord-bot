import * as schema from '../schema'
import { Request } from 'express'
import { jsonRoute } from '@/middleware'
import { CantUpdateSprint, SprintNotFound } from '../errors/errors'
import { SprintRepository } from '../types/sprint-repository.types'

const getSprintCode = (req: Request): string => {
  return schema.parseSprintCode(req.query.sprintcode).toUpperCase()
}

export const getSprintCodeHandlers = (sprints: SprintRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const sprintCode = getSprintCode(req)
    const record = await sprints.findBy({ sprintCode })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  patch: jsonRoute(async (req: Request) => {
    const sprintCode = getSprintCode(req)
    const existingSprint = await sprints.findBy({ sprintCode })

    if (!existingSprint) {
      throw new SprintNotFound()
    }
    if ('sprintCode' in req.body) {
      throw new CantUpdateSprint()
    }
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await sprints.updateBy({ sprintCode }, bodyPatch)

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
  delete: jsonRoute(async (req: Request) => {
    const sprintCode = getSprintCode(req)
    const record = await sprints.removeBy({ sprintCode })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
})
