import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { Insertable } from 'kysely'
import createApp from '@/app'
import { selectAllFor } from '@tests/utils/record'
import { Completion } from '@/database'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const selectCompletions = selectAllFor(db, 'completion')

afterEach(async () => {
  await db.deleteFrom('completion').execute()
})

const TEST_USER = 'architektas'
const TEST_SPRINTCODE = 'WD-1.1'

const fakeCompletion = (
  overrides: Partial<Insertable<Completion>> = {}
): Insertable<Completion> => ({
  sprintCode: TEST_SPRINTCODE,
  username: TEST_USER,
  ...overrides,
})

const completionMatcher = (
  overrides: Partial<Insertable<Completion>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeCompletion(overrides),
})

describe('POST', () => {
  it('should allow creating new completion record', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeCompletion())
      .expect(201)

    expect(body).toEqual(completionMatcher())
  })
  it('persists the new completion', async () => {
    await supertest(app).post('/messages').send(fakeCompletion()).expect(201)

    await expect(selectCompletions()).resolves.toEqual([completionMatcher()])
  })

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        ...fakeCompletion(),
        id: 123456,
      })

    expect(body.id).not.toEqual(123456)
  })
})
