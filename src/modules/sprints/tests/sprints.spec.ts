import createApp from '@/app'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/record'
import supertest from 'supertest'
import { fakeSprint, sprintMatcher } from './utils'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()

const createSprints = createFor(db, 'sprint')

afterEach(async () => {
  await db.deleteFrom('sprint').execute()
})
afterAll(() => db.destroy())

const ADDITIONAL_FAKE_SPRINT = {
  sprintCode: 'WD-5.6',
  title: 'Another Advanced Course',
}

const FAKE_SPRINT_WITH_ID = { id: 100 }

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing sprints', async () => {
    await createSprints([fakeSprint(), fakeSprint(ADDITIONAL_FAKE_SPRINT)])

    const { body } = await supertest(app).get('/articles').expect(200)

    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher(ADDITIONAL_FAKE_SPRINT),
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).get('/sprints/123').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return a sprint if it exists', async () => {
    const { body } = await supertest(app).get('/sprints/100').expect(200)

    expect(body).toEqual(sprintMatcher(FAKE_SPRINT_WITH_ID))
  })
})

describe('PATCH /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/123456')
      .send(fakeSprint())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 123
    await createSprints([fakeSprint({ id })])

    const { body } = await supertest(app)
      .patch(`/sprints/${id}`)
      .send({ title: 'Updated!' })
      .expect(200)

    expect(body).toEqual(
      sprintMatcher({
        id,
        title: 'Updated!',
      })
    )
  })

  it('persists changes', async () => {
    const id = 123
    await createSprints([fakeSprint({ id })])

    await supertest(app)
      .patch(`/sprints/${id}`)
      .send({ sprintCode: 'Persisted!', title: 'This too!' })
      .expect(200)

    const { body } = await supertest(app).get('/sprints/123').expect(200)

    expect(body).toEqual(
      sprintMatcher({
        id,
        sprintCode: 'Persisted!',
        title: 'This too!',
      })
    )
  })
})

describe('DELETE', () => {
  it('supports deleting the sprint', async () => {
    await supertest(app).delete('/sprints/100').expect(200)
  })
})
