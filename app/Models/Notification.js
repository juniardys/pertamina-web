'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Notification extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = Notification
