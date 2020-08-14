'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/V1/ProductTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const DeliveryTransformer = use('App/Transformers/V1/DeliveryTransformer')
const moment = use('moment')
const Delivery = use('App/Models/Delivery')

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'product', 'deliveries']
  }

  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    moment.locale('id')
    let delivered = 0
    const data = await Delivery.query().select('quantity', 'receipt_date').where('order_uuid', model.uuid).fetch()
    data.toJSON().forEach(data => { 
      delivered = delivered + parseInt(data.quantity)
    });
    const lastDelivery = data.toJSON().slice(-1)[0]
    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      product_uuid: model.product_uuid,
      order_date: moment(model.order_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
      order_no: model.order_no,
      quantity: model.quantity,
      status: model.status,
      delivered: delivered,
      complete_date: (delivered >= model.quantity)? moment(lastDelivery.receipt_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }

  includeProduct(model) {
    return this.item(model.getRelated('product'), ProductTransformer)
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }

  includeDeliveries(model) {
    return this.collection(model.getRelated('deliveries'), DeliveryTransformer)
  }
}

module.exports = OrderTransformer
