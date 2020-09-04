'use strict'

const User = use('App/Models/User')
const Shift = use('App/Models/Shift')
const Order = use('App/Models/Order')
const Delivery = use('App/Models/Delivery')
const ReportFeederTank = use('App/Models/ReportFeederTank')
const { validate } = use('Validator')
const { queryBuilder, baseResp, uploadImage, pushNotification } = use('App/Helpers')
const uuid = use('uuid-random')
const DeliveryTransformer = use('App/Transformers/V1/DeliveryTransformer')
const Helpers = use('Helpers')
const moment = use('moment')
const Helper = use('App/Helpers')

class DeliveryController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Delivery.query(), request.all(), ['spbu_uuid', 'order_uuid', 'shift_uuid', 'quantity', 'receipt_date', 'receipt_no', 'police_no', 'driver', 'receiver'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, DeliveryTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Pengiriman sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            order_uuid: 'required',
            shift_uuid: 'required',
            quantity: 'required|number',
            receipt_date: 'required|date',
            receipt_no: 'required',
            police_no: 'required',
            driver: 'required',
            feeder_tank_uuid: 'feeder_tank_uuid'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let delivery = new Delivery()
        try {
            delivery.uuid = uuid()
            delivery.spbu_uuid = req.spbu_uuid
            delivery.shift_uuid = req.shift_uuid
            delivery.order_uuid = req.order_uuid
            delivery.quantity = req.quantity
            delivery.receipt_date = req.receipt_date
            delivery.receipt_no = req.receipt_no
            delivery.police_no = req.police_no
            delivery.driver = req.driver
            delivery.receiver = req.receiver
            delivery.feeder_tank_uuid = req.feeder_tank_uuid
            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'delivery/')
                if (upload) {
                    if (delivery.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        try {
                            await fs.unlink(Helpers.publicPath(delivery.image))
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    delivery.image = upload
                } else {
                    return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                }
            }
            await delivery.save()
            // Set Order Status
            await Helper.setOrderStatus(req.order_uuid)
            // Add addition amount to report feeder tank
            const order = await Order.query().where('uuid', delivery.order_uuid).first()
            const reportFeederTank = await ReportFeederTank.query().where({
                spbu_uuid: delivery.spbu_uuid,
                shift_uuid: delivery.shift_uuid,
                feeder_tank_uuid: delivery.feeder_tank_uuid,
                date: moment(delivery.receipt_date).format('YYYY-MM-DD')
            }).first()
            // Add addition amount
            if (reportFeederTank) {
                reportFeederTank.addition_amount += parseFloat(delivery.quantity) || 0
                await reportFeederTank.save()
            }

            const shift = await Shift.query().where('uuid', req.shift_uuid).first()
            const admins = await User.query().where({
                spbu_uuid: req.spbu_uuid,
                role_uuid: '45982947-346a-43d6-9204-78202ad970ab'
            }).fetch()

            for (let i = 0; i < admins.toJSON().length; i++) {
                const admin = admins.toJSON()[i];
                let title = 'Pengiriman Baru!'
                let body = 'Terdapat pengiriman baru untuk pemesanan (' + order.order_no + ') pada tgl ' + req.receipt_date + ', ' + shift.name
                await pushNotification(admin.uuid, title, body)
            }
        } catch (error) {
            return response.status(400).json(baseResp(false, [], error.message))
        }

        delivery = await transform.item(delivery, DeliveryTransformer)

        return response.status(200).json(baseResp(true, delivery, 'Membuat Pengiriman Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.spbu_uuid) rules['spbu_uuid'] = 'required'
        if (req.order_uuid) rules['order_uuid'] = 'required'
        if (req.shift_uuid) rules['shift_uuid'] = 'required'
        if (req.quantity) rules['quantity'] = 'required|number'
        if (req.receipt_date) rules['receipt_date'] = 'required|date'
        if (req.receipt_no) rules['receipt_no'] = 'required'
        if (req.police_no) rules['police_no'] = 'required'
        if (req.driver) rules['driver'] = 'required'
        if (req.feeder_tank_uuid) rules['feeder_tank_uuid'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let delivery
        try {
            delivery = await Delivery.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            let qty_before = parseFloat(delivery.quantity) || 0
            let feeder_tank_uuid_before = delivery.feeder_tank_uuid
            if (req.spbu_uuid) delivery.spbu_uuid = req.spbu_uuid
            if (req.shift_uuid) delivery.shift_uuid = req.shift_uuid
            if (req.order_uuid) delivery.order_uuid = req.order_uuid
            if (req.quantity) delivery.quantity = req.quantity
            if (req.receipt_date) delivery.receipt_date = req.receipt_date
            if (req.receipt_no) delivery.receipt_no = req.receipt_no
            if (req.police_no) delivery.police_no = req.police_no
            if (req.driver) delivery.driver = req.driver
            if (req.receiver) delivery.receiver = req.receiver
            if (req.feeder_tank_uuid) delivery.feeder_tank_uuid = req.feeder_tank_uuid
            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'delivery/')
                if (upload) {
                    if (delivery.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        try {
                            await fs.unlink(Helpers.publicPath(delivery.image))
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    delivery.image = upload
                } else {
                    return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                }
            }
            await delivery.save()
            // Set Order Status
            await Helper.setOrderStatus(req.order_uuid)
            // Update addition amount from report feeder tank
            const order = await Order.query().where('uuid', delivery.order_uuid).first()
            if (feeder_tank_uuid_before != delivery.feeder_tank_uuid) {
                const reportFeederTankBefore = await ReportFeederTank.query().where({
                    spbu_uuid: delivery.spbu_uuid,
                    shift_uuid: delivery.shift_uuid,
                    feeder_tank_uuid: feeder_tank_uuid_before,
                    date: moment(delivery.receipt_date).format('YYYY-MM-DD')
                }).first()
                if (reportFeederTankBefore) {
                    reportFeederTankBefore.addition_amount -= qty_before
                }
            }
            const reportFeederTank = await ReportFeederTank.query().where({
                spbu_uuid: delivery.spbu_uuid,
                shift_uuid: delivery.shift_uuid,
                feeder_tank_uuid: delivery.feeder_tank_uuid,
                date: moment(delivery.receipt_date).format('YYYY-MM-DD')
            }).first()
            // Update quantity
            if (reportFeederTank) {
                let quantity = (parseFloat(delivery.quantity) || 0)
                if (feeder_tank_uuid_before == delivery.feeder_tank_uuid) quantity -= qty_before
                reportFeederTank.addition_amount += quantity
                await reportFeederTank.save()
            }
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        delivery = await transform.item(delivery, DeliveryTransformer)

        return response.status(200).json(baseResp(true, delivery, 'Mengedit Pengiriman ' + delivery.receipt_no))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        let delivery
        try {
            delivery = await Delivery.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!delivery) return response.status(400).json(baseResp(false, [], 'Pengiriman tidak ditemukan'))

        if (delivery.image != null) {
            const fs = Helpers.promisify(require('fs'))
            try {
                await fs.unlink(Helpers.publicPath(delivery.image))
            } catch (error) {
                console.log(error)
            }
        }
        // Remove addition amount from report feeder tank
        const order = await Order.query().where('uuid', delivery.order_uuid).first()
        const reportFeederTank = await ReportFeederTank.query().where({
            spbu_uuid: delivery.spbu_uuid,
            shift_uuid: delivery.shift_uuid,
            feeder_tank_uuid: delivery.feeder_tank_uuid,
            date: moment(delivery.receipt_date).format('YYYY-MM-DD')
        }).first()
        // Subtract addition amount
        if (reportFeederTank) {
            let quantity = parseFloat(delivery.quantity) || 0
            reportFeederTank.addition_amount -= quantity
            await reportFeederTank.save()
        }
        let order_uuid = delivery.order_uuid
        await delivery.delete()
        // Set Order Status
        await Helper.setOrderStatus(order_uuid)

        delivery = await transform.item(delivery, DeliveryTransformer)

        return response.status(200).json(baseResp(true, delivery, 'Menghapus Pengiriman ' + delivery.receipt_no))
    }
}

module.exports = DeliveryController
