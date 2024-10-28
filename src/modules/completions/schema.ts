import { z } from 'zod'

const schema = z.object({
  id: z
    .number()
    .int({ message: 'ID must be an integer' })
    .positive({ message: 'ID must be positive number' }),
  username: z.string().min(1, { message: 'User must be non-empty string' }),
  sprintCode: z
    .string()
    .min(1, { message: 'Sprint code must be non-empty string' }),
})

const insertable = schema.omit({ id: true })

export const parseInsertable = (record: unknown) => insertable.parse(record)
