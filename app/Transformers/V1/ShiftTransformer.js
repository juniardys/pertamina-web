'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * ShiftTransformer class
 *
 * @class ShiftTransformer
 * @constructor
 */
class ShiftTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    const deleted_at = (model.deleted_at) ? moment(model.deleted_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null

    return {
      uuid: model.uuid,
      name: model.name,
      start: moment(model.start, 'HH:mm:ss').format('HH:mm'),
      end: moment(model.end, 'HH:mm:ss').format('HH:mm'),
      // is_first: model.is_first,
      no_order: model.no_order,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = ShiftTransformer
