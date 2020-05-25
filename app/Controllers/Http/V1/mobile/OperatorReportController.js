'use strict'

const Shift = use('App/Models/Shift')
const Island = use('App/Models/Island')
const Nozzle = use('App/Models/Nozzle')
const User = use('App/Models/User')
const PaymentMethod = use('App/Models/PaymentMethod')
const Product = use('App/Models/Product')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const ReportCoWorker = use('App/Models/ReportCoWorker')
const ReportIsland = use('App/Models/ReportIsland')
const { validate } = use('Validator')
const { baseResp, uploadImage, setReportShift, setReportSpbu } = use('App/Helpers')
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
        if (reportShift.length > 0) {
            let lastReport = yesterdayLastReport || null
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
                    shift.done = status
                    shift.disable = !status
                } else {
                    shift.done = status
                    shift.disable = (lastReport.status_operator) ? false : true
                }
                lastReport = selectedShift
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                shift.done = false
                shift.disable = false
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
            // Insert Data Nozzle
            if (!req.report_nozzle) throw new Error('Tolong Laporan Pompa di isi terlebih dahulu')
            await Promise.all(_.map(req.report_nozzle, async (item, key) => {
                // Check Value
                if(!item.nozzle_uuid || !item.last_meter) throw new Error('Data Pompa Ada Yang Belum Lengkap')
                // Get Nozzle
                let nozzle = await Nozzle.query().where('uuid', item.nozzle_uuid).first()
                if (!nozzle) throw new Error('Ada data pompa yang tidak ditemukan')
                // Check Image
                if(!request.file(`report_nozzle[${key}][image]`)) throw new Error('Gambar Pada Pompa ' + nozzle.name + ' Harap di cantumkan')
                // Upload Image
                let image = await uploadImage(request, `report_nozzle[${key}][image]`, 'report-nozzle/')
                imagePath.push(image)
                // Insert Data
                let data_nozzle = await ReportNozzle.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'nozzle_uuid': item.nozzle_uuid,
                    'last_meter': item.last_meter,
                    'image': image,
                    'date': req.date,
                })
                if (!data_nozzle) throw new Error('Gagal dalam mengisi data pompa')
            }))

            // Insert Data Payment
            if (!req.report_payment) throw new Error('Tolong Laporan Pembayaran di isi terlebih dahulu')
            await Promise.all(_.map(req.report_payment, async (item, key) => {
                // Check Value
                if(!item.payment_method_uuid || !item.amount) throw new Error('Data Pembayaran Ada Yang Belum Lengkap')
                // Get Payment Method
                let payment_method = await PaymentMethod.query().where('uuid', item.payment_method_uuid).first()
                if (!payment_method) throw new Error('Ada data metode pembayaran yang tidak ditemukan')
                // Check Image
                if(payment_method.image_required && !request.file(`report_payment[${key}][image]`)) throw new Error('Gambar Pada Metode Pembayaran ' + payment_method.name + ' Harap di cantumkan')
                // Upload Image
                let image = null
                if (request.file(`report_payment[${key}][image]`)) {
                    image = await uploadImage(request, `report_payment[${key}][image]`, 'report-payment-method/')
                    imagePath.push(image)
                }
                // Insert Data
                let data_payment_method = await ReportPayment.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': req.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'payment_method_uuid': item.payment_method_uuid,
                    'amount': item.amount,
                    'image': image,
                    'date': req.date,
                })
                if (!data_payment_method) throw new Error('Gagal dalam mengisi data pembayaran')
            }))

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

            var report_island = await ReportIsland.create({
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
