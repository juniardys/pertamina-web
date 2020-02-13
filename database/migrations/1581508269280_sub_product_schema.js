'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubProductSchema extends Schema {
  up () {
    this.create('sub_products', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('product_uuid').references('uuid').inTable('products').onDelete('cascade')
      table.string('code')
      table.string('name')
      table.text('slug').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('sub_products')
  }
}

module.exports = SubProductSchema
