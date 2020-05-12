'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportIslandSchema extends Schema {
  up () {
    this.create('report_islands', (table) => {
      table.increments()
      table.uuid('uuid')
      table.date('date')
      table.boolean('status_operator').default(true)
      table.boolean('status_admin').default(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('report_islands')
  }
}

module.exports = ReportIslandSchema
