'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DriverTransactionSchema extends Schema {
  up () {
    this.create('driver_transactions', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.integer('amount').unsigned()
      table.uuid('staff_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('driver_transactions')
  }
}

module.exports = DriverTransactionSchema
