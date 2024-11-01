import { Database } from '@/database'
import { TemplateNotFound } from '../templates/errors/errors'
import { TemplateFailedFetch } from './errors/errors'

export default async function compileMessage(
  db: Database,
  username: string,
  course: string
): Promise<string> {
  try {
    const result = await db
      .selectFrom('template')
      .select((eb) => eb.fn.count('id').as('count'))
      .executeTakeFirst()

    const count = Number(result?.count ?? 0)
    if (count === 0) {
      throw new TemplateNotFound()
    }

    const randomId = Math.floor(Math.random() * count) + 1

    const template = await db
      .selectFrom('template')
      .select(['template'])
      .where('id', '=', randomId)
      .executeTakeFirst()

    if (!template) {
      throw new TemplateFailedFetch()
    }

    return template.template
      .replace(/{name}/g, username)
      .replace(/{sprintTitle}/g, course)
  } catch (error) {
    console.error('Error fetching random template:', error)
    throw error
  }
}
