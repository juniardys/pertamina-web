'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PaymentMethod extends Model {
    static boot() {
        super.boot()
        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    static get hidden() {
        return ['id']
    }

    spbu() {
        return this.belongsToMany('App/Models/Spbu', 'payment_uuid', 'spbu_uuid', 'uuid', 'uuid').pivotTable('spbu_payments')
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

module.exports = PaymentMethod
