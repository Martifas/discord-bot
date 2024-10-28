import { getClient } from '.'
import { TextChannel } from 'discord.js'
import fetchUser from './fetchUser'

export default async (username: string) => {
  let message: string | undefined

  if (process.env.NODE_ENV !== 'test') {
    try {
      const member = await fetchUser(username)
      if (member) {
        message = `<@${member.id}> has completed the course!`
      }
    } catch (error) {
      console.error('Discord error:', error)
    }
  }

  if (!message) {
    return
  }

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
