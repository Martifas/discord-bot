import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('message')
    .addColumn('message_id', 'integer', (c) =>
      c.primaryKey().notNull().references('completion.id').onDelete('cascade')
    )
    .addColumn('message', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('message').execute()
}
