'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const PaymentMethodTransformer = use('App/Transformers/V1/PaymentMethodTransformer')
const moment = use('moment')
const Env = use('Env')


/**
 * ReportPaymentTransformer class
 *
 * @class ReportPaymentTransformer
 * @constructor
 */
class ReportPaymentTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['paymentMethod']
  }

  static get availableInclude() {
    return ['spbu', 'island', 'shift']
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
      payment_method_uuid: model.payment_method_uuid,
      value: model.value,
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

  includePaymentMethod(model) {
    return this.item(model.getRelated('paymentMethod'), PaymentMethodTransformer)
  }
}

module.exports = ReportPaymentTransformer
