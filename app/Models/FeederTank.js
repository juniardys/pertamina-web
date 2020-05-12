'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FeederTank extends Model {

    spbu() {
        return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
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

module.exports = FeederTank
