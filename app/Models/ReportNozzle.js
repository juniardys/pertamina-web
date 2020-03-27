'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ReportNozzle extends Model {

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
    
    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = ReportNozzle
