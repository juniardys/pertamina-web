'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const AccessListTransformer = use('App/Transformers/V1/AccessListTransformer')
const moment = use('moment')
/**
 * RoleTransformer class
 *
 * @class RoleTransformer
 * @constructor
 */
class RoleTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['accessList']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      name: model.name,
      description: model.description,
      mobile_layout: model.mobile_layout,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }

  transformWithLevel(model) {
    let getLevel = null
    try {
      getLevel = model.getRelated('accessList').toJSON().length
    } catch (error) {

    }
    return {
      ...this.transform(model),
      level: getLevel
    }
  }

  includeAccessList(model) {
    return this.collection(model.getRelated('accessList'), AccessListTransformer)
  }
}

module.exports = RoleTransformer
