'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.string('name')
      table.string('description').nullable()
      table.enu('mobile_layout', ['admin', 'operator']).defaultTo('operator')
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RoleSchema
