'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const RoleTransformer = use('App/Transformers/V1/RoleTransformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const moment = use('moment')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['role', 'spbu']
  }
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    const deleted_at = (model.deleted_at) ? moment(model.deleted_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null

    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      roles_uuid: model.roles_uuid,
      email: model.email,
      name: model.name,
      phone: model.phone,
      ktp: model.ktp,
      address: model.address,
      deleted_at: deleted_at,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }
  
  includeRole(model) {
    return this.item(model.getRelated('role'), RoleTransformer)
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }
}

module.exports = UserTransformer
