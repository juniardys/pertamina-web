'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportIslandSchema extends Schema {
  up () {
    this.create('report_islands', (table) => {
      table.increments()
      table.uuid('uuid')
      table.date('date')
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.boolean('status_operator').defaultTo(false)
      table.boolean('status_admin').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('report_islands')
  }
}

module.exports = ReportIslandSchema
