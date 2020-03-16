'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SpbuPaymentSchema extends Schema {
  up () {
    this.create('spbu_payments', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('payment_uuid')
      table.uuid('spbu_uuid')
      table.timestamps()
    })
  }

  down () {
    this.drop('spbu_payments')
  }
}

module.exports = SpbuPaymentSchema
