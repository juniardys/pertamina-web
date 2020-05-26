'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SpbuPayment extends Model {
    static boot() {
        super.boot()

        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    static get table() {
        return 'spbu_payments'
    }

    static get hidden() {
        return ['id']
    }

    spbu() {
        return this.belongsTo('App/Models/Spbu', 'spbu_uuid', 'uuid')
    }

    payment() {
        return this.belongsTo('App/Models/PaymentMethod', 'payment_uuid', 'uuid')
    }

    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = SpbuPayment
