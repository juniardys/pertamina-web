'use strict'

const Island = use('App/Models/Island')
const SpbuPayment = use('App/Models/SpbuPayment')
const FeederTank = use('App/Models/FeederTank')
const Nozzle = use('App/Models/Nozzle')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const ReportFeederTank = use('App/Models/ReportFeederTank')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const ReportCoWorker = use('App/Models/ReportCoWorker')
const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const moment = use('moment')
const _ = use('lodash')

class ReportController {
    async index({ response, request, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const getIsland = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = {
            island: await transform.collection(getIsland, IslandTransformer),
            feeder_tank: [],
            total_sales: [],
            total_finance: [],
        }
        // Feeder Tank
        const feeder_tank = await FeederTank.query().where('spbu_uuid', req.spbu_uuid).with('product').fetch()
        for (let i = 0; i < feeder_tank.toJSON().length; i++) {
            const feeder = feeder_tank.toJSON()[i];
            const reportFeederTank = await ReportFeederTank.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('shift_uuid', req.shift_uuid)
                .where('feeder_tank_uuid', feeder.uuid)
                .where('date', moment(req.date).format('YYYY-MM-DD'))
                .first()

            if (!reportFeederTank) {
                feeder['data'] = null
            } else {
                feeder['data'] = reportFeederTank.toJSON()
                feeder['data']['date'] = moment(reportFeederTank.toJSON()['date']).format('YYYY-MM-DD HH:mm:ss')
            }
            data.feeder_tank.push(feeder)
        }
        // Island
        for (let index = 0; index < data.island.length; index++) {
            const island = data.island[index]
            island['nozzle'] = new Array()
            island['payment'] = new Array()
            island['co_worker'] = {
                data: [],
                checklist: []
            }
            // Get Nozzle
            const nozzle = await Nozzle.query().where('spbu_uuid', req.spbu_uuid).where('island_uuid', island.uuid).fetch()
            for (let i = 0; i < nozzle.toJSON().length; i++) {
                const nzl = nozzle.toJSON()[i];
                const getProduct = await Product.query().where('uuid', nzl.product_uuid).first()
                const product = getProduct.toJSON() || null
                if (product) {
                    nzl['product_name'] = product.name
                }
                const reportNozzle = await ReportNozzle.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('island_uuid', island.uuid)
                    .where('shift_uuid', req.shift_uuid)
                    .where('nozzle_uuid', nzl.uuid)
                    .where('date', moment(req.date).format('YYYY-MM-DD'))
                    .first()

                if (!reportNozzle) {
                    nzl['data'] = null
                } else {
                    nzl['data'] = reportNozzle.toJSON()
                    nzl['data']['date'] = moment(reportNozzle.toJSON()['date']).format('YYYY-MM-DD HH:mm:ss')
                }
                island['nozzle'].push(nzl)
            }
            // Get Payment
            const payment = await SpbuPayment.query().where('spbu_uuid', req.spbu_uuid).with('payment').fetch()
            for (let i = 0; i < payment.toJSON().length; i++) {
                const pymnt = payment.toJSON()[i];
                let dataPayment = pymnt.payment
                const reportPayment = await ReportPayment.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('island_uuid', island.uuid)
                    .where('shift_uuid', req.shift_uuid)
                    .where('payment_method_uuid', dataPayment.uuid)
                    .where('date', moment(req.date).format('YYYY-MM-DD'))
                    .first()

                if (!reportPayment) {
                    dataPayment['data'] = null
                } else {
                    dataPayment['data'] = reportPayment.toJSON()
                    dataPayment['data']['date'] = moment(reportPayment.toJSON()['date']).format('YYYY-MM-DD HH:mm:ss')
                }
                island['payment'].push(dataPayment)
            }
            // Get Co Worker
            const co_worker = await User.query().where('spbu_uuid', req.spbu_uuid).where('role_uuid', '0bec0af4-a32f-4b1e-bfc2-5f4933c49740').fetch()
            for (let i = 0; i < co_worker.toJSON().length; i++) {
                const co_work = co_worker.toJSON()[i];
                co_work['checked'] = false
                let checked = await ReportCoWorker.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('island_uuid', island.uuid)
                    .where('shift_uuid', req.shift_uuid)
                    .where('user_uuid', co_work.uuid)
                    .where('date', moment(req.date).format('YYYY-MM-DD'))
                    .getCount()
                if (checked > 0) {
                    co_work['checked'] = true
                    island['co_worker'].checklist.push(co_work.uuid)
                    island['co_worker'].data.push(co_work)
                }
            }
        }
        // Total Sales
        const products = await Product
            .query()
            .whereHas('nozzle', (builder) => {
                builder.where('spbu_uuid', req.spbu_uuid)
            }).fetch()
        for (let index = 0; index < products.toJSON().length; index++) {
            const product = products.toJSON()[index]
            const sales = {
                product_uuid: product.uuid,
                product_name: product.name,
                volume: 0,
                total_price: 0
            }
            const nozzle = await Nozzle.query().where('spbu_uuid', req.spbu_uuid).where('product_uuid', product.uuid).fetch()
            for (let i = 0; i < nozzle.toJSON().length; i++) {
                const nzl = nozzle.toJSON()[i]
                const reportNozzle = await ReportNozzle.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('shift_uuid', req.shift_uuid)
                    .where('nozzle_uuid', nzl.uuid)
                    .where('date', moment(req.date).format('YYYY-MM-DD'))
                    .fetch()
                const volume = _.sumBy(reportNozzle.toJSON(), 'volume')
                const total_price = _.sumBy(reportNozzle.toJSON(), 'total_price')
                sales.volume += volume
                sales.total_price += total_price
            }
            data.total_sales.push(sales)
        }
        const payments = await SpbuPayment.query().where('spbu_uuid', req.spbu_uuid).with('payment').fetch()
        for (let i = 0; i < payments.toJSON().length; i++) {
            const payment = payments.toJSON()[i];
            const finance = {
                payment_uuid: payment.payment.uuid,
                payment_name: payment.payment.name,
                amount: 0
            }
            const reportPayment = await ReportPayment.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('shift_uuid', req.shift_uuid)
                .where('payment_method_uuid', payment.payment.uuid)
                .where('date', moment(req.date).format('YYYY-MM-DD'))
                .fetch()
            const amount = _.sumBy(reportPayment.toJSON(), 'amount')
            finance.amount += amount
            data.total_finance.push(finance)
        }
        // Total Finance
        return response.status(200).json(baseResp(true, data, 'Data laporan sukses diterima'))
    }
}

module.exports = ReportController
