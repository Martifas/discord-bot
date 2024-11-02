import createApp from '@/app'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/record'
import supertest from 'supertest'
import { fakeSprint, sprintMatcher } from './utils'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const createSprints = createFor(db, 'sprint')
const selectSprints = selectAllFor(db, 'sprint')

afterEach(async () => {
  await db.deleteFrom('sprint').execute()
})
afterAll(() => db.destroy())

const FAKE_SPRINT = fakeSprint()
const FAKE_SPRINT_CODE = FAKE_SPRINT.sprintCode

describe('POST', () => {
  it('should allow creating new sprint record', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint())
      .expect(201)

    expect(body).toEqual(sprintMatcher())
  })

  it('should persist the new sprint', async () => {
    await supertest(app).post('/sprints').send(fakeSprint()).expect(201)
    await expect(selectSprints()).resolves.toEqual([sprintMatcher()])
  })

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send({
        ...fakeSprint(),
        id: 123456,
      })

    expect(body.id).not.toEqual(123456)
  })

  it('should not allow creating sprint record if same sprintcode exits', async () => {
    await createSprints([fakeSprint()])
    await supertest(app).post('/sprints').send(fakeSprint()).expect(409)
  })
})

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toEqual([])
  })

  it('should return a list of existing sprints', async () => {
    await createSprints([
      fakeSprint(),
      fakeSprint({ sprintCode: 'WD-6.6', title: 'Another Advanced Course' }),
    ])

    const { body } = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({ sprintCode: 'WD-6.6', title: 'Another Advanced Course' }),
    ])
  })
})

describe('GET with query parameters', () => {
  describe('?id=:id', () => {
    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app).get('/sprints?id=123').expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('should return a sprint if it exists', async () => {
      const [sprint] = await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .get(`/sprints?id=${sprint.id}`)
        .expect(200)
      expect(body).toEqual(sprintMatcher(fakeSprint()))
    })
  })

  describe('?sprint=:sprintcode', () => {
    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app)
        .get(`/sprints?sprint=WD-9.9`)
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('should return a sprint if it exists', async () => {
      const [sprint] = await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .get(`/sprints?sprint=${sprint.sprintCode}`)
        .expect(200)
      expect(body).toEqual(sprintMatcher(fakeSprint()))
    })
  })
})

describe('PATCH', () => {
  describe('?id=:id', () => {
    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app)
        .patch('/sprints?id=123456')
        .send(fakeSprint())
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('allows partial updates', async () => {
      const id = 123
      await createSprints([fakeSprint({ id })])
      const { body } = await supertest(app)
        .patch(`/sprints?id=${id}`)
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
        .patch(`/sprints?id=${id}`)
        .send({ sprintCode: 'Persisted!', title: 'This too!' })
        .expect(200)

      const { body } = await supertest(app).get(`/sprints?id=${id}`).expect(200)

      expect(body).toEqual(
        sprintMatcher({
          id,
          sprintCode: 'PERSISTED!',
          title: 'This too!',
        })
      )
    })
  })

  describe('?sprint=:sprintcode', () => {
    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app)
        .patch(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .send(fakeSprint())
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('allows partial updates', async () => {
      await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .patch(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .send({ title: 'Updated!' })
        .expect(200)

      expect(body).toEqual(
        sprintMatcher({
          sprintCode: FAKE_SPRINT_CODE,
          title: 'Updated!',
        })
      )
    })

    it('persists changes', async () => {
      await createSprints([fakeSprint()])
      await supertest(app)
        .patch(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .send({ title: 'It persists!' })
        .expect(200)

      const { body } = await supertest(app)
        .get(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .expect(200)

      expect(body).toEqual(
        sprintMatcher({
          sprintCode: FAKE_SPRINT_CODE,
          title: 'It persists!',
        })
      )
    })

    it('should not allow updating sprint code itself', async () => {
      await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .patch(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .send({ sprintCode: 'NEW-CODE' })
        .expect(400)

      expect(body.error.message).toMatch(/cannot update sprint/i)
    })
  })
})

describe('DELETE', () => {
  describe('?id=:id', () => {
    it('supports deleting the sprint', async () => {
      const [sprint] = await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .delete(`/sprints?id=${sprint.id}`)
        .expect(200)

      expect(body).toEqual(sprint)
    })

    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app)
        .delete('/sprints?id=123')
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })
  })

  describe('?sprintcode=:sprintcode', () => {
    it('should successfully delete an existing sprint', async () => {
      const [sprint] = await createSprints([fakeSprint()])
      const { body } = await supertest(app)
        .delete(`/sprints?sprint=${sprint.sprintCode}`)
        .expect(200)

      expect(body).toEqual(sprintMatcher(FAKE_SPRINT))
      await supertest(app)
        .get(`/sprints?sprint=${sprint.sprintCode}`)
        .expect(404)
    })

    it('should return 404 if sprint does not exist', async () => {
      const { body } = await supertest(app)
        .delete(`/sprints?sprint=${FAKE_SPRINT_CODE}`)
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })
  })
})
