'use strict'

const Hash = use('Hash')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {
    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.password) {
            userInstance.password = await Hash.make(userInstance.password)
            }
        })

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    static get table() {
        return 'companies'
    }

    tokens() {
        return this.hasMany('App/Models/Token')
    }

    static get hidden() {
        return ['password']
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

module.exports = Company
