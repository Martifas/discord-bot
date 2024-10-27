import 'dotenv/config'
import { Router, Request } from 'express'
import type { Database } from '@/database'
import buildRepository from './repository'
import { getClient } from '../bot'
import { TextChannel } from 'discord.js'
import { type Client } from 'discord.js'

export default (db: Database) => {
  const router = Router()
  const messages = buildRepository(db)
  router.post('/', async (req: Request, res: any) => {
    try {
      const { result, message } = await messages.create(req.body)
      await randomFunction(message)
      if (!result) {
        return res.status(500).json({
          error: 'Failed to create message',
        })
      }
      return res.status(201).json(result)
    } catch (error) {
      console.error('Error creating message:', error)
      return res.status(500).json({
        error: 'Failed to create message',
      })
    }
  })
  return router
}
const postMessage = async (
  client: Client,
  message: string,
  targetChannel: string
) => {
  const channel = await client.channels.fetch(targetChannel)
  if (channel instanceof TextChannel) {
    await channel.send(message)
  } else {
    console.log('Channel is not a text channel!')
  }
}
const randomFunction = async (message: string) => {
  const client = getClient()
  const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL
  if (!GENERAL_CHANNEL) {
    throw new Error('GENERAL_CHANNEL must be defined in environment variables')
  }
  if (client) {
    await postMessage(client, message, GENERAL_CHANNEL)
  }
}
