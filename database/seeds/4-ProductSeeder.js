'use strict'

/*
|--------------------------------------------------------------------------
| ProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Product = use('App/Models/Product')
const { slugify } = use('App/Helpers')
const uuid = use('uuid-random')

class ProductSeeder {
  async run() {
    const data = [
      {
        name: "Pertamax Racing",
        code: "PR",
        price: 13000
      },
      {
        name: "Pertamax Turbo",
        code: "PT",
        price: 13000
      },
      {
        name: "Pertamax",
        code: "PMAX",
        price: 13000
      },
      {
        name: "Pertalite",
        code: "PLITE",
        price: 13000
      },
      {
        name: "Premium",
        code: "PMIUM",
        price: 13000
      },
      {
        name: "Pertamina DEX",
        code: "PDEX",
        price: 13000
      },
      {
        name: "DEX Lite",
        code: "DLITE",
        price: 13000
      },
      {
        name: "Solar",
        code: "SL",
        price: 13000
      },
      {
        name: "Kerosine",
        code: "KR",
        price: 13000
      }
    ]

    for (let i = 0; i < data.length; i++) {
      const product = new Product()
      product.uuid = uuid()
      product.name = data[i].name
      product.slug = await slugify(data[i].name, 'products', 'slug')
      product.code = data[i].code
      product.price = data[i].price
      await product.save()
    }
  }
}

module.exports = ProductSeeder
