'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompaniesSchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.string('name', 254).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.text('address').notNullable()
      table.string('phone').nullable()
      table.integer('balance').unsigned().notNullable().defaultTo(0)
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompaniesSchema
