'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')
const Env = use('Env')

/**
 * CompanyTransformer class
 *
 * @class CompanyTransformer
 * @constructor
 */
class CompanyTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      email: model.email,
      name: model.name,
      phone: model.phone,
      address: model.address,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
}

module.exports = CompanyTransformer
