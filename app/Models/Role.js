'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }
    
    static get hidden() {
        return ['id']
    }

    accessList() {
        return this.hasMany('App/Models/AccessList', 'uuid', 'role_uuid')
    }

    // Setters
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
}

module.exports = Role
