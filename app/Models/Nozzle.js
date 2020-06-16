'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Nozzle extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    static get hidden() {
        return ['id']
    }

    spbu() {
        return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
    }

    island() {
        return this.belongsTo('App/Models/Island', 'island_uuid', 'uuid')
    }
    
    product() {
        return this.belongsTo('App/Models/Product', 'product_uuid', 'uuid')
    }

    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = Nozzle
