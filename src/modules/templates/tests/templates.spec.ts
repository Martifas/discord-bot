import createApp from '@/app'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor, selectAllFor } from '@tests/utils/record'
import supertest from 'supertest'
import { fakeTemplate, templateMatcher } from './utils'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const createTemplates = createFor(db, 'template')
const selectTemplates = selectAllFor(db, 'template')

afterEach(async () => {
  await db.deleteFrom('template').execute()
})
afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing templates', async () => {
    await createTemplates([
      fakeTemplate(),
      fakeTemplate({ template: 'Another Template' }),
    ])

    const { body } = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({ template: 'Another Template' }),
    ])
  })
})

describe('POST', () => {
  it('should allow creating new template', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate())
      .expect(201)

    expect(body).toEqual(templateMatcher())
  })
  it('should persist the new template', async () => {
    await supertest(app).post('/templates').send(fakeTemplate()).expect(201)

    await expect(selectTemplates()).resolves.toEqual([templateMatcher()])
  })

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/template')
      .send({
        ...fakeTemplate(),
        id: 123456,
      })

    expect(body.id).not.toEqual(123456)
  })
  it('should not allow creating template if same template exits', async () => {
    await createTemplates([fakeTemplate()])

    await supertest(app).post('/templates').send(fakeTemplate()).expect(409)
  })
})

describe('PATCH', () => {
  it('should not support patching', async () => {
    await supertest(app).patch('/templates').expect(405)
  })
})

describe('DELETE', () => {
  it('should not support deleting', async () => {
    await supertest(app).delete('/templates').expect(405)
  })
})

describe('GET /id/:id', () => {
  it('should return 404 if tempalte does not exist', async () => {
    const { body } = await supertest(app).get('/templates/id/123').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return a template if it exists', async () => {
    const [template] = await createTemplates([fakeTemplate()])

    const { body } = await supertest(app)
      .get(`/templates/id/${template.id}`)
      .expect(200)

    expect(body).toEqual(templateMatcher(fakeTemplate()))
  })
})

describe('POST /id/:id', () => {
  it('should not support posting with by id', async () => {
    await supertest(app).post('/templates/id/123').expect(405)
  })
})

describe('PATCH /id/:id', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/templates/id/123456')
      .send(fakeTemplate())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('persists changes', async () => {
    const id = 123
    await createTemplates([fakeTemplate({ id })])

    await supertest(app)
      .patch(`/templates/id/${id}`)
      .send({ template: 'It persists!' })
      .expect(200)

    const { body } = await supertest(app).get('/templates/id/123').expect(200)

    expect(body).toEqual(
      templateMatcher({
        id,
        template: 'It persists!',
      })
    )
  })
})

describe('DELETE /id/:id', () => {
  it('supports deleting the template', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const { body } = await supertest(app)
      .delete(`/templates/id/${template.id}`)
      .expect(200)

    expect(body).toEqual(template)
  })

  it('should return 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).get('/templates/id/123').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })
})
