'use strict'

const Role = use('App/Models/Role')
const Shift = use('App/Models/Shift')
const SpbuPayment = use('App/Models/SpbuPayment')
const Island = use('App/Models/Island')
const Nozzle = use('App/Models/Nozzle')
const User = use('App/Models/User')
const Product = use('App/Models/Product')
const PaymentMethod = use('App/Models/PaymentMethod')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const ReportCoWorker = use('App/Models/ReportCoWorker')
const ReportIsland = use('App/Models/ReportIsland')
const { validate } = use('Validator')
const { baseResp, uploadImage, setReportShift, setReportSpbu, getShiftBefore, getShiftAfter } = use('App/Helpers')
const uuid = use('uuid-random')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const moment = use('moment')
const Database = use('Database')
const _ = use("lodash")
const uuid_validate = use('uuid-validate')
const Helpers = use('Helpers')

class OperatorReportController {

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

    async getShift({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const shift = await Shift.query().where('spbu_uuid', req.spbu_uuid).orderBy('no_order', 'asc').fetch()
        const data = await transform.collection(shift, ShiftTransformer)
        const lastShift = shift.toJSON().slice(-1)[0]

        const yesterdayLastReport = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).subtract(1, "days").format('YYYY-MM-DD')).where('shift_uuid', lastShift.uuid).first()

