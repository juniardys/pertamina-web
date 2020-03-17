'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportNozzleSchema extends Schema {
  up () {
    this.create('report_nozzles', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_nozzles')
  }
}

module.exports = ReportNozzleSchema
