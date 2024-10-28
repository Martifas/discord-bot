import { getClient } from '.'

export default async (username: string) => {
  const client = getClient()
  if (client) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID!)

    const searchResults = await guild.members.search({
      query: username,
      limit: 1,
    })

    const member = searchResults.first()

    return member
  }
}
