exports.up = knex => {
  return knex.schema
    .createTable('emplooyees', table => {
      table.increments()
      table.uuid('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('name', 20).notNull()
      table.string('position', 5000)
      table.string('salary', 5000)
      table.string('start_working_at', 5000)
      table.string('work_days', 5000)
      table.string('out_days', 5000)
      table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_date').defaultTo(knex.fn.now()).notNull()
      table.timestamp('modified_date').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => knex.schema.dropTable('emplooyees')
