import createTestDatabase from '@tests/utils/createTestDatabase'
import buildRepository from '../repository'
import { createFor, selectAllFor } from '@tests/utils/record'
import { fakeSprint, sprintMatcher } from './utils'
import { IdOrCodeMissingError } from '../errors'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createSprints = createFor(db, 'sprint')
const selectSprints = selectAllFor(db, 'sprint')

afterAll(() => db.destroy)

afterEach(async () => {
  await db.deleteFrom('sprint').execute()
})

describe('create', () => {
  it('should create a sprint (listing all fields)', async () => {
    const sprint = await repository.create({
      sprintCode: 'WD-7.7',
      title: 'Expert Frontend Course',
    })

    expect(sprint).toEqual({
      id: expect.any(Number),
      sprintCode: 'WD-7.7',
      title: 'Expert Frontend Course',
    })

    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })

  it('should create a sprint(with fake data functions)', async () => {
    const sprint = await repository.create(fakeSprint())

    expect(sprint).toEqual(sprintMatcher())

    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })
})

describe('findAll', () => {
  it('should return all sprints', async () => {
    await createSprints([
      fakeSprint({
        sprintCode: 'WD-1.1',
        title: 'Intro to WEB',
      }),
      fakeSprint({
        sprintCode: 'WD-1.2',
        title: '102 Internet',
      }),
    ])

    const sprints = await repository.findAll()

    expect(sprints).toHaveLength(2)
    expect(sprints[0]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-1.1',
        title: 'Intro to WEB',
      })
    )
    expect(sprints[1]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-1.2',
        title: '102 Internet',
      })
    )
  })
})

describe('findById', () => {
  it('should return a sprint by id', async () => {
    const [sprint] = await createSprints(fakeSprint({ id: 101 }))

    const foundSprint = await repository.findByIdOrSprintCode({
      id: sprint!.id,
    })

    expect(foundSprint).toEqual(sprintMatcher())
  })
})

describe('update', () => {
  it('should update a sprint', async () => {
    const [sprint] = await createSprints(fakeSprint())

    const updatedSprint = await repository.updateByIdOrSprintCode(
      { id: sprint.id },
      {
        title: 'Updated sprint',
      }
    )

    expect(updatedSprint).toMatchObject(
      sprintMatcher({ title: 'Updated sprint' })
    )
  })

  it('should return the original sprint if no changes are made', async () => {
    const [sprint] = await createSprints(fakeSprint())
    const updatedSprint = await repository.updateByIdOrSprintCode(
      { id: sprint.id },
      {}
    )

    expect(updatedSprint).toMatchObject(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    const updatedSprint = await repository.updateByIdOrSprintCode(
      { id: 999 },
      {
        title: 'Updated sprint',
      }
    )

    expect(updatedSprint).toBeUndefined()
  })

  it('should throw an error when sprintCode and id are both falsy', () => {
    expect(() => {
      repository.updateByIdOrSprintCode(
        { sprintCode: undefined, id: undefined },
        { title: 'some update data' }
      )
    }).toThrow(IdOrCodeMissingError)
  })
})

describe('remove', () => {
  it('should remove a sprint', async () => {
    const [sprint] = await createSprints(fakeSprint())

    const removedSprint = await repository.removeByIdOrSprintCode({
      id: sprint.id,
    })

    expect(removedSprint).toEqual(sprintMatcher())
  })

  it('should return undefined if article is not found', async () => {
    const removedSprint = await repository.removeByIdOrSprintCode({ id: 999 })

    expect(removedSprint).toBeUndefined()
  })

  it('should throw an error when sprintCode and id are both falsy', () => {
    expect(() => {
      repository.removeByIdOrSprintCode({
        sprintCode: undefined,
        id: undefined,
      })
    }).toThrow(IdOrCodeMissingError)
  })
})
