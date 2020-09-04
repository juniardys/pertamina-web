'use strict'

const Order = use('App/Models/Order')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const OrderTransformer = use('App/Transformers/V1/OrderTransformer')
const Database = use('Database')

class OrderController {
    async get({ request, response, transform }) {
        const req = request.all()
        var query = Order.query()
        if (req.status == 'ongoing') {
            query = query.where('quantity', '>', (builder) => {
                builder.from('deliveries')
                    .select(Database.raw("coalesce(sum(quantity), 0) as quantity"))
                    .whereRaw('order_uuid = orders.uuid')
            })
        } else if (req.status == 'done') {
            query = query.where('quantity', '<=', (builder) => {
                builder.from('deliveries')
                    .select(Database.raw("coalesce(sum(quantity), 0) as quantity"))
                    .whereRaw('order_uuid = orders.uuid')
            })
        }
        const builder = await queryBuilder(query, request.all(), ['spbu_uuid', 'product_uuid', 'order_date', 'order_no', 'quantity'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, OrderTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Pemesanan sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            product_uuid: 'required',
            order_date: 'required|date',
            order_no: 'required|max:254',
            quantity: 'required|number'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let order = new Order()
        try {
            order.uuid = uuid()
            order.spbu_uuid = req.spbu_uuid
            order.product_uuid = req.product_uuid
            order.order_date = req.order_date
            order.order_no = req.order_no
            order.quantity = req.quantity
            order.status = 'pending'
            await order.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        order = await transform.include(['spbu', 'product']).item(order, OrderTransformer)

        return response.status(200).json(baseResp(true, order, 'Membuat Pemesanan Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.spbu_uuid) rules['spbu_uuid'] = 'required'
        if (req.product_uuid) rules['product_uuid'] = 'required'
        if (req.order_date) rules['order_date'] = 'required|date'
        if (req.order_no) rules['order_no'] = 'required|max:254'
        if (req.quantity) rules['quantity'] = 'required|number'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let order
        try {
            order = await Order.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.spbu_uuid) order.spbu_uuid = req.spbu_uuid
            if (req.product_uuid) order.product_uuid = req.product_uuid
            if (req.order_date) order.order_date = req.order_date
            if (req.order_no) order.order_no = req.order_no
            if (req.quantity) order.quantity = req.quantity
            await order.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        order = await transform.include(['spbu', 'product']).item(order, OrderTransformer)

        return response.status(200).json(baseResp(true, order, 'Mengedit Pemesanan ' + order.order_no))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let order
        try {
            order = await Order.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!order) return response.status(400).json(baseResp(false, [], 'Pemesanan tidak ditemukan'))

        await order.delete()

        order = await transform.item(order, OrderTransformer)

        return response.status(200).json(baseResp(true, order, 'Menghapus Pemesanan ' + order.order_no))
    }
}

module.exports = OrderController
