'use strict'

const PaymentMethod = use('App/Models/PaymentMethod')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const PaymentMethodTransformer = use('App/Transformers/V1/PaymentMethodTransformer')

class PaymentMethodController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(PaymentMethod.query(), request.all(), ['name', 'code'])
        const data = await transform.paginate(builder.data, PaymentMethodTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Metode Pembayaran sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            code: 'required|unique:payment_methods',
            image_required: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let role = new PaymentMethod()
        try {
            role.uuid = uuid()
            role.name = req.name
            role.code = req.code
            role.image_required = req.image_required
            role.slug = await slugify(req.name, 'payment_methods', 'slug')
            await role.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        role = await transform.item(role, PaymentMethodTransformer)

        return response.status(200).json(baseResp(true, role, 'Membuat Metode Pembayaran Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.code) rules['code'] = `required|unique:payment_methods,code,uuid,${req.uuid}|max:254`
        if (req.image_required) rules['image_required'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let payment
        try {
            payment = await PaymentMethod.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (payment.name != req.name) {
                payment.name = req.name
                payment.slug = await slugify(req.name, 'payment_methods', 'slug')
            }
            if (req.name && payment.code != req.name) payment.code = req.code
            if (req.image_required) payment.image_required = req.image_required
            await payment.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        payment = await transform.item(payment, PaymentMethodTransformer)

        return response.status(200).json(baseResp(true, payment, 'Mengedit Metode Pembayaran ' + payment.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let payment
        try {
            payment = await PaymentMethod.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!payment) return response.status(400).json(baseResp(false, [], 'Metode Pembayaran tidak ditemukan'))

        await payment.delete()

        payment = await transform.item(payment, PaymentMethodTransformer)

        return response.status(200).json(baseResp(true, payment, 'Menghapus Metode Pembayaran ' + payment.name))
    }
}

module.exports = PaymentMethodController
