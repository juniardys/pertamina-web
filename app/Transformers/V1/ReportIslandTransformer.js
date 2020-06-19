'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const moment = use('moment')
const Env = use('Env')
/**
 * ReportIslandTransformer class
 *
 * @class ReportIslandTransformer
 * @constructor
 */
class ReportIslandTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['spbu', 'island', 'shift', 'operator']
  }
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      shift_uuid: model.shift_uuid,
      island_uuid: model.island_uuid,
      operator_uuid: model.operator_uuid,
      status_operator: model.status_operator,
      date: moment(model.date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
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

  includeOperator(model) {
    return this.item(model.getRelated('operator'), UserTransformer)
  }
}

module.exports = ReportIslandTransformer
