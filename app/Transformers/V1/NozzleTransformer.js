'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/V1/ProductTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const moment = use('moment')

/**
 * NozzleTransformer class
 *
 * @class NozzleTransformer
 * @constructor
 */
class NozzleTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['product']
  }

  static get availableInclude() {
    return ['spbu', 'island']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      name: model.name,
      code: model.code,
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

  includeIsland(model) {
    return this.item(model.getRelated('island'), IslandTransformer)
  }
}

module.exports = NozzleTransformer
