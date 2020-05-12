'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeederTankSchema extends Schema {
  up () {
    this.create('feeder_tanks', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.string('name').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('feeder_tanks')
  }
}

module.exports = FeederTankSchema
