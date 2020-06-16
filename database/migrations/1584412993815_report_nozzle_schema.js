'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportNozzleSchema extends Schema {
  up () {
    this.create('report_nozzles', (table) => {
      table.increments()
      table.uuid('uuid').notNullable()
      table.uuid('spbu_uuid').references('uuid').inTable('spbu').onDelete('cascade').notNullable()
      table.uuid('island_uuid').references('uuid').inTable('islands').onDelete('cascade').notNullable()
      table.uuid('shift_uuid').references('uuid').inTable('shifts').onDelete('cascade').notNullable()
      table.uuid('nozzle_uuid').references('uuid').inTable('nozzles').onDelete('cascade').notNullable()
      table.double('start_meter').notNullable()
      table.double('last_meter').notNullable()
      table.integer('price').defaultTo(0)
      table.bigInteger('total_price').defaultTo(0)
      table.text('image').notNullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('report_nozzles')
  }
}

module.exports = ReportNozzleSchema
