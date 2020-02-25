'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientTokenSchema extends Schema {
  up () {
    this.create('client_tokens', (table) => {
      table.increments()
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('client_tokens')
  }
}

module.exports = ClientTokenSchema
