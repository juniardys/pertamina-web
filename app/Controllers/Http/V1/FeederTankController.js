'use strict'

const FeederTank = use('App/Models/FeederTank')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const FeederTankTransformer = use('App/Transformers/V1/FeederTankTransformer')
const moment = use('moment')

class FeederTankController {
    async get({ request, response, transform }) {
        const req = request.all()
        const builder = await queryBuilder(FeederTank.query(), request.all(), ['name', 'product_uuid', 'spbu_uuid'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, FeederTankTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Feeder Tank sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            spbu_uuid: 'required',
            product_uuid: 'required',
            start_meter: 'required|number',
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let tank = new FeederTank()
        try {
            tank.uuid = uuid()
            tank.spbu_uuid = req.spbu_uuid
            tank.name = req.name
            tank.product_uuid = req.product_uuid
            tank.start_meter = parseFloat(req.start_meter) || 0
            await tank.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        let transformer = transform
        if (req.custom_response) {
            let relation = req.custom_response.split(',')
            transformer = transformer.include(relation)
        }

        tank = await transformer.item(tank, FeederTankTransformer)

        return response.status(200).json(baseResp(true, tank, 'Membuat Feeder Tank Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.product_uuid) rules['product_uuid'] = 'required'
        if (req.start_meter) rules['start_meter'] = 'required|number'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let tank
        try {
            tank = await FeederTank.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) tank.name = req.name
            if (req.product_uuid) tank.product_uuid = req.product_uuid
            if (req.start_meter) tank.start_meter = req.start_meter
            await tank.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        let transformer = transform
        if (req.custom_response) {
            let relation = req.custom_response.split(',')
            transformer = transformer.include(relation)
        }

        tank = await transformer.item(tank, FeederTankTransformer)

        return response.status(200).json(baseResp(true, tank, 'Mengedit FeederTank ' + tank.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let tank
        try {
            tank = await FeederTank.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!tank) return response.status(400).json(baseResp(false, [], 'FeederTank tidak ditemukan'))

        await tank.delete()

        tank = await transform.item(tank, FeederTankTransformer)

        return response.status(200).json(baseResp(true, tank, 'Menghapus FeederTank ' + tank.name))
    }
}

module.exports = FeederTankController
