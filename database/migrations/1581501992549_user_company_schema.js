'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserCompanySchema extends Schema {
  up () {
    this.create('user_companies', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.uuid('company_uuid').references('uuid').inTable('companies').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_companies')
  }
}

module.exports = UserCompanySchema
