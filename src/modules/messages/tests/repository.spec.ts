import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor, selectAllFor } from '@tests/utils/record'
import { fakeMessage } from './utils'
import { CourseNotFound, DuplicateRecordError } from '../errors/errors'

const db = await createTestDatabase()
const repository = await buildRepository(db)
const createMessages = createFor(db, 'message')
const selectMessages = selectAllFor(db, 'message')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('message').execute()
  await db.deleteFrom('sprint').execute() // Also clear sprints after each test
})

describe('create', () => {
  it('should create a message', async () => {
    await db
      .insertInto('sprint')
      .values({
        sprintCode: 'WD-7.7',
        title: 'Test Sprint',
      })
      .execute()
    const response = await repository.create({
      sprintCode: 'WD-7.7',
      username: 'architektas',
    })
    expect(response).toEqual({
      result: {
        sprintCode: 'WD-7.7',
        username: 'architektas',
        messageId: expect.any(Number),
        message: '@architektas has just completed Test Sprint!',
      },
      message: '@architektas has just completed Test Sprint!',
    })
    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([response.result])
  })

  it('should throw DuplicateRecordError when creating duplicate message', async () => {
    await db
      .insertInto('sprint')
      .values({
        sprintCode: 'WD-7.7',
        title: 'Test Sprint',
      })
      .execute()

    const messageData = {
      sprintCode: 'WD-7.7',
      username: 'architektas',
    }

    await repository.create(messageData)
    await expect(repository.create(messageData)).rejects.toThrow(
      DuplicateRecordError
    )
  })

  it('should throw CourseNotFound when sprint does not exist', async () => {
    await expect(
      repository.create({
        sprintCode: 'NONEXISTENT',
        username: 'architektas',
      })
    ).rejects.toThrow(CourseNotFound)
  })
})

describe('findAll', () => {
  it('should return all messages', async () => {
    await createMessages([
      fakeMessage(),
      {
        sprintCode: 'WD-1.2',
        username: 'testukas',
        messageId: 2,
        message: 'Message Test',
      },
    ])
    const messages = await repository.findAll()
    expect(messages).toHaveLength(2)
    expect(messages[0]).toEqual(fakeMessage())
    expect(messages[1]).toEqual({
      sprintCode: 'WD-1.2',
      username: 'testukas',
      messageId: 2,
      message: 'Message Test',
    })
  })

  it('should return empty array when no messages exist', async () => {
    const messages = await repository.findAll()
    expect(messages).toEqual([])
  })
})

describe('findBy', () => {
  beforeEach(async () => {
    await db
      .insertInto('sprint')
      .values({
        sprintCode: 'WD-7.7',
        title: 'Test Sprint',
      })
      .execute()

    await createMessages([
      {
        sprintCode: 'WD-7.7',
        username: 'user1',
        messageId: 1,
        message: '@user1 has just completed Test Sprint!',
      },
      {
        sprintCode: 'WD-7.7',
        username: 'user2',
        messageId: 2,
        message: '@user2 has just completed Test Sprint!',
      },
      {
        sprintCode: 'WD-8.8',
        username: 'user1',
        messageId: 3,
        message: '@user1 has just completed Another Sprint!',
      },
    ])
  })

  it('should return messages by username', async () => {
    const messages = await repository.findBy({ username: 'user1' })
    expect(messages).toBeDefined()
    expect(messages).toEqual({
      sprintCode: 'WD-7.7',
      username: 'user1',
      messageId: 1,
      message: '@user1 has just completed Test Sprint!',
    })
  })

  it('should return messages by sprintCode', async () => {
    const messages = await repository.findBy({ sprintCode: 'WD-7.7' })
    expect(messages).toBeDefined()
    expect(messages).toEqual({
      sprintCode: 'WD-7.7',
      username: 'user1',
      messageId: 1,
      message: '@user1 has just completed Test Sprint!',
    })
  })

  it('should return messages by both username and sprintCode', async () => {
    const messages = await repository.findBy({
      username: 'user1',
      sprintCode: 'WD-7.7',
    })
    expect(messages).toBeDefined()
    expect(messages).toEqual({
      sprintCode: 'WD-7.7',
      username: 'user1',
      messageId: 1,
      message: '@user1 has just completed Test Sprint!',
    })
  })

  it('should return undefined when no message matches the criteria', async () => {
    const messages = await repository.findBy({
      username: 'nonexistentuser',
      sprintCode: 'WD-7.7',
    })
    expect(messages).toBeUndefined()
  })

  it('should return undefined when no parameters are provided', async () => {
    const messages = await repository.findBy({})
    expect(messages).toBeDefined()
    expect(messages).toEqual({
      sprintCode: 'WD-7.7',
      username: 'user1',
      messageId: 1,
      message: '@user1 has just completed Test Sprint!',
    })
  })
})
