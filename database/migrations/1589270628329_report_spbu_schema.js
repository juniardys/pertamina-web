'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSpbuSchema extends Schema {
  up () {
    this.create('report_spbus', (table) => {
      table.increments()
      table.uuid('uuid')
      table.date('date')
      table.uuid('operator_uuid').references('uuid').inTable('users').onDelete('cascade').nullable()
      table.boolean('status_operator').defaultTo(false)
      table.boolean('status_admin').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('report_spbus')
  }
}

module.exports = ReportSpbuSchema
