'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * AccessListTransformer class
 *
 * @class AccessListTransformer
 * @constructor
 */
class AccessListTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      uuid: model.uuid,
      access: model.access,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = AccessListTransformer
