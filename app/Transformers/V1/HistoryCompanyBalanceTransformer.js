'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * HistoryCompanyBalanceTransformer class
 *
 * @class HistoryCompanyBalanceTransformer
 * @constructor
 */
class HistoryCompanyBalanceTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      current_balance: model.current_balance,
      added_balance: model.added_balance,
      final_balance: model.final_balance,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
}

module.exports = HistoryCompanyBalanceTransformer
