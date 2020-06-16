'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ReportPayment extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
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

    paymentMethod() {
        return this.belongsTo('App/Models/PaymentMethod', 'payment_method_uuid', 'uuid')
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

module.exports = ReportPayment
