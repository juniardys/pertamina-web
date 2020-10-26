'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VoucherGenerateHistoryItemSchema extends Schema {
  up () {
    this.create('voucher_generate_history_items', (table) => {
      table.increments()
      table.uuid('voucher_uuid').references('uuid').inTable('vouchers').onDelete('cascade').nullable()
      table.uuid('voucher_generate_history_uuid').references('uuid').inTable('voucher_generate_histories').onDelete('cascade').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('voucher_generate_history_items')
  }
}

module.exports = VoucherGenerateHistoryItemSchema
