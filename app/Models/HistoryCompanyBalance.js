'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HistoryCompanyBalance extends Model {
    static get table() {
        return 'history_company_balances'
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
}

module.exports = HistoryCompanyBalance
