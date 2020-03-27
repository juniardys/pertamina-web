'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportCoWorkerSchema extends Schema {
  up () {
    this.create('report_co_workers', (table) => {
      table.increments()
      table.uuid('uuid').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('island_uuid').references('uuid').inTable('islands').onDelete('cascade').notNullable()
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade').notNullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_co_workers')
  }
}

module.exports = ReportCoWorkerSchema