        const reportShift = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).format('YYYY-MM-DD'))
        var lastReport = yesterdayLastReport || null
        if (reportShift.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                let selectedShift = null
                let status = false
                reportShift.forEach(report => {
                    if (shift.uuid === report.shift_uuid) {
                        status = report.status_operator
                        selectedShift = report
                    }
                })

                if (lastReport == null) {
                    const checkIslandRunning = await ReportIsland.query().where('spbu_uuid', req.spbu_uuid).where('shift_uuid', shift.uuid).where('date', moment(req.date).format('YYYY-MM-DD')).getCount()
                    shift.done = status
                    shift.disable = (checkIslandRunning > 0)? false : !status
                } else {
                    shift.done = status
                    shift.disable = (lastReport.status_operator) ? false : true
                }
                lastReport = selectedShift
            }
        } else {
            let status = false
            let yesterdayHasDone = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).subtract(1, "days").format('YYYY-MM-DD')).where('status_operator', true).count()
            if (yesterdayHasDone[0].count > 0) {
                status = true
            }
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                shift.done = false
                shift.disable = (i == 0 && status)? false : status
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data Shift Report sukses diterima'))
    }

    async getIsland({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const island = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = await transform.collection(island, IslandTransformer)

        const reportIsland = await Database.table('report_islands').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).format('YYYY-MM-DD')).where('shift_uuid', req.shift_uuid)
        
        if (reportIsland.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const island = data[i];
                let status = false
                reportIsland.forEach(report => { if (island.uuid === report.island_uuid) status = report.status_operator })
                island.done = status
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const island = data[i];
                island.done = false
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data Island Report sukses diterima'))
    }

    async getNozzle({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
            island_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const nozzle = await Nozzle.query().where('spbu_uuid', req.spbu_uuid).where('island_uuid', req.island_uuid).fetch()
        let data = []
        for (let i = 0; i < nozzle.toJSON().length; i++) {
            const nzl = nozzle.toJSON()[i];
            const getProduct = await Product.query().where('uuid', nzl.product_uuid).first()
            const product = getProduct.toJSON() || null
            if (product) {
                nzl['product_name'] = product.name
            }
            const reportNozzle = await ReportNozzle.query()
            .where('spbu_uuid', req.spbu_uuid)
            .where('island_uuid', req.island_uuid)
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
            data.push(nzl)
        }

        return response.status(200).json(baseResp(true, data, 'Data laporan pompa sukses diterima'))
    }

    async getPayment({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
            island_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const payment = await SpbuPayment.query().where('spbu_uuid', req.spbu_uuid).with('payment').fetch()
        let data = []
        for (let i = 0; i < payment.toJSON().length; i++) {
            const pymnt = payment.toJSON()[i];
            let dataPayment = pymnt.payment
            const reportPayment = await ReportPayment.query()
            .where('spbu_uuid', req.spbu_uuid)
            .where('island_uuid', req.island_uuid)
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
            data.push(dataPayment)
        }

        return response.status(200).json(baseResp(true, data, 'Data laporan pembayaran sukses diterima'))
    }

    async getCoWorker({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
            island_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const co_worker = await User.query().where('spbu_uuid', req.spbu_uuid).where('role_uuid', '0bec0af4-a32f-4b1e-bfc2-5f4933c49740').fetch()
        var data = {
            data: [],
            checklist: []
        }
        for (let i = 0; i < co_worker.toJSON().length; i++) {
            const co_work = co_worker.toJSON()[i];
            co_work['checked'] = false
            let checked = await ReportCoWorker.query()
                .where('spbu_uuid', req.spbu_uuid)
                .where('island_uuid', req.island_uuid)
                .where('shift_uuid', req.shift_uuid)
                .where('user_uuid', co_work.uuid)
                .where('date', moment(req.date).format('YYYY-MM-DD'))
                .getCount()
            if (checked > 0) {
                co_work['checked'] = true
                data.checklist.push(co_work.uuid)
            }
            data.data.push(co_work)
        }
        return response.status(200).json(baseResp(true, data, 'Data laporan rekan kerja sukses diterima'))
    }

    async store({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            island_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Check if report island is exist
            var reportIsland = await ReportIsland.query().where({
                'spbu_uuid': req.spbu_uuid,
                'island_uuid': req.island_uuid,
                'shift_uuid': req.shift_uuid,
                'date': req.date,
            }).first()
            if (reportIsland) return response.status(400).json(baseResp(false, [], 'Laporan Island ini sudah di isi'))
            // Get Shift Before
            var shiftBefore = await getShiftBefore(req.spbu_uuid, req.shift_uuid, req.date)
            // Insert Data Nozzle
            if (!req.report_nozzle) throw new Error('Tolong Laporan Pompa di isi terlebih dahulu')
            let qNozzle = await Nozzle.query().where({
                spbu_uuid: req.spbu_uuid, 
                island_uuid: req.island_uuid, 
            }).fetch()
            let getNozzle = qNozzle.toJSON()
            var listNozzle = []
            for (let i = 0; i < getNozzle.length; i++) {
                const row = getNozzle[i];
                listNozzle.push(row.uuid)
            }
            await Promise.all(_.map(req.report_nozzle, async (item, key) => {
                // Check Value
                if(!item.nozzle_uuid || !item.last_meter) throw new Error('Data Pompa Ada Yang Belum Lengkap')
                // Get Nozzle
                let getNozzle = await Nozzle.query().where('uuid', item.nozzle_uuid).with('product').fetch()
                let nozzle = getNozzle.toJSON()[0]
                if (!nozzle) throw new Error('Ada data pompa yang tidak ditemukan')
                // Check Image
                if(!request.file(`report_nozzle[${key}][image]`)) throw new Error('Gambar Pada Pompa ' + nozzle.name + ' Harap di cantumkan')
                // Upload Image
                let image = await uploadImage(request, `report_nozzle[${key}][image]`, 'report-nozzle/')
                imagePath.push(image)
                // Processing
                // Checking report last shift
                let start_meter = 0
                let price = nozzle.product.price || 0
                let volume = 0
                let total_price = 0
                if (shiftBefore.shift) {
                    let before = await ReportNozzle.query().where({
                        'spbu_uuid': req.spbu_uuid,
                        'island_uuid': req.island_uuid,
                        'shift_uuid': shiftBefore.shift.uuid,
                        'date': moment(shiftBefore.date).format('YYYY-MM-DD'),
                    }).first()
                    // Report available
                    if (before) {
                        start_meter = before.last_meter
                    } else {
                        start_meter = nozzle.start_meter
                    }
                }
                if (item.last_meter < start_meter) throw new Error('Meteran akhir Pompa ' + nozzle.code + ' kurang dari meteran awal')
                volume = item.last_meter - start_meter
                total_price = volume * price
                // Insert Data
                let data_nozzle = await ReportNozzle.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'nozzle_uuid': item.nozzle_uuid,
                    'start_meter': start_meter,
                    'last_meter': item.last_meter,
                    'price': price,
                    'total_price': total_price,
                    'image': image,
                    'date': req.date,
                })
                if (!data_nozzle) throw new Error('Gagal dalam mengisi data pompa')
                _.pull(listNozzle, item.nozzle_uuid)

            }))
            if (!_.isEmpty(listNozzle)) {
                let nozzle = await Nozzle.query().where('uuid', listNozzle[0]).first()
                throw new Error('Data Pompa (' + nozzle.name + ') Belom di isi')
            }
            // Insert Data Payment
            if (!req.report_payment) throw new Error('Tolong Laporan Pembayaran di isi terlebih dahulu')
            let qPayment = await SpbuPayment.query().where({
                spbu_uuid: req.spbu_uuid
            }).fetch()
            let getPayment = qPayment.toJSON()
            var listPayment = []
            for (let i = 0; i < getPayment.length; i++) {
                const row = getPayment[i];
                listPayment.push(row.payment_uuid)
            }
            await Promise.all(_.map(req.report_payment, async (item, key) => {
                // Check Value
                if(!item.payment_method_uuid || !item.amount) throw new Error('Data Pembayaran Ada Yang Belum Lengkap')
                // Get Payment Method
                let payment_method = await PaymentMethod.query().where('uuid', item.payment_method_uuid).first()
                if (!payment_method) throw new Error('Ada data metode pembayaran yang tidak ditemukan')
                // // Check Image
                // if(payment_method.image_required && !request.file(`report_payment[${key}][image]`)) throw new Error('Gambar Pada Metode Pembayaran ' + payment_method.name + ' Harap di cantumkan')
                // // Upload Image
                // let image = null
                // if (request.file(`report_payment[${key}][image]`)) {
                //     image = await uploadImage(request, `report_payment[${key}][image]`, 'report-payment-method/')
                //     imagePath.push(image)
                // }
                // Insert Data
                let data_payment_method = await ReportPayment.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'payment_method_uuid': item.payment_method_uuid,
                    'amount': item.amount,
                    'image': null,
                    'date': req.date,
                })
                if (!data_payment_method) throw new Error('Gagal dalam mengisi data pembayaran')
                _.pull(listPayment, item.payment_method_uuid)
            }))
            if (!_.isEmpty(listPayment)) {
                let payment_method = await PaymentMethod.query().where('uuid', listPayment[0]).first()
                throw new Error('Data Pembayaran (' + payment_method.name + ') Belom di isi')
            }

            // Insert Data Co Worker
            if (!req.report_co_worker) throw new Error('Tolong Rekan Kerja di isi terlebih dahulu')
            await Promise.all(_.map(req.report_co_worker, async (item, key) => {
                // Check Value
                if(!item) return item
                if(!uuid_validate(item)) return item
                // Get User
                let user = await User.query().where('uuid', item).first()
                if (!user) throw new Error('Ada data rekan kerja yang tidak ditemukan')
                // Insert Data
                let data_co_worker = await ReportCoWorker.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'user_uuid': item,
                    'date': req.date,
                })
                if (!data_co_worker) throw new Error('Gagal dalam mengisi data rekan kerja')
            }))

            let saveReportIsland = await ReportIsland.create({
                'uuid': uuid(),
                'spbu_uuid': req.spbu_uuid,
                'island_uuid': req.island_uuid,
                'shift_uuid': req.shift_uuid,
                'operator_uuid': auth.user.uuid,
                'date': req.date,
                'status_operator': true
            })

            await setReportShift(req.shift_uuid, req.spbu_uuid, req.date)

            await setReportSpbu(req.spbu_uuid, req.date)

            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            await Database.table('report_nozzles').where('date', moment(req.date).format('YYYY-MM-DD')).where('spbu_uuid', req.spbu_uuid).where('shift_uuid', req.shift_uuid).where('island_uuid', req.island_uuid).delete()
            await Database.table('report_payments').where('date', moment(req.date).format('YYYY-MM-DD')).where('spbu_uuid', req.spbu_uuid).where('shift_uuid', req.shift_uuid).where('island_uuid', req.island_uuid).delete()
            await Database.table('report_co_workers').where('date', moment(req.date).format('YYYY-MM-DD')).where('spbu_uuid', req.spbu_uuid).where('shift_uuid', req.shift_uuid).where('island_uuid', req.island_uuid).delete()
            await Database.table('report_islands').where('date', moment(req.date).format('YYYY-MM-DD')).where('spbu_uuid', req.spbu_uuid).where('shift_uuid', req.shift_uuid).where('island_uuid', req.island_uuid).delete()
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }
}

module.exports = OperatorReportController
