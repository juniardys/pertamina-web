'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompanyTokenSchema extends Schema {
  up () {
    this.create('company_tokens', (table) => {
      table.increments()
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('company_tokens')
  }
}

module.exports = CompanyTokenSchema
