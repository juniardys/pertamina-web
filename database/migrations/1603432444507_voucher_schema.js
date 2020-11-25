'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VoucherSchema extends Schema {
  up () {
    this.create('vouchers', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.uuid('company_uuid').unsigned().references('uuid').inTable('companies')
      table.uuid('spbu_uuid').unsigned().references('uuid').inTable('spbu')
      table.uuid('product_uuid').unsigned().references('uuid').inTable('products')
      table.string('qr_code').notNullable()
      table.integer('amount').unsigned().defaultTo(0)
      table.integer('price').unsigned().defaultTo(0)
      table.bigInteger('total_price').unsigned().defaultTo(0)
      table.boolean('isUsed').defaultTo(false)
      table.datetime('used_at').nullable()
      table.date('used_date').nullable()
      table.uuid('operator_uuid').references('uuid').inTable('users').onDelete('cascade').nullable()
      table.string('person_name').nullable()
      table.string('person_plate').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('vouchers')
  }
}

module.exports = VoucherSchema
