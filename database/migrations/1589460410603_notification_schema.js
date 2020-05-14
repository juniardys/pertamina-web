'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.uuid('uuid').unique()
      table.uuid('user_uuid').references('uuid').inTable('users').onDelete('cascade')
      table.string('title').notNullable()
      table.text('body').nullable()
      table.enu('type', ['info', 'success', 'warning', 'danger']).default('info')
      table.timestamps()
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
