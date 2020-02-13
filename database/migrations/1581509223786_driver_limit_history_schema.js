'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DriverLimitHistorySchema extends Schema {
  up () {
    this.create('driver_limit_histories', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.uuid('company_uuid').references('uuid').inTable('companies').onDelete('cascade')
      table.uuid('driver_uuid').references('uuid').inTable('drivers').onDelete('cascade')
      table.integer('amount').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('driver_limit_histories')
  }
}

module.exports = DriverLimitHistorySchema
