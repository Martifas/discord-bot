import 'dotenv/config'
import axios from 'axios'
import { Client, GatewayIntentBits, Message } from 'discord.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on('ready', () => {
  console.log('bot is ready')
})

client.on('messageCreate', async (message: Message) => {
  if (message.content === 'ping') {
    await message.reply({
      content: 'pong',
    })
  } else if (message.content === 'quote') {
    const resp = await axios.get('https://zenquotes.io/api/random/')
    const quote = resp.data[0].q
    await message.reply({
      content: quote,
    })
  }
})

try {
  await client.login(process.env.DISCORD_BOT_ID)
} catch (error) {
  console.error('Failed to login:', error)
  process.exit(1)
}