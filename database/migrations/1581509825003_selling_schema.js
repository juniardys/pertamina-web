'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellingSchema extends Schema {
  up () {
    this.create('sellings', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.uuid('sub_product_uuid').references('uuid').inTable('sub_products').onDelete('cascade')
      table.integer('start').unsigned().defaultTo(0)
      table.integer('end').unsigned().defaultTo(0)
      table.string('tera').nullable() // Unknown Table
      table.integer('liter').unsigned().defaultTo(0)
      table.enu('shift', [1, 2, 3])
      table.timestamps()
    })
  }

  down () {
    this.drop('sellings')
  }
}

module.exports = SellingSchema
