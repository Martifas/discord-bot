import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor, selectAllFor } from '@tests/utils/record'
import { fakeTemplate, templateMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createTemplates = createFor(db, 'template')
const selectTemplates = selectAllFor(db, 'template')

afterAll(() => db.destroy)

afterEach(async () => {
  await db.deleteFrom('template').execute()
})

describe('create', () => {
  it('should create a template', async () => {
    const template = await repository.create(fakeTemplate())

    expect(template).toEqual(templateMatcher(fakeTemplate()))

    const templatesInDatabase = await selectTemplates()
    expect(templatesInDatabase).toEqual([template])
  })
})

describe('findAll', () => {
  it('should return all templates', async () => {
    await createTemplates([
      fakeTemplate({
        template: 'BRAVO! BRAVO! BRAVO!',
      }),
      fakeTemplate({ template: 'Congratz!' }),
    ])

    const templates = await repository.findAll()

    expect(templates).toHaveLength(2)
    expect(templates[0]).toEqual(
      templateMatcher({
        template: 'BRAVO! BRAVO! BRAVO!',
      })
    )
    expect(templates[1]).toEqual(
      templateMatcher({
        template: 'Congratz!',
      })
    )
  })
})

describe('findById', () => {
  it('should return a template by id', async () => {
    const [template] = await createTemplates(fakeTemplate({ id: 101 }))
    const foundTemplate = await repository.findById(template!.id)

    expect(foundTemplate).toEqual(templateMatcher())
  })
})

describe('update', () => {
  it('should update a template', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const updatedTemplate = await repository.update(template.id, {
      template: 'Updated template',
    })

    expect(updatedTemplate).toMatchObject(
      templateMatcher({ template: 'Updated template' })
    )
  })

  it('should return the original template if no changes are made', async () => {
    const [template] = await createTemplates(fakeTemplate())
    const updatedTemplate = await repository.update(template.id, {})

    expect(updatedTemplate).toMatchObject(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    const id = 999
    const updatedTemplate = await repository.update(id, {
      template: 'Updated sprint',
    })

    expect(updatedTemplate).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove a template', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const removedTemplate = await repository.remove(template.id)

    expect(removedTemplate).toEqual(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    const id = 999
    const removedTemplate = await repository.remove(id)

    expect(removedTemplate).toBeUndefined()
  })
})
