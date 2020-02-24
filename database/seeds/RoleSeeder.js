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

class RoleSeeder {
  async run () {
    const data = [
      {
        name: "Superadmin",
        description: "",
        slug: "superadmin"
      },
      {
        name: "Admin",
        description: "",
        slug: "admin"
      },
      {
        name: "Operator",
        description: "",
        slug: "operator"
      }
    ]

    for (let i = 0; i < data.length; i++) {      
      const role = new Role()
      role.uuid = uuid()
      role.name = data[i].name
      role.description = data[i].description
      role.slug = data[i].slug
      await role.save()
    }
  }
}

module.exports = RoleSeeder
