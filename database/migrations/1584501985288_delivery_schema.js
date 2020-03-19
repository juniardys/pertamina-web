'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliverySchema extends Schema {
  up () {
    this.create('deliveries', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.uuid('order_uuid').references('uuid').inTable('orders').onDelete('cascade')
      table.integer('quantity').notNullable()
      table.date('receipt_date').nullable()
      table.string('receipt_no').notNullable()
      table.string('police_no').notNullable()
      table.string('driver')
      table.string('receiver')
      table.timestamps()
    })
  }

  down () {
    this.drop('deliveries')
  }
}

module.exports = DeliverySchema
