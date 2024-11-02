import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/record'
import compileMessage from '../messageCompiler/messageCompiler'
import { TemplateNotFound } from '@/modules/templates/errors/errors'

const db = await createTestDatabase()
const createTemplates = createFor(db, 'template')

afterAll(() => db.destroy)
afterEach(async () => {
  await db.deleteFrom('template').execute()
})

describe('compileMessage', () => {
  it('should throw TemplateNotFound if there are no templates in the database', async () => {
    await expect(
      compileMessage(db, 'Alice', 'JavaScript Basics')
    ).rejects.toThrow(TemplateNotFound)
  })

  it('should return a compiled message when a template is found', async () => {
    await createTemplates({
      id: 1,
      template: 'Hello, {name}! Welcome to {sprintTitle}.',
    })
    const message = await compileMessage(db, 'Alice', 'JavaScript Basics')
    expect(message).toBe('Hello, Alice! Welcome to JavaScript Basics.')
  })

  it('should handle multiple templates and select one randomly', async () => {
    await createTemplates([
      {
        id: 1,
        template: 'Template 1: {name} is learning {sprintTitle}',
      },
      {
        id: 2,
        template: 'Template 2: Welcome {name} to {sprintTitle}',
      },
    ])

    const message = await compileMessage(db, 'Bob', 'Python')
    expect(message).toMatch(/^Template [12]:/)
    expect(message).toContain('Bob')
    expect(message).toContain('Python')
  })

  it('should handle templates with multiple occurrences of placeholders', async () => {
    await createTemplates({
      id: 1,
      template:
        'Hey {name}! {name} is now studying {sprintTitle}. Good luck with {sprintTitle}!',
    })

    const message = await compileMessage(db, 'Carol', 'React')
    expect(message).toBe(
      'Hey Carol! Carol is now studying React. Good luck with React!'
    )
  })

  it('should handle special characters in template placeholders', async () => {
    await createTemplates({
      id: 1,
      template: 'Welcome {name}! Start learning {sprintTitle}!',
    })

    const message = await compileMessage(db, "O'Connor", 'C++ & JavaScript')
    expect(message).toBe("Welcome O'Connor! Start learning C++ & JavaScript!")
  })

  it('should handle empty strings as parameters', async () => {
    await createTemplates({
      id: 1,
      template: 'Message: {name} - {sprintTitle}',
    })

    const message = await compileMessage(db, '', '')
    expect(message).toBe('Message:  - ')
  })
})
