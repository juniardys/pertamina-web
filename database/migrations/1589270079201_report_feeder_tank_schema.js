'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportFeederTankSchema extends Schema {
  up () {
    this.create('report_feeder_tanks', (table) => {
      table.increments()
      table.uuid('uuid').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.uuid('fedeer_tank_uuid').references('uuid').inTable('feeder_tanks').onDelete('cascade').notNullable()
      table.integer('value').notNullable()
      table.text('image').notNullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_feeder_tanks')
  }
}

module.exports = ReportFeederTankSchema