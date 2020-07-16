'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SpbuSchema extends Schema {
  up () {
    this.create('spbu', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.string('name').notNullable()
      table.text('address').notNullable()
      table.string('phone').notNullable()
      table.string('code').notNullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('spbu')
  }
}

module.exports = SpbuSchema
