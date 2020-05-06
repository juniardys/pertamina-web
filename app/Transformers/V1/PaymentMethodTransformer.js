'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const moment = use('moment')

/**
 * PaymentMethodTransformer class
 *
 * @class PaymentMethodTransformer
 * @constructor
 */
class PaymentMethodTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    moment.locale('id')

    const deleted_at = (model.deleted_at) ? moment(model.deleted_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null

    return {
      uuid: model.uuid,
      name: model.name,
      slug: model.slug,
      code: model.code,
      image_required: model.image_required,
      deleted_at: deleted_at,
      created_at: moment(model.created_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(model.updated_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

module.exports = PaymentMethodTransformer
