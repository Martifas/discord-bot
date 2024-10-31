import { Database } from '@/database'
import { Router } from 'express'
import * as schema from './schema'
import buildRepository from './repository'
import { getSprintIdHandlers } from './handlers/idHandlers'
import { getSprintCodeHandlers } from './handlers/codeHandlers'
import { jsonRoute, unsupportedRoute } from '@/middleware'
import { StatusCodes } from 'http-status-codes'

export default (db: Database) => {
  const router = Router()
  const sprints = buildRepository(db)
  const idHandlers = getSprintIdHandlers(sprints)
  const codeHandlers = getSprintCodeHandlers(sprints)

  router
    .route('/')
    .get((req, res, next) => {
      if (!req.query.id && !req.query.sprintcode) {
        return jsonRoute(sprints.findAll)(req, res, next)
      }

      if (req.query.id) {
        return idHandlers.get(req, res, next)
      }

      if (req.query.sprintcode) {
        return codeHandlers.get(req, res, next)
      }
    })

    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        return sprints.create(body)
      }, StatusCodes.CREATED)
    )

    .patch((req, res, next) => {
      if (req.query.id) {
        return idHandlers.patch(req, res, next)
      }
      if (req.query.sprintcode) {
        return codeHandlers.patch(req, res, next)
      }
      return unsupportedRoute(req, res, next)
    })

    .delete((req, res, next) => {
      if (req.query.id) {
        return idHandlers.delete(req, res, next)
      }
      if (req.query.sprintcode) {
        return codeHandlers.delete(req, res, next)
      }
      return unsupportedRoute(req, res, next)
    })

  return router
}
