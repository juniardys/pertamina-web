'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ReportShift extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }
    
    spbu() {
        return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
    }
    
    shift() {
        return this.belongsTo('App/Models/Shift', 'shift_uuid', 'uuid')
    }
    
    island() {
        return this.belongsTo('App/Models/Island', 'island_uuid', 'uuid')
    }
    
    operator() {
        return this.belongsTo('App/Models/User', 'operator_uuid', 'uuid')
    }
    
    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = ReportShift
