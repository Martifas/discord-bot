import createApp from '@/app'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/record'
import supertest from 'supertest'
import { fakeMessage } from './utils'

const db = await createTestDatabase()
const app = await (async () => await createApp(db))()
const createMessages = createFor(db, 'message')
const createSprints = createFor(db, 'sprint')
const createTemplates = createFor(db, 'template')

afterEach(async () => {
  await db.deleteFrom('message').execute()
})
afterAll(() => db.destroy())

describe('GET', () => {
  describe('without query parameters', () => {
    it('should return an empty array when there are no messages', async () => {
      const { body } = await supertest(app).get('/messages').expect(200)
      expect(body).toEqual([])
    })

    it('should return a list of existing messages', async () => {
      await createMessages([
        fakeMessage(),
        {
          messageId: 333,
          username: 'turingas',
          sprintCode: 'WD-8.8',
          message: 'turingas has just completed pro Course',
        },
      ])

      const { body } = await supertest(app).get('/messages').expect(200)

      expect(body).toEqual([
        fakeMessage(),
        {
          messageId: 333,
          username: 'turingas',
          sprintCode: 'WD-8.8',
          message: 'turingas has just completed pro Course',
        },
      ])
    })
  })
  describe('?code=:sprintCode', () => {
    it('should return 404 if message does not exist', async () => {
      const { body } = await supertest(app)
        .get('/messages?code=WD-8.8')
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('should return a message if it exists', async () => {
      const [template] = await createMessages([fakeMessage()])
      const { body } = await supertest(app)
        .get(`/messages?id=${template.sprintCode}`)
        .expect(200)

      expect(body).toEqual([fakeMessage()])
    })
  })
  describe('?username=:username', () => {
    it('should return 404 if message does not exist', async () => {
      const { body } = await supertest(app)
        .get('/messages?username=turingas')
        .expect(404)
      expect(body.error.message).toMatch(/not found/i)
    })

    it('should return a message if it exists', async () => {
      const [template] = await createMessages([fakeMessage()])
      const { body } = await supertest(app)
        .get(`/messages?username=${template.username}`)
        .expect(200)

      expect(body).toEqual([fakeMessage()])
    })
  })
})
describe('POST', () => {
  it('should allow creating new message', async () => {
    await createSprints({
      sprintCode: 'WD-7.7',
      title: 'Test Sprint',
    })
    await createTemplates({
      template:
        '🚀 Houston, we have success! {name} has conquered {sprintTitle} with flying colors!',
    })

    const { body } = await supertest(app)
      .post('/messages')
      .send({ sprintCode: 'WD-7.7', username: 'testauskas' })
      .expect(201)

    expect(body).toEqual({
      sprintCode: 'WD-7.7',
      username: 'testauskas',
      messageId: expect.any(Number),
      message:
        '🚀 Houston, we have success! testauskas has conquered Test Sprint with flying colors!',
    })
  })

  it('should not allow creating template if same template exits', async () => {
    await createMessages([fakeMessage()])
    await supertest(app).post('/messages').send(fakeMessage()).expect(409)
  })
})
describe('PATCH', () => {
  it('should not support patching messages', async () => {
    await supertest(app).patch('/messages').expect(405)
  })
  it('should not support patching messages by username', async () => {
    await supertest(app)
      .patch('/messages?username=testauskas')
      .send(fakeMessage())
      .expect(405)
  })
  it('should not support patching messages by sprintcode', async () => {
    await supertest(app)
      .patch('/messages?code=1.3')
      .send(fakeMessage())
      .expect(405)
  })
})
describe('DELETE', () => {
  it('should not support deleting messages', async () => {
    await supertest(app).delete('/messages').expect(405)
  })
  it('should not support patching messages by username', async () => {
    await supertest(app)
      .delete('/messages?username=testauskas')
      .send(fakeMessage())
      .expect(405)
  })
  it('should not support patching messages by sprintcode', async () => {
    await supertest(app)
      .delete('/messages?code=1.3')
      .send(fakeMessage())
      .expect(405)
  })
})
