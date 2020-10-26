'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VoucherGenerateHistorySchema extends Schema {
  up () {
    this.create('voucher_generate_histories', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.date('date')
      table.enu('type', ['generate', 'regenerate']).defaultTo('generate')
      table.uuid('product_uuid').unsigned().references('uuid').inTable('products')
      table.integer('amount')
      table.integer('price').unsigned().defaultTo(0)
      table.bigInteger('total_price').unsigned().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('voucher_generate_histories')
  }
}

module.exports = VoucherGenerateHistorySchema
