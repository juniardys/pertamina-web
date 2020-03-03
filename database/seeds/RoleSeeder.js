'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const uuid = use('uuid-random')
const Role = use('App/Models/Role')
const AccessList = use('App/Models/AccessList')
const { get } = use('App/Helpers/ACL')

class RoleSeeder {
  async run() {
    const data = [
      {
        name: "Superadmin",
        description: "jabatan ini tidak bisa diedit dan dihapus karena jabatan utama."
      },
      {
        name: "Admin",
        description: ""
      },
      {
        name: "Operator",
        description: ""
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const role = new Role()
      role.uuid = uuid()
      role.name = data[i].name
      role.description = data[i].description
      await role.save()

      if (role.id == 1) {
        const acl = get()
        Object.keys(acl).forEach(async function (key) {
          const accessList = new AccessList()
          accessList.uuid = uuid()
          accessList.type = 'role'
          accessList.role_uuid = role.uuid
          accessList.access = key
          await accessList.save()
        });
      }
    }
  }
}

module.exports = RoleSeeder
