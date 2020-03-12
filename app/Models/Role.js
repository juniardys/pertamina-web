'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
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

    // static get computed() {
    //     return ['level']
    // }

    // async getLevel({name}) {
    //     const acl = this.accessList()
    //     const result = await acl.getCount()
    //     console.log(name);
        
    //     console.log(result);
    //     // return parseInt(result)
    //     return name
    // }
}

module.exports = Role
