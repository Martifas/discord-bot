import { RowInsert, RowSelect, RowUpdate } from './sprint.types'

export type SprintRepository = {
  findAll(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findByIdOrSprintCode(params: Params): Promise<RowSelect | undefined>
  updateByIdOrSprintCode(
    params: Params,
    partial: RowUpdate
  ): Promise<RowSelect | undefined>
  removeByIdOrSprintCode(params: Params): Promise<RowSelect | undefined>
}

export type Params = {
  id?: number
  sprintCode?: string
}
