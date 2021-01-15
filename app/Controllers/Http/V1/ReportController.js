'use strict'

const Island = use('App/Models/Island')
const Shift = use('App/Models/Shift')
const SpbuPayment = use('App/Models/SpbuPayment')
const FeederTank = use('App/Models/FeederTank')
const Nozzle = use('App/Models/Nozzle')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const ReportFeederTank = use('App/Models/ReportFeederTank')
const ReportIsland = use('App/Models/ReportIsland')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const ReportCoWorker = use('App/Models/ReportCoWorker')
const { validate } = use('Validator')
const { baseResp, uploadImage, getShiftBefore, getShiftAfter } = use('App/Helpers')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const moment = use('moment')
const _ = use('lodash')
const db = use('Database')
const Helpers = use('Helpers')
const SpreadSheet = use('SpreadSheet')
const numeral = use('numeral')

class ReportController {

    async deleteImages(path = []) {
        for (let i = 0; i < path.length; i++) {
            const fs = Helpers.promisify(require('fs'))
            try {
                await fs.unlink(Helpers.publicPath(path[i]))
            } catch (error) {
                // console.log(error)
            }
        }
    }

    async index({ response, request, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const getIsland = await Island.query().where('spbu_uuid', req.spbu_uuid).orderBy('name', 'asc').fetch()
        const data = {
            island: await transform.collection(getIsland, IslandTransformer),
            feeder_tank: [],
            total_sales: [],
            total_finance: [],
        }
        // Feeder Tank
        const feeder_tank = await FeederTank.query().where('spbu_uuid', req.spbu_uuid).with('product').orderBy('name', 'asc').fetch()
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
                const reportNozzle = await ReportNozzle.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('shift_uuid', req.shift_uuid)
                    .where('date', moment(req.date).format('YYYY-MM-DD'))
                    .whereHas('nozzle', (q) => {
                        q.where('feeder_tank_uuid', feeder.uuid)
                    })
                    .fetch()
                feeder['data']['sales'] = _.sumBy(reportNozzle.toJSON(), item => Number(item.volume)) || 0
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
            // Get Report Island
            const reportIsland = await ReportIsland.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('island_uuid', island.uuid)
                .where('shift_uuid', req.shift_uuid)
                .where('date', moment(req.date).format('YYYY-MM-DD'))
                .first()
            if (reportIsland) {
                island['report_data'] = reportIsland.toJSON()
                const getOperator = await db.table('users')
                    .where('uuid', island['report_data'].operator_uuid)
                    .first()
                island['report_data']['operator'] = (getOperator)? getOperator : null
            } else {
                island['report_data'] = null
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
                sales.volume += parseFloat(volume) || 0
                sales.total_price += parseFloat(total_price) || 0
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
            finance.amount += parseInt(amount)
            data.total_finance.push(finance)
        }
        // Total Finance
        return response.status(200).json(baseResp(true, data, 'Data laporan sukses diterima'))
    }

    async updateNozzle({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            uuid: 'required',
            last_meter: 'required|number'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Get Shift Before
            var shiftBefore = await getShiftBefore(req.spbu_uuid, req.shift_uuid, req.date)
            // Get Shift After
            var shiftAfter = await getShiftAfter(req.spbu_uuid, req.shift_uuid, req.date)
            // Get Report Nozzle
            let nozzle = await ReportNozzle.query().where('uuid', req.uuid).first()
            if (!nozzle) throw new Error('Data pompa tidak ditemukan')
            let dataNozzle = await Nozzle.query().where('uuid', nozzle.nozzle_uuid).first()
            if (!dataNozzle) throw new Error('Data pompa tidak ditemukan')
            // Check Image
            if(request.file(`image`)) {
                // Upload Image
                let image = await uploadImage(request, `image`, 'report-nozzle/')
                imagePath.push(image)
                nozzle.image = image
            }
            // Processing
            // Checking report last shift
            let start_meter = nozzle.start_meter || 0
            let price = nozzle.price || 0
            let volume = (nozzle.last_meter - start_meter) || 0
            let total_price = nozzle.total_price || 0
            if (shiftBefore.shift) {
                let before = await ReportNozzle.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': nozzle.island_uuid,
                    'shift_uuid': shiftBefore.shift.uuid,
                    'nozzle_uuid': nozzle.nozzle_uuid,
                    'date': moment(shiftBefore.date).format('YYYY-MM-DD'),
                }).first()
                // Report available
                if (before) {
                    start_meter = before.last_meter
                } else {
                    start_meter = nozzle.start_meter
                }
            }
            if (req.last_meter < start_meter) throw new Error('Pompa (' + dataNozzle.code + ') meteran akhirnya kurang dari meteran awal (' + start_meter + ')')
            volume = req.last_meter - start_meter
            total_price = volume * price
            // Update Data
            nozzle.start_meter = start_meter
            nozzle.total_price = parseInt(total_price) || 0
            nozzle.last_meter = req.last_meter
            await nozzle.save()
            // Updating Shift After if exist
            if (shiftAfter.shift) {
                let after = await ReportNozzle.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': nozzle.island_uuid,
                    'shift_uuid': shiftAfter.shift.uuid,
                    'date': moment(shiftAfter.date).format('YYYY-MM-DD'),
                }).first()
                if (after) {
                    // Initialization
                    start_meter = req.last_meter || 0
                    price = after.price || 0
                    volume = (after.last_meter - start_meter) || 0
                    total_price = after.total_price || 0
                    // Calculation
                    volume = after.last_meter - start_meter
                    total_price = volume * price
                    // Update Data
                    after.start_meter = start_meter
                    after.total_price = parseInt(total_price) || 0
                    await after.save()
                }
            }
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            await this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updatePayment({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            uuid: 'required',
            amount: 'required|number',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Get Payment Method
            let payment_method = await ReportPayment.query().where('uuid', req.uuid).first()
            if (!payment_method) throw new Error('Data laporan metode pembayaran tidak ditemukan')
            // // Upload Image
            // if (request.file(`image`)) {
            //     payment_method.image = await uploadImage(request, `image`, 'report-payment-method/')
            //     imagePath.push(image)
            // }
            // Update Data
            payment_method.amount = req.amount
            await payment_method.save()
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            await this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updateFeederTank({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            uuid: 'required',
            last_meter: 'required|number'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        try {
            // Get Shift Before
            var shiftBefore = await getShiftBefore(req.spbu_uuid, req.shift_uuid, req.date)
            // Get Shift After
            var shiftAfter = await getShiftAfter(req.spbu_uuid, req.shift_uuid, req.date)
            // Get Report Feeder Tank
            let feeder_tank = await ReportFeederTank.query().where('uuid', req.uuid).first()
            if (!feeder_tank) throw new Error('Data tangki tidak ditemukan')
            let getFeederTank = await FeederTank.query().where('uuid', feeder_tank.feeder_tank_uuid).with('product').fetch()
            let dataFeederTank = getFeederTank.toJSON()[0] || null
            if (!dataFeederTank) throw new Error('Data tangki tidak ditemukan')
            // Processing
            // Checking report last shift
            let start_meter = feeder_tank.start_meter || 0
            if (shiftBefore.shift) {
                let before = await ReportFeederTank.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'shift_uuid': shiftBefore.shift.uuid,
                    'feeder_tank_uuid': feeder_tank.feeder_tank_uuid,
                    'date': moment(shiftBefore.date).format('YYYY-MM-DD'),
                }).first()
                // Report available
                if (before) {
                    start_meter = before.last_meter
                } else {
                    start_meter = feeder_tank.start_meter
                }
            }
            // Update Data
            feeder_tank.last_meter = req.last_meter
            await feeder_tank.save()
            // Updating Shift After if exist
            if (shiftAfter.shift) {
                let after = await ReportFeederTank.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'shift_uuid': shiftAfter.shift.uuid,
                    'date': moment(shiftAfter.date).format('YYYY-MM-DD'),
                }).first()
                if (after) {
                    // Initialization
                    start_meter = req.last_meter || 0
                    // Update Data
                    after.start_meter = start_meter
                    await after.save()
                }
            }
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async getReportLosis({ response, request, transform }){
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            feeder_tank_uuid: 'required',
            startDate: 'required',
            endDate: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const data = []
        const shifts = await Shift.query().where('spbu_uuid', req.spbu_uuid).orderBy('no_order', 'asc').fetch()

        var startDate = moment(req.startDate, 'YYYY-MM-DD');
        var endDate = moment(req.endDate, 'YYYY-MM-DD');
        for (var date = moment(startDate); date.diff(endDate, 'days') <= 0; date.add(1, 'days')) {
            var item = {}
            item.date = date.format('YYYY-MM-DD')
            item.feeder_tank = await FeederTank.query().where('spbu_uuid', req.spbu_uuid).where('uuid', req.feeder_tank_uuid).with('product').first()
            item.report = {
                start_meter: 0,
                last_meter: 0,
                addition_amount: 0,
                volume: 0,
                sales: 0
            }
            for (let index = 0; index < shifts.toJSON().length; index++) {
                const shift = shifts.toJSON()[index];
                const reportFeederTank = await ReportFeederTank.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('shift_uuid', shift.uuid)
                    .where('feeder_tank_uuid', req.feeder_tank_uuid)
                    .where('date', date.format('YYYY-MM-DD'))
                    .first()
                if (reportFeederTank) {
                    if (index == 0) item.report.start_meter = reportFeederTank.start_meter
                    item.report.last_meter = reportFeederTank.last_meter
                    item.report.addition_amount += reportFeederTank.addition_amount
                }
            }
            item.report.volume = item.report.last_meter - (item.report.start_meter + item.report.addition_amount)
            const reportNozzle = await ReportNozzle.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('date', moment(date).format('YYYY-MM-DD'))
                .whereHas('nozzle', (q) => {
                    q.where('feeder_tank_uuid', req.feeder_tank_uuid)
                })
                .fetch()
            item.report.sales = _.sumBy(reportNozzle.toJSON(), item => Number(item.volume)) || 0
            data.push(item)
        }

        return response.status(200).json(baseResp(true, data, 'Data laporan sukses diterima'))
    }

	async losisExportExcel({ request, view, response, auth }){
		const req = request.all()
		const excel = new SpreadSheet(response, 'xlsx')
        var dataExcel = []
        
        const data = []
        const shifts = await Shift.query().where('spbu_uuid', req.spbu_uuid).orderBy('no_order', 'asc').fetch()

        var startDate = moment(req.startDate, 'YYYY-MM-DD');
        var endDate = moment(req.endDate, 'YYYY-MM-DD');
        for (var date = moment(startDate); date.diff(endDate, 'days') <= 0; date.add(1, 'days')) {
            var item = {}
            item.date = date.format('YYYY-MM-DD')
            item.feeder_tank = await FeederTank.query().where('spbu_uuid', req.spbu_uuid).where('uuid', req.feeder_tank_uuid).with('product').first()
            item.report = {
                start_meter: 0,
                last_meter: 0,
                addition_amount: 0,
                volume: 0,
                sales: 0
            }
            for (let index = 0; index < shifts.toJSON().length; index++) {
                const shift = shifts.toJSON()[index];
                const reportFeederTank = await ReportFeederTank.query()
                    .where('spbu_uuid', req.spbu_uuid)
                    .where('shift_uuid', shift.uuid)
                    .where('feeder_tank_uuid', req.feeder_tank_uuid)
                    .where('date', date.format('YYYY-MM-DD'))
                    .first()
                if (reportFeederTank) {
                    if (index == 0) item.report.start_meter = reportFeederTank.start_meter
                    item.report.last_meter = reportFeederTank.last_meter
                    item.report.addition_amount += reportFeederTank.addition_amount
                }
            }
            item.report.volume = item.report.last_meter - (item.report.start_meter + item.report.addition_amount)
            const reportNozzle = await ReportNozzle.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('date', moment(date).format('YYYY-MM-DD'))
                .whereHas('nozzle', (q) => {
                    q.where('feeder_tank_uuid', req.feeder_tank_uuid)
                })
                .fetch()
            item.report.sales = _.sumBy(reportNozzle.toJSON(), item => Number(item.volume)) || 0
            data.push(item)
        }

		var headers = []
		headers.push('Tanggal')
		headers.push('Produk')
		headers.push('Meteran Awal')
		headers.push('Pembelian')
		headers.push('Meteran Akhir')
		headers.push('Volume')
		headers.push('Penjualan')
		headers.push('Losis')

        dataExcel.push(headers)
        
        data.forEach((item, i) => {
            var items = []
            items.push(item.date)
            items.push(item.feeder_tank.toJSON().product == null ? '-' : item.feeder_tank.toJSON().product.name || '-')
            items.push((item.report == null ? 0 : numeral(item.report.start_meter).format('0,0')))
            items.push((item.report == null ? 0 : numeral(item.report.addition_amount).format('0,0')))
            items.push((item.report == null ? 0 : numeral(item.report.last_meter).format('0,0')))
            items.push((item.report == null ? 0 : numeral(item.report.volume).format('0,0')))
            items.push((item.report == null ? 0 : numeral(item.report.sales).format('0,0')))
            items.push((item.report == null ? 0 : numeral(item.report.sales + item.report.volume).format('0,0')))
            dataExcel.push(items)
        })

        dataExcel.push([
            '',
            '',
            '',
            '',
            'Total',
            numeral(_.sumBy(data, item => Number(item.report.volume))).format('0,0'),
            numeral(_.sumBy(data, item => Number(item.report.sales))).format('0,0'),
            numeral(_.sumBy(data, item => Number((item.report.sales + item.report.volume)))).format('0,0'),
        ])

		excel.addSheet('Losis', dataExcel)
		excel.download('Data Losis')
	}

}

module.exports = ReportController
