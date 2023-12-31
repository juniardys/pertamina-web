'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')

class ReportNozzle extends Model {
    static boot() {
        super.boot()

        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    static get computed () {
      return ['volume']
    }

    getVolume({ start_meter, last_meter }) {
        return last_meter - start_meter
    }

    getTotalPrice(total_price) {
        return parseInt(total_price) || 0
    }

    spbu() {
        return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
    }

    island() {
        return this.belongsTo('App/Models/Island', 'island_uuid', 'uuid')
    }

    shift() {
        return this.belongsTo('App/Models/Shift', 'shift_uuid', 'uuid')
    }

    nozzle() {
        return this.belongsTo('App/Models/Nozzle', 'nozzle_uuid', 'uuid')
    }

    // Getters
    getDate(date) {
        return moment(date).format('YYYY-MM-DD')
    }

    // Setters
    setDate(date) {
        return new Date(date).toISOString()
    }
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = ReportNozzle
