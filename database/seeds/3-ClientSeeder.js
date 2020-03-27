'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Client = use('App/Models/Client')
const Role = use('App/Models/Role')
const uuid = use('uuid-random')

class ClientSeeder {
  async run() {
    const data = [
      {
        email: "client@nalarnaluri.com",
        password: "farizink",
        name: "Client"
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const client = new Client()
      client.uuid = uuid()
      client.name = data[i].name
      client.email = data[i].email
      client.password = data[i].password
      await client.save()
    }
  }
}

module.exports = ClientSeeder
