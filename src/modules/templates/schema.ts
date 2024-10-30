import { Template } from '@/database'
import { z } from 'zod'

const schema = z.object({
  id: z.coerce.number().int().positive(),
  template: z.string().min(1),
})

const insertable = schema.omit({ id: true })
const updatable = insertable.partial()

export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parse = (record: unknown) => schema.parse(record)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updatable.parse(record)

export const keys: (keyof Template)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
