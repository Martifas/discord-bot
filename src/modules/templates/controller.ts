import { Database } from '@/database'
import { Router } from 'express'
import buildRepository from './repository'
import { getHandlers } from './handlers/templates.handler'
import { jsonRoute, unsupportedRoute } from '@/middleware'
import * as schema from './schema'
import { StatusCodes } from 'http-status-codes'

export default (db: Database) => {
  const router = Router()
  const templates = buildRepository(db)
  const handlers = getHandlers(templates)

  router
    .route('/')
    .get((req, res, next) => {
      if (!req.query.id) {
        return jsonRoute(templates.findAll)(req, res, next)
      }

      return handlers.get(req, res, next)
    })
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return templates.create(body)
      }, StatusCodes.CREATED)
    )
    .patch((req, res, next) => {
      if (req.query.id) {
        return handlers.patch(req, res, next)
      }
      return unsupportedRoute(req, res, next)
    })
    .delete((req, res, next) => {
      if (req.query.id) {
        return handlers.delete(req, res, next)
      }
      return unsupportedRoute(req, res, next)
    })

  return router
}
