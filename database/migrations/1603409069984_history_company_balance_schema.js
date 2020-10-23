'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoryCompanyBalanceSchema extends Schema {
  up () {
    this.create('history_company_balances', (table) => {
      table.increments()
      table.uuid('uuid').unsigned().references('uuid').inTable('companies')
      table.integer('current_balance').notNullable()
      table.integer('added_balance').notNullable()
      table.integer('final_balance').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('history_company_balances')
  }
}

module.exports = HistoryCompanyBalanceSchema
