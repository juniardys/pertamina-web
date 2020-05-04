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
        description: "Jabatan SuperAdmin",
        mobile_layout: 'admin',
        role: get()
      },
      {
        name: "Admin",
        description: "Jabatan Admin",
        mobile_layout: 'admin',
        role: {
          "spbu.manage.report": "Mengatur Report",
          "spbu.manage.user": "Mengatur Pengguna",
          "spbu.manage.user.read": "Melihat",
          "spbu.manage.user.create": "Membuat",
          "spbu.manage.user.update": "Mengubah",
          "spbu.manage.user.delete": "Menghapus",
          "spbu.manage.shift": "Mengatur Shift",
          "spbu.manage.shift.read": "Melihat",
          "spbu.manage.shift.create": "Membuat",
          "spbu.manage.shift.update": "Mengubah",
          "spbu.manage.shift.delete": "Menghapus",
          "spbu.manage.island": "Mengatur Island",
          "spbu.manage.island.read": "Melihat",
          "spbu.manage.island.create": "Membuat",
          "spbu.manage.island.update": "Mengubah",
          "spbu.manage.island.delete": "Menghapus",
          "spbu.manage.island.nozzle": "Mengatur Pompa",
          "spbu.manage.island.nozzle.read": "Melihat",
          "spbu.manage.island.nozzle.create": "Membuat",
          "spbu.manage.island.nozzle.update": "Mengubah",
          "spbu.manage.island.nozzle.delete": "Menghapus",
          "spbu.manage.setting": "Pengaturan SPBU",
          "spbu.manage.setting.detail": "Merubah Detail SPBU",
          "spbu.manage.setting.payment": "Merubah Pengaturan Metode Pembayaran"
        }
      },
      {
        name: "Operator",
        description: "Jabatan Operator",
        mobile_layout: 'operator',
        role: ""
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const role = new Role()
      role.uuid = uuid()
      role.name = data[i].name
      role.description = data[i].description
      await role.save()

      Object.keys(data[i].role).forEach(async function (key) {
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

module.exports = RoleSeeder
