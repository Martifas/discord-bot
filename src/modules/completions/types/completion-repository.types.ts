import { RowSelect } from './completion.types'

export type CompletionRepository = {
  findAll(): Promise<RowSelect[]>
}
