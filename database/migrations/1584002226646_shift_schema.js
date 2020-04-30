'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShiftSchema extends Schema {
  up () {
    this.create('shifts', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.string('name').notNullable()
      // table.text('description').nullable()
      table.time('start').notNullable()
      table.time('end').notNullable()
      // table.boolean('is_first').default(false) // Custom first shift
      table.integer('no_order').unsigned().nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('shifts')
  }
}

module.exports = ShiftSchema
