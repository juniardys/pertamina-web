'use strict'

const Shift = use('App/Models/Shift')
const Island = use('App/Models/Island')
const SpbuPayment = use('App/Models/SpbuPayment')
const FeederTank = use('App/Models/FeederTank')
const Nozzle = use('App/Models/Nozzle')
const Delivery = use('App/Models/Delivery')
const User = use('App/Models/User')
const PaymentMethod = use('App/Models/PaymentMethod')
const Product = use('App/Models/Product')
const ReportFeederTank = use('App/Models/ReportFeederTank')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const ReportCoWorker = use('App/Models/ReportCoWorker')
const ReportShift = use('App/Models/ReportShift')
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

class AdminReportController {

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
                let operator_status = false
                reportShift.forEach(report => {
                    if (shift.uuid === report.shift_uuid) {
                        operator_status = report.status_operator
                        status = report.status_admin
                        selectedShift = report
                    }
                })

                if (lastReport == null) {
                    shift.done = status
                    shift.disable = (operator_status)? false : !status
                } else {
                    shift.done = status
                    shift.disable = (lastReport.status_admin) ? false : true
                }
                shift.done_operator = operator_status
                lastReport = selectedShift
            }
        } else {
            let status = false
            let yesterdayHasDone = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).subtract(1, "days").format('YYYY-MM-DD')).where('status_admin', true).count()
            if (yesterdayHasDone[0].count > 0) {
                status = true
            }
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                shift.done_operator = false
                shift.done = false
                shift.disable = status
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data Shift Report sukses diterima'))
    }

    async getFeederTank({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const feeder_tank = await FeederTank.query().where('spbu_uuid', req.spbu_uuid).with('product').fetch()
        let data = []
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
            data.push(feeder)
        }

        return response.status(200).json(baseResp(true, data, 'Data laporan tangki utama sukses diterima'))
    }

    async getNozzle({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const getIsland = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = await transform.collection(getIsland, IslandTransformer)
        for (let index = 0; index < data.length; index++) {
            const island = data[index]
            island['nozzle'] = new Array()
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
        }

        return response.status(200).json(baseResp(true, data, 'Data laporan pompa sukses diterima'))
    }

    async getPayment({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const getIsland = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = await transform.collection(getIsland, IslandTransformer)
        for (let index = 0; index < data.length; index++) {
            const island = data[index]
            island['payment'] = new Array()
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
        }
        
        return response.status(200).json(baseResp(true, data, 'Data laporan pembayaran sukses diterima'))
    }

    async getCoWorker({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        const getIsland = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = await transform.collection(getIsland, IslandTransformer)
        for (let index = 0; index < data.length; index++) {
            const island = data[index]
            island['co_worker'] = {
                data: [],
                checklist: []
            }
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

        return response.status(200).json(baseResp(true, data, 'Data laporan rekan kerja sukses diterima'))
    }

    async getReviewData({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required',
            island_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        var data = {
            nozzle: [],
            payment: [],
            co_worker: {
                data: [],
                checklist: []
            },
        }
        // Get Nozzle
        const nozzle = await Nozzle.query().where('spbu_uuid', req.spbu_uuid).where('island_uuid', req.island_uuid).fetch()
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
            data['nozzle'].push(nzl)
        }
        // Get Payment
        const payment = await SpbuPayment.query().where('spbu_uuid', req.spbu_uuid).with('payment').fetch()
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
            data['payment'].push(dataPayment)
        }
        // Get Co Worker
        const co_worker = await User.query().where('spbu_uuid', req.spbu_uuid).where('role_uuid', '0bec0af4-a32f-4b1e-bfc2-5f4933c49740').fetch()
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
                data['co_worker'].checklist.push(co_work.uuid)
                data['co_worker'].data.push(co_work)
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data laporan rekan kerja sukses diterima'))
    }

    async updateNozzle({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Get Shift Before
            var shiftBefore = await getShiftBefore(req.spbu_uuid, req.shift_uuid, req.date)
            // Get Shift After
            var shiftAfter = await getShiftAfter(req.spbu_uuid, req.shift_uuid, req.date)
            // Edit Data Nozzle
            if (!req.report_nozzle) throw new Error('Tolong Laporan Pompa di isi terlebih dahulu')
            await Promise.all(_.map(req.report_nozzle, async (item, key) => {
                // Check Value
                if(!item.uuid || !item.last_meter) return item
                // Get Report Nozzle
                let nozzle = await ReportNozzle.query().where('uuid', item.uuid).first()
                if (!nozzle) throw new Error('Ada data pompa yang tidak ditemukan')
                let dataNozzle = await Nozzle.query().where('uuid', nozzle.nozzle_uuid).first()
                if (!dataNozzle) throw new Error('Ada data pompa yang tidak ditemukan')
                // Check Image
                if(request.file(`report_nozzle[${key}][image]`)) {
                    // Upload Image
                    let image = await uploadImage(request, `report_nozzle[${key}][image]`, 'report-nozzle/')
                    imagePath.push(image)
                    nozzle.image = image
                }
                // Processing
                // Checking report last shift
                var start_meter = nozzle.start_meter || 0
                var price = nozzle.price || 0
                var volume = (nozzle.last_meter - start_meter) || 0
                var total_price = nozzle.total_price || 0
                if (shiftBefore.shift) {
                    let before = await ReportNozzle.query().where({
                        'spbu_uuid': req.spbu_uuid,
                        'island_uuid': nozzle.island_uuid,
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
                if (item.last_meter < start_meter) throw new Error('Pompa (' + dataNozzle.code + ') meteran akhirnya kurang dari meteran awal (' + start_meter + ')')
                volume = item.last_meter - start_meter
                total_price = volume * price
                // Update Data
                nozzle.total_price = total_price
                nozzle.last_meter = item.last_meter
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
                        start_meter = item.last_meter || 0
                        price = after.price || 0
                        volume = (after.last_meter - start_meter) || 0
                        total_price = after.total_price || 0
                        // Calculation
                        volume = after.last_meter - start_meter
                        total_price = volume * price
                        // Update Data
                        after.start_meter = start_meter
                        after.total_price = total_price
                        await after.save()
                    }
                }
            }))
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updateNozzleItem({ request, response, transform, auth }) {
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
            nozzle.total_price = total_price
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
                    after.total_price = total_price
                    await after.save()
                }
            }
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updatePayment({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Edit Data Payment
            if (!req.report_payment) throw new Error('Tolong Laporan Pembayaran di isi terlebih dahulu')
            await Promise.all(_.map(req.report_payment, async (item, key) => {
                // Check Value
                if(!item.uuid || !item.amount) return item
                // Get Payment Method
                let payment_method = await ReportPayment.query().where('uuid', item.uuid).first()
                if (!payment_method) throw new Error('Ada data metode pembayaran yang tidak ditemukan')
                // // Upload Image
                // if (request.file(`report_payment[${key}][image]`)) {
                //     payment_method.image = await uploadImage(request, `report_payment[${key}][image]`, 'report-payment-method/')
                //     imagePath.push(image)
                // }
                // Update Data
                payment_method.amount = item.amount
                await payment_method.save()
            }))
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updatePaymentItem({ request, response, transform, auth }) {
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
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async updateCoWorker({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            island_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Edit Data Co Worker
            if (!req.user_uuid) throw new Error('Tolong isi setidaknya 1 rekan kerja')
            await Promise.all(_.map(req.user_uuid, async (item, key) => {
                // Check Value
                if(!item) return item
                if(!uuid_validate(item)) return item
                // Get User
                let user = await User.query().where('uuid', item).first()
                if (!user) return item
                // Check Data Report
                let checkReport = await ReportCoWorker.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'user_uuid': item,
                    'date': req.date,
                }).first()
                if (!checkReport) {
                    // Insert Data
                    await ReportCoWorker.create({
                        'uuid': uuid(),
                        'spbu_uuid': req.spbu_uuid,
                        'island_uuid': req.island_uuid,
                        'shift_uuid': req.shift_uuid,
                        'user_uuid': item,
                        'date': req.date,
                    })
                }
            }))
            // Remove uncheckable
            await ReportCoWorker.query().where({
                'spbu_uuid': req.spbu_uuid,
                'island_uuid': req.island_uuid,
                'shift_uuid': req.shift_uuid,
                'date': req.date,
            }).whereNotIn('user_uuid', req.user_uuid).delete()
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async removeCoWorker({ request, response, transform, auth }) {
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
            // Edit Data Co Worker
            if (!req.user_uuid) throw new Error('User Tidak ditemukan')
            let user = await User.query().where('uuid', req.user_uuid).first()
            if (!user) throw new Error('User tidak ditemukan')
            // Check Co Worker
            const count = await ReportCoWorker.query().where({
                'spbu_uuid': req.spbu_uuid,
                'island_uuid': req.island_uuid,
                'shift_uuid': req.shift_uuid,
                'date': moment(req.date).format('YYYY-MM-DD'),
            }).getCount()
            if (count < 2) throw new Error('Setidaknya harus ada 1 rekan kerja')
            // Remove uncheckable
            await ReportCoWorker.query().where({
                'spbu_uuid': req.spbu_uuid,
                'island_uuid': req.island_uuid,
                'shift_uuid': req.shift_uuid,
                'date': moment(req.date).format('YYYY-MM-DD'),
                'user_uuid': req.user_uuid
            }).delete()
            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], e.message))
        }
    }

    async store({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        var imagePath = []
        try {
            // Get Report Shift
            var reportShift = await ReportShift.query().where({
                date: req.date,
                shift_uuid: req.shift_uuid,
                spbu_uuid: req.spbu_uuid,
            }).first()
            if (reportShift) {
                if (reportShift.status_admin == true) throw new Error('Laporan Shift ini sudah di isi')
                if (reportShift.status_operator == false) throw new Error('Laporan Shift ini harus dilengkapi operator terlebih dahulu')
            } else {
                throw new Error('Laporan Shift ini harus di isi operator terlebih dahulu')
            }
            // Get Shift Before
            var shiftBefore = await getShiftBefore(req.spbu_uuid, req.shift_uuid, req.date)
            // Insert Data Feeder Tank
            if (!req.report_feeder) throw new Error('Tolong Laporan Tangki Utama di isi terlebih dahulu')
            let qFeederTank = await FeederTank.query().where({
                spbu_uuid: req.spbu_uuid, 
            }).fetch()
            let getFeederTank = qFeederTank.toJSON()
            var listFeederTank = []
            for (let i = 0; i < getFeederTank.length; i++) {
                const row = getFeederTank[i];
                listFeederTank.push(row.uuid)
            }
            await Promise.all(_.map(req.report_feeder, async (item, key) => {
                // Check Value
                if(!item.feeder_tank_uuid || !item.last_meter) throw new Error('Data Tangki Utama Ada Yang Belum Lengkap')
                // Get Feeder Tank
                let get_feeder_tank = await FeederTank.query().where('uuid', item.feeder_tank_uuid).with('product').fetch()
                let feeder_tank = get_feeder_tank.toJSON()[0]
                if (!feeder_tank) throw new Error('Ada data Tangki Utama yang tidak ditemukan')
                // Check Image
                if(!request.file(`report_feeder[${key}][image]`)) throw new Error('Gambar Pada Tangki Utama ' + feeder_tank.name + ' Harap di cantumkan')
                // Upload Image
                let image = await uploadImage(request, `report_feeder[${key}][image]`, 'report-feeder-tank/')
                imagePath.push(image)
                // Processing
                // Checking report last shift
                let start_meter = 0
                if (shiftBefore.shift) {
                    let before = await ReportFeederTank.query().where({
                        'spbu_uuid': req.spbu_uuid,
                        'shift_uuid': shiftBefore.shift.uuid,
                        'date': moment(shiftBefore.date).format('YYYY-MM-DD'),
                    }).first()
                    // Report available
                    if (before) {
                        start_meter = before.last_meter
                    } else {
                        start_meter = feeder_tank.start_meter
                    }
                }
                let getAddition = await Delivery.query().whereHas('order', (builder) => {
                    builder.where('spbu_uuid', req.spbu_uuid).where('product_uuid', feeder_tank.product.uuid)
                }).where({ spbu_uuid: req.spbu_uuid, shift_uuid: req.shift_uuid, receipt_date: moment(req.date).format('YYYY-MM-DD') }).fetch()
                let addition = _.sumBy(getAddition.toJSON(), 'quantity') || 0
                // Insert Data
                let data_feeder_tank = await ReportFeederTank.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'shift_uuid': req.shift_uuid,
                    'feeder_tank_uuid': item.feeder_tank_uuid,
                    'start_meter': start_meter,
                    'addition_amount': addition,
                    'last_meter': item.last_meter,
                    'image': image,
                    'date': req.date,
                })
                if (!data_feeder_tank) throw new Error('Gagal dalam mengisi data Tangki Utama')
                _.pull(listFeederTank, item.feeder_tank_uuid)
            }))
            if (!_.isEmpty(listFeederTank)) {
                let feeder_tank = await FeederTank.query().where('uuid', listFeederTank[0]).first()
                throw new Error('Data Tangki Utama (' + feeder_tank.name + ') Belom di isi')
            }

            reportShift.admin_acc =  auth.user.uuid
            reportShift.status_admin =  true

            await reportShift.save()

            await setReportSpbu(req.spbu_uuid, req.date, true)

            return response.status(200).json(baseResp(true, [], 'Data Berhasil Disimpan'))
        } catch (e) {
            // Rollback
            this.deleteImages(imagePath)
            await Database.table('report_feeder_tanks').where('date', moment(req.date).format('YYYY-MM-DD')).where('spbu_uuid', req.spbu_uuid).where('shift_uuid', req.shift_uuid).delete()
            return response.status(400).json(baseResp(false, [], e.message))
        }

    }
}

module.exports = AdminReportController
