'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentMethodSchema extends Schema {
  up () {
    this.create('payment_methods', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('code').unique()
      table.string('name')
      table.boolean('image_required').defaultTo(0)
      table.text('slug').unique()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('payment_methods')
  }
}

module.exports = PaymentMethodSchema
