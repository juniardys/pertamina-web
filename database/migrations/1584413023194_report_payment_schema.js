'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportPaymentSchema extends Schema {
  up () {
    this.create('report_payments', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_payments')
  }
}

module.exports = ReportPaymentSchema
