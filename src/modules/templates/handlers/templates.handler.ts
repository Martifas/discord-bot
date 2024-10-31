import { Request } from 'express'
import * as schema from '../schema'
import { TemplateRepository } from '../types/template-repository.types'
import { jsonRoute } from '@/middleware'
import { TemplateNotFound } from '../errors/errors'

const getId = (req: Request): number => {
  return schema.parseId(req.query.id)
}

const ensureExists = <T>(record: T | null): T => {
  if (!record) {
    throw new TemplateNotFound()
  }
  return record
}

export const getHandlers = (templates: TemplateRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const record = await templates.findById(id)

    return ensureExists(record)
  }),

  patch: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const bodyPatch = schema.parseUpdatable(req.body)
    const record = await templates.update(id, bodyPatch)

    return ensureExists(record)
  }),

  delete: jsonRoute(async (req: Request) => {
    const id = getId(req)
    const record = await templates.remove(id)

    return ensureExists(record)
  }),
})
