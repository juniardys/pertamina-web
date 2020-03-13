'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NozzleSchema extends Schema {
  up () {
    this.create('nozzles', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('island_uuid').references('uuid').inTable('islands').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.string('name')
      table.string('code').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('nozzles')
  }
}

module.exports = NozzleSchema
