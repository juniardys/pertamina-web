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
        role: get(),
        uuid: "94372ea5-e24c-4330-a453-2b01c424ee5d"
      },
      {
        name: "Admin",
        description: "Jabatan Admin",
        mobile_layout: 'admin',
        role: {
          "spbu.manage": "Manajemen SPBU",
          "spbu.manage.report": "Mengatur Report",
          "spbu.manage.report.read": "Melihat",
          "spbu.manage.report.export": "Ekspor",
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
          "spbu.manage.feeder-tank": "Mengatur Island",
          "spbu.manage.feeder-tank.read": "Melihat",
          "spbu.manage.feeder-tank.create": "Membuat",
          "spbu.manage.feeder-tank.update": "Mengubah",
          "spbu.manage.feeder-tank.delete": "Menghapus",
          "spbu.manage.order": "Mengatur Pemesanan",
          "spbu.manage.order.read": "Melihat",
          "spbu.manage.order.create": "Membuat",
          "spbu.manage.order.update": "Mengubah",
          "spbu.manage.order.delete": "Menghapus",
          "spbu.manage.order.delivery": "Mengatur Pengiriman",
          "spbu.manage.order.delivery.read": "Melihat",
          "spbu.manage.order.delivery.create": "Membuat",
          "spbu.manage.order.delivery.update": "Mengubah",
          "spbu.manage.order.delivery.delete": "Menghapus",
          "spbu.manage.setting": "Pengaturan SPBU",
          "spbu.manage.setting.detail": "Merubah Detail SPBU",
          "spbu.manage.setting.payment": "Merubah Pengaturan Metode Pembayaran",
          "product": "Produk",
          "product.read": "Melihat",
          "product.create": "Membuat",
          "product.update": "Mengubah",
          "product.delete": "Menghapus",
        },
        uuid: "45982947-346a-43d6-9204-78202ad970ab"
      },
      {
        name: "Operator",
        description: "Jabatan Operator",
        mobile_layout: 'operator',
        role: "",
        uuid: "0bec0af4-a32f-4b1e-bfc2-5f4933c49740"
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const role = new Role()
      role.uuid = data[i].uuid
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
