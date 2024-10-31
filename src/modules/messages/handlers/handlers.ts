import { jsonRoute } from '@/middleware'
import { MessageRepository } from '../types/messages-repository'
import * as schema from '../schema'
import { MessageNotFound } from '../errors/errors'
import { Request } from 'express'

export const getCodeHandlers = (messages: MessageRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const sprintCode = schema
      .parseSprintCode(req.query.sprintcode)
      .toUpperCase()
    const record = await messages.findBy({ sprintCode })

    if (!record) {
      throw new MessageNotFound()
    }

    return record
  }),
})

export const getusernameHandlers = (messages: MessageRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const username = schema.parseSprintCode(req.query.username).toUpperCase()
    const record = await messages.findBy({ username })

    if (!record) {
      throw new MessageNotFound()
    }

    return record
  }),
})
