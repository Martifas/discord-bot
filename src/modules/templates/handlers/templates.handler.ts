import { Request } from 'express'
import * as schema from '../schema'
import { TemplateRepository } from '../types/template-repository.types'
import { jsonRoute } from '@/middleware'
import { TemplateNotFound } from '../errors'

const getId = (req: Request): number => {
  return schema.parseId(req.params.id)
}

export const getHandlers = (templates: TemplateRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const record = await templates.findById(id)

    if (!record) {
      throw new TemplateNotFound()
    }

    return record
  }),

  patch: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await templates.update(id, bodyPatch)

    if (!record) {
      throw new TemplateNotFound()
    }

    return record
  }),

  delete: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const record = await templates.remove(id)

    if (!record) {
      throw new TemplateNotFound()
    }

    return record
  }),
})
