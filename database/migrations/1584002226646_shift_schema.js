'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShiftSchema extends Schema {
  up () {
    this.create('shifts', (table) => {
      table.increments()
      table.uuid('uuid')
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.string('name')
      // table.text('description').nullable()
      table.time('start')
      table.time('end')
      table.timestamps()
    })
  }

  down () {
    this.drop('shifts')
  }
}

module.exports = ShiftSchema
