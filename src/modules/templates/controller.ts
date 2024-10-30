import { Database } from '@/database'
import { Router } from 'express'
import buildRepository from './repository'
import { getHandlers } from './handlers/templates.handler'
import { jsonRoute, unsupportedRoute } from '@/middleware'
import * as schema from './schema'
import { StatusCodes } from 'http-status-codes'

const ID_ROUTE = '/id/:id(\\d+)'

export default (db: Database) => {
  const router = Router()
  const templates = buildRepository(db)
  const handlers = getHandlers(templates)

  router

    .route('/')
    .get(jsonRoute(templates.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)

        return templates.create(body)
      }, StatusCodes.CREATED)
    )
    .patch(unsupportedRoute)
    .delete(unsupportedRoute)

  router
    .route(ID_ROUTE)
    .post(unsupportedRoute)
    .get(handlers.get)
    .patch(handlers.patch)
    .delete(handlers.delete)

  return router
}
