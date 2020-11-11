'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VoucherGenerateHistory extends Model {
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

    vouchers() {
        return this.belongsToMany(
            'App/Models/Voucher',
            'voucher_generate_history_uuid',
            'voucher_uuid',
            'uuid',
            'uuid'
        ).pivotTable('voucher_generate_history_items')
    }
}

module.exports = VoucherGenerateHistory
