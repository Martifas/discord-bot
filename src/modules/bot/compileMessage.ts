import fetchUser from './fetchUser'

interface CompletionRecord {
  username: string
  sprintCode: string
}

interface CompletionResponse {
  messageDb: string
  messageBot?: string
}

export default async (
  record: CompletionRecord
): Promise<CompletionResponse> => {
  const messageDb = `@${record.username} has completed the course!`
  let messageBot: string | undefined

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

  return {
    messageDb,
    messageBot:
      messageBot ?? `User ${record.username} has completed the course!`,
  }
}
