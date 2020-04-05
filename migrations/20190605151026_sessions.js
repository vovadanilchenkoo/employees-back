exports.up = knex => {
  return knex.schema
    .createTable('sessions', table => {
      table.increments()
      table.uuid('id', 36).unsigned().primary().notNull().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('refreshToken', 36).notNull()
      table.string('ua', 200)
      table.string('fingerprint', 200)
      table.string('ip', 15).notNull()

      table.bigInteger('expires_in').notNull()
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => knex.schema.dropTable('sessions')
