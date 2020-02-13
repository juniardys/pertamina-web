'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CouponSchema extends Schema {
  up () {
    this.create('coupons', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('code')
      table.string('title')
      table.text('slug').unique()
      table.text('description').nullable()
      table.integer('price').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('coupons')
  }
}

module.exports = CouponSchema
