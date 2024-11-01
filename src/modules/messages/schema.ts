import { Message } from '@/database'
import { z } from 'zod'

const schema = z.object({
  messageId: z.coerce.number().int().positive(),
  sprintCode: z.string().min(6, { message: 'Too short' }),
  username: z.string().min(1),
  message: z.string().min(1),
})

const insertable = schema.omit({ messageId: true, message: true })

export const parseId = (id: unknown) => schema.shape.messageId.parse(id)
export const parseUsername = (username: unknown) =>
  schema.shape.username.parse(username)
export const parse = (record: unknown) => schema.parse(record)
export const parseSprintCode = (sprintCode: unknown) =>
  schema.shape.sprintCode.parse(sprintCode)
export const parseInsertable = (record: unknown) => insertable.parse(record)

export const keys: (keyof Message)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
