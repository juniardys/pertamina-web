'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccessListSchema extends Schema {
  up () {
    this.create('access_lists', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.enu('type', ['role', 'user']).defaultTo('role')
      table.uuid('role_uuid').references('uuid').inTable('roles').onDelete('cascade')
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.string('access')
      table.timestamps()
    })
  }

  down () {
    this.drop('access_lists')
  }
}

module.exports = AccessListSchema
