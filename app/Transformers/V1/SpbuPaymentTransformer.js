'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const PaymentMethodTransformer = use('App/Transformers/V1/PaymentMethodTransformer')
const moment = use('moment')

/**
 * SpbuPaymentTransformer class
 *
 * @class SpbuPaymentTransformer
 * @constructor
 */
class SpbuPaymentTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'payment']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      payment_uuid: model.payment_uuid,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }

  includePayment(model) {
    return this.item(model.getRelated('payment'), PaymentMethodTransformer)
  }
}

module.exports = SpbuPaymentTransformer
