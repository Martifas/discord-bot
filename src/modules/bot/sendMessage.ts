import { getClient } from '.'
import { TextChannel } from 'discord.js'
import fetchUser from './fetchUser'

export default async (username: string, message: string) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  try {
    const member = await fetchUser(username)
    if (!member) {
      return
    }

    const client = getClient()
    const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL
    if (!GENERAL_CHANNEL) {
      throw new Error(
        'GENERAL_CHANNEL must be defined in environment variables'
      )
    }

    if (client) {
      const channel = await client.channels.fetch(GENERAL_CHANNEL)
      if (channel instanceof TextChannel) {
        const formattedMessage = message.replace(
          `@${username}`,
          `<@${member.id}>`
        )
        await channel.send(formattedMessage)
      } else {
        throw new Error('Channel is not a text channel!')
      }
    }
  } catch (error) {
    console.error('Discord error:', error)
  }
}
