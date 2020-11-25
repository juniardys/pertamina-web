'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Voucher extends Model {
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    company() {
        return this.belongsTo('App/Models/Company', 'company_uuid', 'uuid')
    }

    product() {
        return this.belongsTo('App/Models/Product', 'product_uuid', 'uuid')
    }

    operator() {
        return this.hasOne('App/Models/User', 'operator_uuid', 'uuid')
    }

    spbu() {
        return this.hasOne('App/Models/Spbu', 'spbu_uuid', 'uuid')
    }

    generate_history() {
        return this.belongsToMany(
            'App/Models/VoucherGenerateHistory',
            'voucher_uuid',
            'voucher_generate_history_uuid',
            'uuid',
            'uuid'
        ).pivotTable('voucher_generate_history_items')
    }
}

module.exports = Voucher
