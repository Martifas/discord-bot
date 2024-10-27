import supertest from 'supertest'
import createTestDatabase from '@tests/createTestDatabase'
import { Insertable } from 'kysely'
import createApp from '@/app'
import { selectAllFor } from '@tests/utils/record'
import { Message } from '@/database'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const selectMessages = selectAllFor(db, 'message')

afterEach(async () => {
  await db.deleteFrom('message').execute()
})
const TEST_USER = 'architektas'
const TEST_MESSAGE = `${TEST_USER} has completed the course!`
const TEST_SPRINTCODE = 'WD-1.1'

const fakeMessage = (
  overrides: Partial<Insertable<Message>> = {}
): Insertable<Message> => ({
  message: TEST_MESSAGE,
  sprintCode: TEST_SPRINTCODE,
  username: TEST_USER,
  ...overrides,
})

const messageMatcher = (overrides: Partial<Insertable<Message>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeMessage(overrides),
})

describe('POST', () => {
  it('should allow creating new message record', async () => {
    const testData = fakeMessage()
    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeMessage())
      .expect(201)

    expect(body).toEqual(messageMatcher())
  })
  it('persists the new message', async () => {
    await supertest(app).post('/messages').send(fakeMessage()).expect(201)

    await expect(selectMessages()).resolves.toEqual([messageMatcher()])
  })

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        ...fakeMessage(),
        id: 123456,
      })

    expect(body.id).not.toEqual(123456)
  })
})
