'use strict'

const Shift = use('App/Models/Shift')
const Island = use('App/Models/Island')
const FeederTank = use('App/Models/FeederTank')
const Nozzle = use('App/Models/Nozzle')
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
const { baseResp, uploadImage, setReportShift, setReportSpbu } = use('App/Helpers')
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
            } else {
                throw new Error('Laporan Shift ini harus di isi operator terlebih dahulu')
            }
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
                // Get Nozzle
                let feeder_tank = await FeederTank.query().where('uuid', item.feeder_tank_uuid).first()
                if (!feeder_tank) throw new Error('Ada data Tangki Utama yang tidak ditemukan')
                // Check Image
                if(!request.file(`report_feeder[${key}][image]`)) throw new Error('Gambar Pada Tangki Utama ' + feeder_tank.name + ' Harap di cantumkan')
                // Upload Image
                let image = await uploadImage(request, `report_feeder[${key}][image]`, 'report-feeder-tank/')
                imagePath.push(image)
                // Insert Data
                let data_feeder_tank = await ReportFeederTank.create({
                    'uuid': uuid(),
                    'spbu_uuid': req.spbu_uuid,
                    'shift_uuid': req.shift_uuid,
                    'feeder_tank_uuid': item.feeder_tank_uuid,
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

            // Edit Data Nozzle
            if (!req.report_nozzle) throw new Error('Tolong Laporan Pompa di isi terlebih dahulu')
            await Promise.all(_.map(req.report_nozzle, async (item, key) => {
                // Check Value
                if(!item.uuid || !item.last_meter) return item
                // Get Report Nozzle
                let nozzle = await ReportNozzle.query().where('uuid', item.uuid).first()
                if (!nozzle) throw new Error('Ada data pompa yang tidak ditemukan')
                // Check Image
                if(request.file(`report_nozzle[${key}][image]`)) {
                    nozzle.image = await uploadImage(request, `report_nozzle[${key}][image]`, 'report-nozzle/')
                    imagePath.push(image)
                }
                // Upload Image
                // Update Data
                nozzle.last_meter = item.last_meter
                await nozzle.save()
            }))

            // Edit Data Payment
            if (!req.report_payment) throw new Error('Tolong Laporan Pembayaran di isi terlebih dahulu')
            await Promise.all(_.map(req.report_payment, async (item, key) => {
                // Check Value
                if(!item.uuid || !item.amount) return item
                // Get Payment Method
                let payment_method = await ReportPayment.query().where('uuid', item.uuid).first()
                if (!payment_method) throw new Error('Ada data metode pembayaran yang tidak ditemukan')
                // Upload Image
                if (request.file(`report_payment[${key}][image]`)) {
                    payment_method.image = await uploadImage(request, `report_payment[${key}][image]`, 'report-payment-method/')
                    imagePath.push(image)
                }
                // Update Data
                payment_method.amount = item.amount
                await payment_method.save()
            }))

            // Edit Data Co Worker
            if (!req.report_co_worker) throw new Error('Tolong Rekan Kerja di isi terlebih dahulu')
            await Promise.all(_.map(req.report_co_worker, async (co_work) => {
                if (!co_work.island_uuid) return co_work
                if (co_work.user_uuid) {
                    await Promise.all(_.map(co_work.user_uuid, async (item, key) => {
                        // Check Value
                        if(!item) return item
                        if(!uuid_validate(item)) return item
                        // Get User
                        let user = await User.query().where('uuid', item).first()
                        if (!user) throw new Error('Ada data rekan kerja yang tidak ditemukan')
                        // Check Data Report
                        let checkReport = await ReportCoWorker.query().where({
                            'spbu_uuid': req.spbu_uuid,
                            'island_uuid': co_work.island_uuid,
                            'shift_uuid': req.shift_uuid,
                            'user_uuid': item,
                            'date': req.date,
                        }).first()
                        if (!checkReport) {
                            // Insert Data
                            await ReportCoWorker.create({
                                'uuid': uuid(),
                                'spbu_uuid': req.spbu_uuid,
                                'island_uuid': co_work.island_uuid,
                                'shift_uuid': req.shift_uuid,
                                'user_uuid': item,
                                'date': req.date,
                            })
                        }
                    }))
                }
                // Remove uncheckable
                await ReportCoWorker.query().where({
                    'spbu_uuid': req.spbu_uuid,
                    'island_uuid': co_work.island_uuid,
                    'shift_uuid': req.shift_uuid,
                    'date': req.date,
                }).whereNotIn('user_uuid', co_work.user_uuid).delete()
            }))

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
