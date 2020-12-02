'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * VoucherTransformer class
 *
 * @class VoucherTransformer
 * @constructor
 */
class VoucherTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      company_uuid: model.company_uuid,
      product_uuid: model.product_uuid,
      qr_code: model.qr_code,
      amount: model.amount,
      price: model.price,
      total_price: model.total_price,
      isUsed: model.isUsed,
      used_at: moment(model.used_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      used_date: moment(model.used_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      operator_uuid: model.operator_uuid,
      person_name: model.person_name,
      person_plate: model.person_plate,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = VoucherTransformer
