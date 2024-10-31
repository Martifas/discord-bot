import { RowInsert, RowSelect } from './messages.types'

export type MessageRepository = {
  findAll(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<createResults>
  findBy(params: Params): Promise<RowSelect | undefined>
}

export type Params = {
  username?: string
  sprintCode?: string
}

export type createResults = {
  result: RowSelect | undefined
  message: string
}
