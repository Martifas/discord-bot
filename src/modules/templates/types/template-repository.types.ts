import { RowInsert, RowSelect } from './template.types'

export type templateRepository = {
  findall(): Promise<RowSelect[]>
  create(record: RowInsert): Promise<RowSelect | undefined>
  findById(id: number): Promise<RowSelect | undefined>
  update(id: number): Promise<RowSelect | undefined>
  remove(id: number): Promise<RowSelect | undefined>
}
