'use strict'

const Shift = use('App/Models/Shift')
const Spbu = use('App/Models/Spbu')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')

class ShiftController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Shift.query(), request.all(), ['name', 'start', 'end'])
        const data = await transform.paginate(builder, ShiftTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Shift sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            spbu_uuid: 'required',
            start: 'required',
            end: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let product = new Shift()
        try {
            product.uuid = uuid()
            product.spbu_uuid = req.spbu_uuid
            product.name = req.name
            product.start = req.start
            product.end = req.end
            await product.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        product = await transform.item(product, ShiftTransformer)

        return response.status(200).json(baseResp(true, product, 'Membuat Shift Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.start) rules['start'] = 'required'
        if (req.end) rules['end'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let shift
        try {
            shift = await Shift.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) shift.name = req.name
            if (req.start) shift.start = req.start
            if (req.end) shift.end = req.end
            await shift.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        shift = await transform.item(shift, ShiftTransformer)

        return response.status(200).json(baseResp(true, shift, 'Mengedit Shift ' + shift.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let product
        try {
            product = await Shift.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!product) return response.status(400).json(baseResp(false, [], 'Shift tidak ditemukan'))

        await product.delete()

        product = await transform.item(product, ShiftTransformer)

        return response.status(200).json(baseResp(true, product, 'Menghapus Shift ' + product.name))
    }
}

module.exports = ShiftController
