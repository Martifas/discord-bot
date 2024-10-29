import type { Database } from '@/database'
import type { Sprint } from '@/database'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { keys } from './schema'

const TABLE = 'sprint'
type Row = Sprint
type RowWithoutId = Omit<Row, 'id'>
type RowSelect = Selectable<Row>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type Params = {
  id?: number
  sprintCode?: string
}

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },

  findByIdOrSprintCode(params: Params): Promise<RowSelect | undefined> {
    let query = db.selectFrom(TABLE).select(keys)

    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprintCode !== undefined) {
      query = query.where('sprintCode', '=', params.sprintCode)
    }

    return query.executeTakeFirst()
  },

  updateByIdOrSprintCode(
    params: Params,
    partial: RowUpdate
  ): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findByIdOrSprintCode(params)
    }

    let query = db.updateTable(TABLE).set(partial).returning(keys)

    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprintCode !== undefined) {
      query = query.where('sprintCode', '=', params.sprintCode)
    }

    if (!params.id && !params.sprintCode) {
      throw new Error('Either id or sprintCode must be provided for update')
    }

    return query.executeTakeFirst()
  },

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },
})
