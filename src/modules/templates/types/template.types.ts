import { Template } from '@/database'
import { Insertable, Selectable, Updateable } from 'kysely'

export type Row = Template
export type RowWithoutId = Omit<Row, 'id'>
export type RowSelect = Selectable<Row>
export type RowInsert = Insertable<RowWithoutId>
export type RowUpdate = Updateable<RowWithoutId>
