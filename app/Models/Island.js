'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Island extends Model {
    static get hidden() {
        return ['id']
    }

    spbu() {
        return this.belongsTo('App/Models/Spbu', 'uuid', 'spbu_uuid')
    }

    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = Island
