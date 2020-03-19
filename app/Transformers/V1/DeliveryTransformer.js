'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const OrderTransformer = use('App/Transformers/V1/OrderTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const moment = use('moment')

/**
 * DeliveryTransformer class
 *
 * @class DeliveryTransformer
 * @constructor
 */
class DeliveryTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'order']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      order_uuid: model.order_uuid,
      quantity: model.quantity,
      receipt_date: moment(model.receipt_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
      receipt_no: model.receipt_no,
      police_no: model.police_no,
      driver: model.driver,
      receiver: model.receiver,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }

  includeOrder(model) {
    return this.item(model.getRelated('order'), OrderTransformer)
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }
}

module.exports = DeliveryTransformer
