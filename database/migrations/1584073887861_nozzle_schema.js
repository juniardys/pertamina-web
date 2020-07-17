'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NozzleSchema extends Schema {
  up () {
    this.create('nozzles', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('island_uuid').references('uuid').inTable('islands').onDelete('cascade').notNullable()
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.string('name').notNullable()
      table.string('code').notNullable()
      table.double('start_meter').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('nozzles')
  }
}

module.exports = NozzleSchema
