'use strict'

const Delivery = use('App/Models/Delivery')
const { validate } = use('Validator')
const { queryBuilder, baseResp, uploadImage } = use('App/Helpers')
const uuid = use('uuid-random')
const DeliveryTransformer = use('App/Transformers/V1/DeliveryTransformer')
const Helpers = use('Helpers')

class DeliveryController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Delivery.query(), request.all(), ['spbu_uuid', 'order_uuid', 'quantity', 'receipt_date', 'receipt_no', 'police_no', 'driver', 'receiver'])
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
            quantity: 'required|number',
            receipt_date: 'required|date',
            receipt_no: 'required',
            police_no: 'required',
            driver: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let delivery = new Delivery()
        try {
            delivery.uuid = uuid()
            delivery.spbu_uuid = req.spbu_uuid
            delivery.order_uuid = req.order_uuid
            delivery.quantity = req.quantity
            delivery.receipt_date = req.receipt_date
            delivery.receipt_no = req.receipt_no
            delivery.police_no = req.police_no
            delivery.driver = req.driver
            delivery.receiver = req.receiver
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
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
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
        if (req.quantity) rules['quantity'] = 'required|number'
        if (req.receipt_date) rules['receipt_date'] = 'required|date'
        if (req.receipt_no) rules['receipt_no'] = 'required'
        if (req.police_no) rules['police_no'] = 'required'
        if (req.driver) rules['driver'] = 'required'
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
            if (req.spbu_uuid) delivery.spbu_uuid = req.spbu_uuid
            if (req.order_uuid) delivery.order_uuid = req.order_uuid
            if (req.quantity) delivery.quantity = req.quantity
            if (req.receipt_date) delivery.receipt_date = req.receipt_date
            if (req.receipt_no) delivery.receipt_no = req.receipt_no
            if (req.police_no) delivery.police_no = req.police_no
            if (req.driver) delivery.driver = req.driver
            if (req.receiver) delivery.receiver = req.receiver
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
        } catch (error) {
            console.log(error);
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
        await delivery.delete()

        delivery = await transform.item(delivery, DeliveryTransformer)

        return response.status(200).json(baseResp(true, delivery, 'Menghapus Pengiriman ' + delivery.receipt_no))
    }
}

module.exports = DeliveryController
