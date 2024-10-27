import { getClient } from '.'
import { TextChannel } from 'discord.js'

export default async (message: string) => {
  const client = getClient()
  const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL

  if (!GENERAL_CHANNEL) {
    throw new Error('GENERAL_CHANNEL must be defined in environment variables')
  }

  if (client) {
    const channel = await client.channels.fetch(GENERAL_CHANNEL)
    if (channel instanceof TextChannel) {
      await channel.send(message)
    } else {
      throw new Error('Channel is not a text channel!')
    }
  }
}
