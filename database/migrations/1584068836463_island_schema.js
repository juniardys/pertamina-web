'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IslandSchema extends Schema {
  up () {
    this.create('islands', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.string('name').notNullable()
      table.string('code').unique().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('islands')
  }
}

module.exports = IslandSchema
