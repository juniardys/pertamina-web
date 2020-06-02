'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/V1/ProductTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const moment = use('moment')

/**
 * FeederTankTransformer class
 *
 * @class FeederTankTransformer
 * @constructor
 */
class FeederTankTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['product', 'spbu']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      uuid: model.uuid,
      name: model.name,
      spbu_uuid: model.spbu_uuid,
      product_uuid: model.product_uuid,
      start_meter: model.start_meter,
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
}

module.exports = FeederTankTransformer
