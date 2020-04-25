exports.up = knex => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', table => {
      table.uuid('id').unsigned().primary().notNull().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('username', 25).unique().notNull()
      table.string('email', 50).unique().notNull()

      table.text('passwordHash').notNull()

      table.timestamp('created_date').defaultTo(knex.fn.now()).notNull()
      table.timestamp('modified_date').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => {
  return knex.schema.dropTable('users').then(() => knex.raw('drop extension if exists "uuid-ossp"'))
}
