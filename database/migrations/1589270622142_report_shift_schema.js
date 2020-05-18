'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportShiftSchema extends Schema {
  up () {
    this.create('report_shifts', (table) => {
      table.increments()
      table.uuid('uuid')
      table.date('date')
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()  
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('admin_acc').references('uuid').inTable('users').onDelete('cascade').nullable()
      table.boolean('status_operator').defaultTo(false)
      table.boolean('status_admin').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('report_shifts')
  }
}

module.exports = ReportShiftSchema
