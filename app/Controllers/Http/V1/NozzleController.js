'use strict'

const Nozzle = use('App/Models/Nozzle')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const NozzleTransformer = use('App/Transformers/V1/NozzleTransformer')

class NozzleController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Nozzle.query(), request.all(), ['name', 'code', 'product_uuid'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, NozzleTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Pompa sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            island_uuid: 'required',
            product_uuid: 'required',
            name: 'required|max:254',
            code: 'required|unique:nozzles|max:254'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let nozzle = new Nozzle()
        try {
            nozzle.uuid = uuid()
            nozzle.spbu_uuid = req.spbu_uuid
            nozzle.island_uuid = req.island_uuid
            nozzle.product_uuid = req.product_uuid
            nozzle.name = req.name
            nozzle.code = req.code
            await nozzle.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        nozzle = await transform.item(nozzle, NozzleTransformer)

        return response.status(200).json(baseResp(true, nozzle, 'Membuat Pompa Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.product_uuid) rules['product_uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.code) rules['code'] = `required|unique:nozzles,code,uuid,${req.uuid}|max:254`
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let nozzle
        try {
            nozzle = await Nozzle.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.product_uuid) nozzle.product_uuid = req.product_uuid
            if (req.name) nozzle.name = req.name
            if (req.code) nozzle.code = req.code
            await nozzle.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        nozzle = await transform.item(nozzle, NozzleTransformer)

        return response.status(200).json(baseResp(true, nozzle, 'Mengedit Pompa ' + nozzle.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let nozzle
        try {
            nozzle = await Nozzle.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!nozzle) return response.status(400).json(baseResp(false, [], 'Pompa tidak ditemukan'))

        await nozzle.delete()

        nozzle = await transform.item(nozzle, NozzleTransformer)

        return response.status(200).json(baseResp(true, nozzle, 'Menghapus Pompa ' + nozzle.name))
    }
}

module.exports = NozzleController
