import 'dotenv/config'
import axios from 'axios'
import { getClient } from '../bot'
import { TextChannel } from 'discord.js'
import { type Client } from 'discord.js'

export default async function () {
  const client = getClient()
  const quote = await fetchQuote()
  const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL
  if (!GENERAL_CHANNEL) {
    throw new Error('GENERAL_CHANNEL must be defined in environment variables')
  }

  if (client) {
    await postMessage(client, quote, GENERAL_CHANNEL)
  }

  return quote
}

const fetchQuote = async () => {
  const response = await axios.get('https://zenquotes.io/api/random/')
  return response.data[0].q
}

const postMessage = async (
  client: Client,
  quote: string,
  targetChannel: string
) => {
  const channel = await client.channels.fetch(targetChannel)
  if (channel instanceof TextChannel) {
    await channel.send(quote)
  } else {
    console.log('Channel is not a text channel!')
  }
}
