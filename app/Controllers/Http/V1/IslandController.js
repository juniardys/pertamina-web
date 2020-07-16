'use strict'

const Island = use('App/Models/Island')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')

class IslandController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Island.query(), request.all(), ['name', 'code'])
        const data = await transform.paginate(builder, IslandTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Island sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            name: 'required|max:254',
            code: 'required|max:254'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let island = new Island()
        try {
            island.uuid = uuid()
            island.spbu_uuid = req.spbu_uuid
            island.name = req.name
            island.code = req.code
            await island.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        island = await transform.item(island, IslandTransformer)

        return response.status(200).json(baseResp(true, island, 'Membuat Island Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.code) rules['code'] = `required|unique:islands,code,uuid,${req.uuid}|max:254`
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let island
        try {
            island = await Island.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) island.name = req.name
            if (req.code) island.code = req.code
            await island.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        island = await transform.item(island, IslandTransformer)

        return response.status(200).json(baseResp(true, island, 'Mengedit Island ' + island.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let island
        try {
            island = await Island.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!island) return response.status(400).json(baseResp(false, [], 'Island tidak ditemukan'))

        await island.delete()

        island = await transform.item(island, IslandTransformer)

        return response.status(200).json(baseResp(true, island, 'Menghapus Island ' + island.name))
    }
}

module.exports = IslandController
