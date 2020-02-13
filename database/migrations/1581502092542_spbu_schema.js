'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SpbuSchema extends Schema {
  up () {
    this.create('spbu', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('name')
      table.text('address')
      table.string('phone')
      table.string('code')
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('spbu')
  }
}

module.exports = SpbuSchema
