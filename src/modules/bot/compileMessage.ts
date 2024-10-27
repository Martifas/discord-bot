import fetchUser from './fetchUser'

interface CompletionRecord {
  username: string
  sprintCode: string
}

export default async (record: CompletionRecord): Promise<string> => {
  let messageBot = `@${record.username} has completed the course!`

  if (process.env.NODE_ENV !== 'test') {
    try {
      const member = await fetchUser(record)
      if (member) {
        messageBot = `<@${member.id}> has completed the course!`
      }
    } catch (error) {
      console.error('Discord error:', error)
    }
  }

  return messageBot
}
