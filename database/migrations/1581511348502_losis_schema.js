'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LosisSchema extends Schema {
  up () {
    this.create('loses', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.integer('start').unsigned()
      table.integer('end').unsigned()
      table.integer('sell').unsigned()
      table.integer('entry').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('loses')
  }
}

module.exports = LosisSchema
