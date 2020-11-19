'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * VoucherHistoryTransformer class
 *
 * @class VoucherHistoryTransformer
 * @constructor
 */
class VoucherHistoryTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      date: moment(model.date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      type: model.type,
      product_uuid: model.product_uuid,
      company_uuid: model.company_uuid,
      amount: model.amount,
      total_price: model.total_price,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
}

module.exports = VoucherHistoryTransformer
