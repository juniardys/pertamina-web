'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportCoWorkerSchema extends Schema {
  up () {
    this.create('report_co_workers', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_co_workers')
  }
}

module.exports = ReportCoWorkerSchema
