import * as schema from '../schema'
import { Request } from 'express'
import { jsonRoute } from '@/middleware'
import { CantUpdateSprint, SprintNotFound } from '../errors'
import { SprintRepository } from '../types/sprint-repository.types'

export const getSprintCodeHandlers = (sprints: SprintRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const sprintCode = schema.parseSprintCode(req.params.sprintcode)
    const record = await sprints.findByIdOrSprintCode({ sprintCode })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),

  patch: jsonRoute(async (req: Request) => {
    const sprintCode = schema.parseSprintCode(req.params.sprintcode)
    const existingSprint = await sprints.findByIdOrSprintCode({ sprintCode })

    if (!existingSprint) {
      throw new SprintNotFound()
    }
    if ('sprintCode' in req.body) {
      throw new CantUpdateSprint()
    }
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await sprints.updateByIdOrSprintCode(
      { sprintCode },
      bodyPatch
    )

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
  delete: jsonRoute(async (req: Request) => {
    const sprintCode = schema.parseSprintCode(req.params.sprintcode)
    const record = await sprints.removeByIdOrSprintCode({ sprintCode })

    if (!record) {
      throw new SprintNotFound()
    }

    return record
  }),
})
