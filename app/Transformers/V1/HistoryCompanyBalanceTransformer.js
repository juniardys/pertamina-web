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
      company_uuid: model.company_uuid,
      current_balance: model.current_balance,
      added_balance: model.added_balance,
      removed_balance: model.removed_balance,
      final_balance: model.final_balance,
      description: model.description,
      created_at: moment(model.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = HistoryCompanyBalanceTransformer
