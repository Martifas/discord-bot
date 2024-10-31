import { Message } from '@/database'
import { Insertable, Selectable } from 'kysely'

export type Row = Message
export type RowWithoutId = Omit<Row, 'messageId'>
export type RowWithoutIdAndMessage = Omit<RowWithoutId, 'message'>
export type RowSelect = Selectable<Row>
export type RowInsert = Insertable<RowWithoutIdAndMessage>
