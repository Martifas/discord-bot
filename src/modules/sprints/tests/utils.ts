import { Sprint } from '@/database'
import { Insertable } from 'kysely'

export const fakeSprint = (
  overrides: Partial<Insertable<Sprint>> = {}
): Insertable<Sprint> => ({
  sprintCode: 'WD-5.5',
  title: 'Advanced Frontend Course',
  ...overrides,
})

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprint>> = {}
) => ({
  id: 2,
  ...fakeSprint(overrides),
})

export const sprintMatcher = (overrides: Partial<Insertable<Sprint>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeSprint(overrides),
})
