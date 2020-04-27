'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Spbu extends Model {
    static boot() {
        super.boot()

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    static get table() {
        return 'spbu'
    }
    
    static get hidden() {
        return ['id']
    }

    users() {
        return this.hasMany('App/Models/User', 'uuid', 'spbu_uuid')
    }

    shifts() {
        return this.hasMany('App/Models/Shift', 'uuid', 'spbu_uuid')
    }

    payments() {
        return this.belongsToMany('App/Models/PaymentMethod', 'spbu_uuid', 'payment_uuid', 'uuid', 'uuid').pivotTable('spbu_payments')
    }

    // Setters
    setDeletedAt(deleted_at) {
        return new Date(deleted_at).toISOString()
    }
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = Spbu
