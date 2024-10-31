import { RowInsert, RowSelect, RowUpdate } from './completion.types'

export type CompletionRepository = {
  findAll(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findById(id: number): Promise<RowSelect | undefined>
  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined>
  remove(id: number): Promise<RowSelect | undefined>
}
