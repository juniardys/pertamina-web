'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.uuid('uuid').unique().notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').nullable()
      table.uuid('role_uuid').references('uuid').inTable('roles').onDelete('cascade').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('name', 254).notNullable()
      table.string('phone').nullable()
      table.string('ktp').nullable()
      table.text('address').nullable()
      table.text('FCM_TOKEN').nullable()
      table.text('image').nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
