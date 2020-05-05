'use strict'

const SpbuPayment = use('App/Models/SpbuPayment')
const Spbu = use('App/Models/Spbu')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const SpbuPaymentTransformer = use('App/Transformers/V1/SpbuPaymentTransformer')

class SpbuPaymentController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(SpbuPayment.query(), request.all(), ['spbu_uuid', 'payment_uuid'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await transform.paginate(builder, SpbuPaymentTransformer)

        return response.status(200).json(baseResp(true, data, 'Metode Pembayaran SPBU sukses diterima'))
    }

    async update({ request, response }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let payment
        const deletePayment = await SpbuPayment.query().where('spbu_uuid', req.spbu_uuid).delete()

        let dataPayment
        if (Array.isArray(req.payment_uuid)) dataPayment = req.payment_uuid
        try {
            let convertArrayOne = JSON.parse(req.payment_uuid)
            if (Array.isArray(convertArrayOne)) dataPayment = convertArrayOne
        } catch (error) {
            try {
                let convertArrayTwo = req.payment_uuid.split(',')
                if (Array.isArray(convertArrayTwo)) dataPayment = convertArrayTwo
            } catch (error) {
                console.log(error);
            }
        }

        if (dataPayment.length > 0) {
            for (let i = 0; i < dataPayment.length; i++) {
                const payment = new SpbuPayment()
                payment.uuid = uuid()
                payment.spbu_uuid = req.spbu_uuid
                payment.payment_uuid = dataPayment[i]
                await payment.save()
            }
        }

        // shift = await transform.item(shift, ShiftTransformer)

        return response.status(200).json(baseResp(true, null, 'Mengedit Metode Payment SPBU'))
    }
}

module.exports = SpbuPaymentController
