'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * IslandTransformer class
 *
 * @class IslandTransformer
 * @constructor
 */
class IslandTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      name: model.name,
      code: model.code,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
}

module.exports = IslandTransformer
