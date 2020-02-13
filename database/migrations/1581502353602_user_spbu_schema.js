'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSpbuSchema extends Schema {
  up () {
    this.create('user_spbus', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.uuid('spbu_id').references('uuid').inTable('spbu').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_spbus')
  }
}

module.exports = UserSpbuSchema
