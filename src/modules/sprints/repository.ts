import type { Database } from '@/database'
import { keys } from './schema'
import { Params } from './types/sprint-repository.types'
import { RowInsert, RowSelect, RowUpdate } from './types/sprint.types'
import { DuplicateSprintCodeError, IdOrCodeMissingError } from './errors'

const TABLE = 'sprint'

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    const existing = await db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintCode', '=', record.sprintCode)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateSprintCodeError(record.sprintCode)
    }

    const created = await db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()

    return created
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
      throw new IdOrCodeMissingError()
    }

    return query.executeTakeFirst()
  },

  removeByIdOrSprintCode(params: Params) {
    let query = db.deleteFrom(TABLE).returning(keys)

    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprintCode !== undefined) {
      query = query.where('sprintCode', '=', params.sprintCode)
    }

    if (!params.id && !params.sprintCode) {
      throw new IdOrCodeMissingError()
    }

    return query.executeTakeFirst()
  },
})
