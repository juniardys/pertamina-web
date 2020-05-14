'use strict'
const moment = use('moment')

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * NotificationTransformer class
 *
 * @class NotificationTransformer
 * @constructor
 */
class NotificationTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      uuid: model.uuid,
      user_uuid: model.user_uuid,
      title: model.title,
      body: model.body,
      type: model.type,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = NotificationTransformer
