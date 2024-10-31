import { Database } from '@/database'
import { Router } from 'express'

export default async (db: Database) => {
  const router = Router()
  const completions = await buildRepository(db)
  const handlers = getHandlers(completions)

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body)
        const result = await completions.create(body)
        if (result) {
          await sendMessage(result.username)
        }

        return result
      }, StatusCodes.CREATED)
    )
    .get((req, res, next) => {
      if (!req.query.id) {
        return jsonRoute(completions.findAll)(req, res, next)
      }

      return handlers.get(req, res, next)
    })
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
