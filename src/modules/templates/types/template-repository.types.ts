import { RowInsert, RowSelect, RowUpdate } from './template.types'

export type TemplateRepository = {
  findAll(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findById(id: number): Promise<RowSelect | undefined>
  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined>
  remove(id: number): Promise<RowSelect | undefined>
}
