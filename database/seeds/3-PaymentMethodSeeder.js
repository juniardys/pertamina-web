'use strict'

/*
|--------------------------------------------------------------------------
| PaymentMethodSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const PaymentMethod = use('App/Models/PaymentMethod')
const uuid = use('uuid-random')
const {slugify} = use('App/Helpers')

class PaymentMethodSeeder {
  async run () {
    const data = [
      {
        name: "Tunai",
        code: "TN",
        image_required: false
      },
      {
        name: "Kartu Kredit",
        code: "KK",
        image_required: true
      },
      {
        name: "Kartu Debit",
        code: "KD",
        image_required: true
      },
    ]

    for (let i = 0; i < data.length; i++) {
      const payment = new PaymentMethod()
      payment.uuid = uuid()
      payment.name = data[i].name
      payment.code = data[i].code
      payment.slug = await slugify(data[i].name, 'payment_methods', 'slug')
      payment.image_required = data[i].image_required
      await payment.save()
    }
  }
}

module.exports = PaymentMethodSeeder
