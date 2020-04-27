'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.string('name').notNullable()
      table.text('slug').unique().notNullable()
      table.string('code').unique().notNullable()
      table.integer('price').unsigned().notNullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
