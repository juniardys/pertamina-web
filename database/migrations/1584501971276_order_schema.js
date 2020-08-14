'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.date('order_date').notNullable()
      table.string('order_no').notNullable()
      table.integer('quantity').notNullable()
      table.timestamps()
      table.enu('status', ['pending', 'partial', 'delivered']).defaultTo('pending')
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
