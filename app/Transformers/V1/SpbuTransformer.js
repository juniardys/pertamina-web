'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const PaymentMethodTransformer = use('App/Transformers/V1/PaymentMethodTransformer')
const moment = use('moment')

/**
 * SpbuTransformer class
 *
 * @class SpbuTransformer
 * @constructor
 */
class SpbuTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['payments']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    const deleted_at = (model.deleted_at) ? moment(model.deleted_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null

    return {
      uuid: model.uuid,
      name: model.name,
      address: model.address,
      phone: model.phone,
      code: model.code,
      deleted_at: deleted_at,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }

  includePayments(model) {
    return this.collection(model.getRelated('payments'), PaymentMethodTransformer)
  }
}

module.exports = SpbuTransformer
