'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const moment = use('moment')
const Env = use('Env')

/**
 * ReportCoWorkerTransformer class
 *
 * @class ReportCoWorkerTransformer
 * @constructor
 */
class ReportCoWorkerTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'island', 'shift', 'user']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      island_uuid: model.island_uuid,
      shift_uuid: model.shift_uuid,
      user_uuid: model.user_uuid,
      date: moment(model.date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
    }
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }

  includeIsland(model) {
    return this.item(model.getRelated('island'), IslandTransformer)
  }

  includeShift(model) {
    return this.item(model.getRelated('shift'), ShiftTransformer)
  }

  includeUser(model) {
    return this.item(model.getRelated('user'), UserTransformer)
  }
}

module.exports = ReportCoWorkerTransformer
