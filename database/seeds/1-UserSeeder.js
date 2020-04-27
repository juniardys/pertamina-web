'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Role = use('App/Models/Role')
const uuid = use('uuid-random')

class UserSeeder {
  async run () {
    const data = [
      {
        email: "admin@nalarnaluri.com",
        password: "12345678",
        name: "Admin",
        role: 1
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const role = await Role.query().where('id', data[i].role).first()
      const user = new User()
      user.uuid = uuid()
      user.name = data[i].name
      user.email = data[i].email
      user.password = data[i].password
      user.role_uuid = role.uuid
      await user.save()
    }
  }
}

module.exports = UserSeeder
