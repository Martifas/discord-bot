import { getClient } from '.'
import { TextChannel } from 'discord.js'
import fetchUser from './fetchUser'
import giphySearch from '../messages/messageCompiler/fetchGif'

export default async (username: string, message: string) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  try {
    const gifs = await giphySearch()
    const gifUrl = gifs?.images.original.url

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
        const formattedMessage = message.replace(username, `<@${member.id}>`)
        if (gifUrl) {
          await channel.send({
            content: formattedMessage,
            files: [gifUrl],
          })
        } else {
          await channel.send(formattedMessage)
        }
      } else {
        throw new Error('Channel is not a text channel!')
      }
    }
  } catch (error) {
    console.error('Discord error:', error)
  }
}
