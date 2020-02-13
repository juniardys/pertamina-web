'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('code')
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.uuid('company_uuid').references('uuid').inTable('companies').onDelete('cascade')
      table.uuid('coupon_uuid').references('uuid').inTable('coupons').onDelete('cascade')
      table.integer('tax').unsigned()
      table.integer('total').unsigned()
      table.enu('status', ['pending', 'success', 'expired']).defaultTo('pending')
      table.datetime('expired_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
