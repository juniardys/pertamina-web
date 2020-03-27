'use strict'

/*
|--------------------------------------------------------------------------
| BaseSpbuSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Product = use('App/Models/Product')
const Spbu = use('App/Models/Spbu')
const Shift = use('App/Models/Shift')
const Island = use('App/Models/Island')
const Nozzle = use('App/Models/Nozzle')

class BaseSpbuSeeder {
  async run () {
    const product = await Product.query().where('id', 1).first()
    const uuid1 = "170eeeee-0a43-467c-bd41-588341e4a645"
    const uuid2 = "895a670a-5c44-4bae-993c-944fdd81208e"

    // Make SPBU
    const spbu = new Spbu()
    spbu.uuid = uuid1
    spbu.name = "Pertamina G-Walk"
    spbu.address = "CitraLand"
    spbu.phone = "08512361782"
    spbu.code = "SPBUGWALK"
    await spbu.save()

    // Make Shift
    const shift = new Shift()
    shift.uuid = uuid1
    shift.spbu_uuid = uuid1
    shift.name = "Dini Hari"
    shift.start = "00:00"
    shift.end = "00:06"
    await shift.save()

    // Make Island
    const island = new Island()
    island.uuid = uuid1
    island.spbu_uuid = uuid1
    island.name = "Island 1"
    island.code = "IS1"
    await island.save()

    // Make Nozzle
    const nozzle1 = new Nozzle()
    nozzle1.uuid = uuid1
    nozzle1.spbu_uuid = uuid1
    nozzle1.island_uuid = uuid1
    nozzle1.product_uuid = product.uuid
    nozzle1.name = "Pompa A1"
    nozzle1.code = "A1"
    await nozzle1.save()
    
    const nozzle2 = new Nozzle()
    nozzle2.uuid = uuid2
    nozzle2.spbu_uuid = uuid1
    nozzle2.island_uuid = uuid1
    nozzle2.product_uuid = product.uuid
    nozzle2.name = "Pompa A2"
    nozzle2.code = "A2"
    await nozzle2.save()
  }
}

module.exports = BaseSpbuSeeder
