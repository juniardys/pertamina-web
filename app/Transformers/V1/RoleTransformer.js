'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')
/**
 * RoleTransformer class
 *
 * @class RoleTransformer
 * @constructor
 */
class RoleTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      name: model.name,
      description: model.description,
      slug: model.slug,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
}

module.exports = RoleTransformer
