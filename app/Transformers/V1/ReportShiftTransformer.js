'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const moment = use('moment')
const Env = use('Env')

/**
 * ReportShiftTransformer class
 *
 * @class ReportShiftTransformer
 * @constructor
 */
class ReportShiftTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      uuid: model.uuid,
      spbu_uuid: model.spbu_uuid,
      shift_uuid: model.shift_uuid,
      start_time: moment(model.start_time, 'HH:mm:ss').format('HH:mm'),
      end_time: moment(model.end_time, 'HH:mm:ss').format('HH:mm'),
      admin_acc: model.admin_acc,
      status_operator: model.status_operator,
      status_admin: model.status_admin,
      date: moment(model.date, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }

  includeSpbu(model) {
    return this.item(model.getRelated('spbu'), SpbuTransformer)
  }

  includeShift(model) {
    return this.item(model.getRelated('shift'), ShiftTransformer)
  }

  includeAdmin(model) {
    return this.item(model.getRelated('admin'), UserTransformer)
  }
}

module.exports = ReportShiftTransformer
