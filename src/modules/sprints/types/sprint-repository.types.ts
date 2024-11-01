import { RowInsert, RowSelect, RowUpdate } from './sprint.types'

export type SprintRepository = {
  findAll(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findBy(params: Params): Promise<RowSelect | undefined>
  updateBy(params: Params, partial: RowUpdate): Promise<RowSelect | undefined>
  removeBy(params: Params): Promise<RowSelect | undefined>
}

export type Params = {
  id?: number
  sprintCode?: string
}
