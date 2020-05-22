'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportPaymentSchema extends Schema {
  up () {
    this.create('report_payments', (table) => {
      table.increments()
      table.uuid('uuid').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('island_uuid').references('uuid').inTable('islands').onDelete('cascade').notNullable()
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.uuid('payment_method_uuid').references('uuid').inTable('payment_methods').onDelete('cascade').notNullable()
      table.integer('amount').notNullable()
      table.text('image')
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_payments')
  }
}

module.exports = ReportPaymentSchema
