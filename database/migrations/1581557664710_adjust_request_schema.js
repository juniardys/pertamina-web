'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdjustRequestSchema extends Schema {
  up () {
    this.create('adjust_requests', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid')
      table.integer('amount').unsigned()
      table.enu('status', [])
      table.timestamps()
    })
  }

  down () {
    this.drop('adjust_requests')
  }
}

module.exports = AdjustRequestSchema
