import createApp from '@/app'
import createTestDatabase from '@tests/createTestDatabase'
import { createFor } from '@tests/utils/record'
import supertest from 'supertest'
import { Insertable } from 'kysely'
import { Message } from '@/database'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const createMessages = createFor(db, 'message')

afterEach(async () => {
  await db.deleteFrom('message').execute()
})

const fakeMessage = (
  overrides: Partial<Insertable<Message>> = {}
): Insertable<Message> => ({
  messageId: 1,
  message:
    'architektas has just completed Computer Science Fundamentals! Well done! 👏 Enjoy what you do and success will follow. 🤗',
  ...overrides,
})

describe('GET', () => {
  it('should return all messages', async () => {
    await supertest(app).get('/messages').expect(200)
  })
  //   it(`should return a list of messages for a given user`, async () => {
  //     await createMessages([
  //         fakeMessage(),fakeMessage({
  //             messageId: 2,
  //             message: 'Congratulations to user'
  //         }),
  //     ])

  //     const { body } = await supertest(app).get('/messages?username')
  //     await supertest(app).get(`/messages?username=${TEST_USERNAME}`).expect(200)
  //   })
})
