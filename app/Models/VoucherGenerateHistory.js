'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VoucherGenerateHistory extends Model {
    static get table() {
        return 'voucher_generate_histories'
    }

    // Setters
    setDeletedAt(deleted_at) {
        return new Date(deleted_at).toISOString()
    }
    setCreatedAt(created_at) {
        return new Date(created_at).toISOString()
    }
    setUpdatedAt(updated_at) {
        return new Date(updated_at).toISOString()
    }
    
    static boot() {
        super.boot()
     
        this.addTrait("@provider:Lucid/UpdateOrCreate")
    }

    company() {
        return this.belongsTo('App/Models/Company', 'company_uuid', 'uuid')
    }

    spbu() {
        return this.hasOne('App/Models/Spbu', 'spbu_uuid', 'uuid')
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
