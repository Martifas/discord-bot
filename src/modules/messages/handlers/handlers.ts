import { jsonRoute } from '@/middleware'
import { MessageRepository } from '../types/messages-repository'
import * as schema from '../schema'
import { MessageNotFound } from '../errors/errors'
import { Request } from 'express'

export const getSprintHandlers = (messages: MessageRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const sprint = schema.parseSprintCode(req.query.sprint).toUpperCase()
    const records = await messages.findBy({ sprint })

    if (records.length === 0) {
      throw new MessageNotFound()
    }

    return records
  }),
})

export const getusernameHandlers = (messages: MessageRepository) => ({
  get: jsonRoute(async (req: Request) => {
    const username = schema.parseUsername(req.query.username).toLowerCase()
    const records = await messages.findBy({ username })

    if (records.length === 0) {
      throw new MessageNotFound()
    }

    return records
  }),
})
