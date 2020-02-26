'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('name')
      table.text('slug').unique()
      table.string('code')
      table.integer('price').unsigned()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
