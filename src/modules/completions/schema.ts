import { Completion } from '@/database'
import { z } from 'zod'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().min(1, { message: 'User must be non-empty string' }),
  sprintCode: z
    .string()
    .min(1, { message: 'Sprint code must be non-empty string' }),
})

const insertable = schema.omit({ id: true })
const updatable = insertable.partial()

export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updatable.parse(record)

export const keys: (keyof Completion)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
