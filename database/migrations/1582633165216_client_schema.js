'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60)
      table.string('name', 254)
      table.string('phone').nullable()
      table.text('address').nullable()
      table.text('image').nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
