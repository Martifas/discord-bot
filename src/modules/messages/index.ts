import 'dotenv/config'
import { Router } from 'express'
import axios from 'axios'
import { getClient } from '../bot'
import { TextChannel } from 'discord.js'

const router = Router()

const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL
if (!GENERAL_CHANNEL) {
  throw new Error('GENERAL_CHANNEL must be defined in environment variables')
}

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random/')
    const quote = response.data[0].q

    const client = getClient()
    if (client) {
      const channel = await client.channels.fetch(GENERAL_CHANNEL)

      if (channel instanceof TextChannel) {
        channel.send(quote)
      } else {
        console.log('Channel is not a text channel!')
      }
    }

    res.json({ message: quote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    res.status(500).json({ error: 'Failed to fetch quote' })
  }
})

export default router
