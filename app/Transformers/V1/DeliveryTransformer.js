'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const OrderTransformer = use('App/Transformers/V1/OrderTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const moment = use('moment')
const Env = use('Env')

/**
 * DeliveryTransformer class
 *
 * @class DeliveryTransformer
 * @constructor
 */
class DeliveryTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'order', 'shift']
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
      shift_uuid: model.shift_uuid,
      quantity: model.quantity,
      receipt_date: moment(model.receipt_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
      receipt_no: model.receipt_no,
      police_no: model.police_no,
      driver: model.driver,
      receiver: model.receiver,
      image: (model.image != null) ? `${Env.get('APP_URL')}/${model.image}` : null,
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

  includeShift(model) {
    return this.item(model.getRelated('shift'), ShiftTransformer)
  }
}

module.exports = DeliveryTransformer