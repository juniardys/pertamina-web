'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IslandSchema extends Schema {
  up () {
    this.create('islands', (table) => {
      table.increments()
      table.uuid('uuid')
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.string('name')
      table.string('code').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('islands')
  }
}

module.exports = IslandSchema
