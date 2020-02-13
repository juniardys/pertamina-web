'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentMethodSchema extends Schema {
  up () {
    this.create('payment_methods', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade')
      table.string('code')
      table.string('name')
      table.text('slug').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('payment_methods')
  }
}

module.exports = PaymentMethodSchema
