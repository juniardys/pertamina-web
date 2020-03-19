'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SpbuPaymentSchema extends Schema {
  up () {
    this.create('spbu_payments', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('payment_uuid').references('uuid').inTable('payment_methods').onDelete('cascade')
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('spbu_payments')
  }
}

module.exports = SpbuPaymentSchema
