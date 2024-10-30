import { Template } from '@/database'
import { Insertable } from 'kysely'

export const fakeTemplate = (
  overrides: Partial<Insertable<Template>> = {}
): Insertable<Template> => ({
  template: 'user completed the course. Big wow!',
  ...overrides,
})

export const fakeTemplateFull = (
  overrides: Partial<Insertable<Template>> = {}
) => ({
  id: 2,
  ...fakeTemplate(overrides),
})

export const templateMatcher = (
  overrides: Partial<Insertable<Template>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeTemplate(overrides),
})
