'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PayMethodLogSchema extends Schema {
  up () {
    this.create('pay_method_logs', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('payment_method_uuid').references('uuid').inTable('payment_methods').onDelete('cascade')
      table.enu('shift', [1, 2, 3])
      table.integer('amount').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('pay_method_logs')
  }
}

module.exports = PayMethodLogSchema
