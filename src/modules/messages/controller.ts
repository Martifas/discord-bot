import { Database } from '@/database'
import { Router } from 'express'
import * as schema from './schema'
import buildRepository from './repository'
import { jsonRoute, unsupportedRoute } from '@/middleware'
import sendMessage from '../bot/sendMessage'
import { StatusCodes } from 'http-status-codes'
import { getCodeHandlers, getusernameHandlers } from './handlers/handlers'

export default async (db: Database) => {
  const router = Router()
  const messages = await buildRepository(db)
  const usernameHandler = getusernameHandlers(messages)
  const codeHandler = getCodeHandlers(messages)

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        const { result, message } = await messages.create(body)
        if (result) {
          await sendMessage(result.username, message)
        }

        return result
      }, StatusCodes.CREATED)
    )
    .get((req, res, next) => {
      if (!req.query.username && !req.query.code) {
        return jsonRoute(messages.findAll)(req, res, next)
      }

      if (req.query.username) {
        return usernameHandler.get(req, res, next)
      }

      if (req.query.code) {
        return codeHandler.get(req, res, next)
      }
    })
    .patch(unsupportedRoute)
    .delete(unsupportedRoute)

  return router
}
