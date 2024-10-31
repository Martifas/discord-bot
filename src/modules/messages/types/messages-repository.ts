import { RowInsert, RowSelect } from './messages.types'

export type MessageRepository = {
  findall(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findBy(params: Params): Promise<RowSelect | undefined>
}

export type Params = {
  username?: string
  sprintCode?: string
}
