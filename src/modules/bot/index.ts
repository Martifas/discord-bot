import 'dotenv/config'
import { Client, GatewayIntentBits } from 'discord.js'

let clientInstance: Client | null = null

export const getClient = () => clientInstance

export default async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  try {
    await client.login(process.env.DISCORD_BOT_ID)
    console.log('Discord bot is now online!')
    clientInstance = client
    return client
  } catch (error) {
    console.error('Failed to login:', error)
    process.exit(1)
  }
}
