import { Message } from '@/database'
import { Insertable, Selectable } from 'kysely'

export type Row = Message
export type RowWithoutId = Omit<Row, 'id'>
export type RowSelect = Selectable<Row>
export type RowInsert = Insertable<RowWithoutId>
