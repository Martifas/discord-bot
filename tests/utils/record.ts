import type { ExpressionOrFactory, Kysely, SqlBool } from 'kysely'
import { DB } from '@/database'

type HelperType<N extends keyof DB> = { [P in N]: DB[P] }

export const selectAllFor =
  <N extends keyof DB, T extends HelperType<N>>(db: Kysely<T>, tableName: N) =>
  (expression?: ExpressionOrFactory<DB, N, SqlBool>) => {
    const query = db.selectFrom(tableName).selectAll()

    return expression
      ? query.where(expression as any).execute()
      : query.execute()
  }
