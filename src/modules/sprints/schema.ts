import { Sprint } from '@/database'
import { z } from 'zod'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintCode: z.string().min(6, { message: 'Too short' }),
  title: z.string().min(1),
})

const insertable = schema.omit({ id: true })
const updatable = insertable.partial()

export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseSprintCode = (sprintCode: unknown) =>
  schema.shape.sprintCode.parse(sprintCode)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updatable.parse(record)

export const keys: (keyof Sprint)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
