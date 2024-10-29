import { Database } from '@/database'
import { Router } from 'express'
import * as schema from './schema'
import buildRepository from './repository'
import { getSprintIdHandlers } from './handlers/idHandlers'
import { getSprintCodeHandlers } from './handlers/sprintcodeHandlers'
import { jsonRoute, unsupportedRoute } from '@/middleware'
import { StatusCodes } from 'http-status-codes'

const ID_ROUTE = '/:id(\\d+)'
const SPRINT_CODE_ROUTE = '/:sprintcode([wW][dD]-\\d+\\.\\d+)'

export default (db: Database) => {
  const router = Router()
  const sprints = buildRepository(db)
  const idHandlers = getSprintIdHandlers(sprints)
  const codeHandlers = getSprintCodeHandlers(sprints)
  router
    .route('/')
    .get(jsonRoute(sprints.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)

        return sprints.create(body)
      }, StatusCodes.CREATED)
    )
    .patch(unsupportedRoute)
    .delete(unsupportedRoute)

  router
    .route(ID_ROUTE)
    .post(unsupportedRoute)
    .get(idHandlers.get)
    .patch(idHandlers.patch)
    .delete(idHandlers.delete)

  router
    .route(SPRINT_CODE_ROUTE)
    .post(unsupportedRoute)
    .get(codeHandlers.get)
    .patch(codeHandlers.patch)
    .delete(codeHandlers.delete)
  return router
}
