'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewsSchema extends Schema {
  up () {
    this.create('news', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('title')
      table.string('slug').unique()
      table.text('description').nullable()
      table.bigInteger('hits').defaultTo(0)
      table.text('image').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('news')
  }
}

module.exports = NewsSchema
