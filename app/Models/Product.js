'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    static boot() {
        super.boot()

        this.addTrait('@provider:Lucid/SoftDeletes')
        this.addTrait("@provider:Lucid/UpdateOrCreate")
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

module.exports = Product
