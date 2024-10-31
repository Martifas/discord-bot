import { Insertable } from 'kysely'
import { Message } from '@/database'

export const fakeMessage = (): Insertable<Message> => ({
  messageId: 1,
  message: 'Test message',
  sprintCode: 'WD-1.1',
  username: 'testauskas',
})
