'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const NozzleTransformer = use('App/Transformers/V1/NozzleTransformer')
const ReportNozzle = use('App/Models/ReportNozzle')
const moment = use('moment')
const Env = use('Env')

/**
 * ReportNozzleTransformer class
 *
 * @class ReportNozzleTransformer
 * @constructor
 */
class ReportNozzleTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['nozzle']
  }
  
  static get availableInclude() {
    return ['spbu', 'island', 'shift']
  }

  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    moment.locale('id')
    // const test = await ReportNozzle.query().where('uuid', model.uuid).first()
    
    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      island_uuid: model.island_uuid,
      shift_uuid: model.shift_uuid,
      nozzle_uuid: model.nozzle_uuid,
      start_meter: model.start_meter,
      last_meter: model.last_meter,
      volume: model.volume,
      price: model.price,
      total_price: model.total_price,
      image: `${Env.get('APP_API_URL')}/${model.image}`,
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

  includeNozzle(model) {
    return this.item(model.getRelated('nozzle'), NozzleTransformer)
  }
}

module.exports = ReportNozzleTransformer
