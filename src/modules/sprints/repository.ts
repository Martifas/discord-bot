import type { Database } from '@/database'
import { keys } from './schema'
import { Params } from './types/sprint-repository.types'
import { RowInsert, RowSelect, RowUpdate } from './types/sprint.types'
import { DuplicateSprintCodeError, IdOrCodeMissingError } from './errors/errors'

const TABLE = 'sprint'

const capitalizeRecord = (record: RowInsert): RowInsert => {
  return {
    ...record,
    sprintCode: record.sprintCode.toUpperCase(),
  }
}
export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    const capitalizedRecord = capitalizeRecord(record)

    const existing = await db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintCode', '=', capitalizedRecord.sprintCode)
      .executeTakeFirst()

    if (existing) {
      throw new DuplicateSprintCodeError(capitalizedRecord.sprintCode)
    }

    const created = await db
      .insertInto(TABLE)
      .values(capitalizedRecord)
      .returning(keys)
      .executeTakeFirst()

    return created
  },

  findBy(params: Params): Promise<RowSelect | undefined> {
    let query = db.selectFrom(TABLE).select(keys)
    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprint !== undefined) {
      query = query.where('sprintCode', '=', params.sprint.toUpperCase())
    }
    return query.executeTakeFirst()
  },

  updateBy(params: Params, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findBy(params)
    }

    const capitalizedPartial: RowUpdate = {
      ...partial,
      ...(partial.sprintCode && {
        sprintCode: partial.sprintCode.toUpperCase(),
      }),
    }

    let query = db.updateTable(TABLE).set(capitalizedPartial).returning(keys)
    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprint !== undefined) {
      query = query.where('sprintCode', '=', params.sprint.toUpperCase())
    }
    if (!params.id && !params.sprint) {
      throw new IdOrCodeMissingError()
    }
    return query.executeTakeFirst()
  },

  removeBy(params: Params) {
    let query = db.deleteFrom(TABLE).returning(keys)
    if (params.id !== undefined) {
      query = query.where('id', '=', params.id)
    }
    if (params.sprint !== undefined) {
      query = query.where('sprintCode', '=', params.sprint.toUpperCase())
    }
    if (!params.id && !params.sprint) {
      throw new IdOrCodeMissingError()
    }
    return query.executeTakeFirst()
  },
})
