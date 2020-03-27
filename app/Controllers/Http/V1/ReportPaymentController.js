'use strict'

const ReportPayment = use('App/Models/ReportPayment')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ReportPaymentTransformer = use('App/Transformers/V1/ReportPaymentTransformer')
const Database = use('Database')

class ReportPaymentController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(ReportPayment.query(), request.all(), ['spbu_uuid', 'island_uuid', 'shift_uuid', 'payment_method_uuid', 'value', 'date'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, ReportPaymentTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Laporan Pembayaran sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            island_uuid: 'required',
            shift_uuid: 'required',
            date: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let report = []
        let countError = 0
        const trx = await Database.beginTransaction()
        for (let i = 0; i < req.payment_method_uuid.length; i++) {
            const payment_method_uuid = req.payment_method_uuid[i];
            const value = req.value[i];
            const validation = await validate({ value }, { value: 'required|number' })
            if (validation.fails()) {
                await trx.rollback()
                return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
            }

            let data = new ReportPayment()
            try {
                data.uuid = uuid()
                data.spbu_uuid = req.spbu_uuid
                data.island_uuid = req.island_uuid
                data.shift_uuid = req.shift_uuid
                data.payment_method_uuid = payment_method_uuid
                data.value = value
                data.date = req.date
            } catch (error) {
                // console.log(error);
                countError++
            }
        }

        if (countError > 0) {
            await trx.rollback()
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada input data'))
        } else {
            await trx.commit()
            const payments = await transform.collection(report, ReportPaymentTransformer)

            return response.status(200).json(baseResp(true, payments, 'Membuat Laporan Pembayaran'))
        }
    }

    async update({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required', value: 'required|number', date: 'required' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let payment
        try {
            payment = await ReportPayment.query()
                .where('uuid', req.uuid).with('payment_method')
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            payment.value = req.value
            payment.date = req.date
            await payment.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        payment = await transform.item(payment, ReportPaymentTransformer)

        return response.status(200).json(baseResp(true, payment, 'Mengedit Laporan Pembayaran ' + payment.payment_method.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let payment
        try {
            payment = await ReportPayment.query()
                .where('uuid', req.uuid).with('payment_method')
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!payment) return response.status(400).json(baseResp(false, [], 'Laporan Pembayaran tidak ditemukan'))
        await payment.delete()

        payment = await transform.item(payment, ReportPaymentTransformer)

        return response.status(200).json(baseResp(true, payment, 'Menghapus Laporan Pembayaran ' + payment.payment_method.name))
    }
}

module.exports = ReportPaymentController
