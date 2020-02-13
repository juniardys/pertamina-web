'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductOrderSchema extends Schema {
  up () {
    this.create('product_orders', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.string('no_mobile')
      table.datetime('do_date')
      table.datetime('receive_date').nullable()
      table.integer('qty')
      table.integer('no_so')
      table.integer('no_lo').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('product_orders')
  }
}

module.exports = ProductOrderSchema
