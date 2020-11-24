'use strict'

const Spbu = use('App/Models/Spbu')
const User = use('App/Models/User')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const SpbuTransformer = use('App/Transformers/V1/SpbuTransformer')

class SpbuController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(Spbu.query(), request.all(), ['name', 'address', 'phone', 'code'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await transform.paginate(builder, SpbuTransformer)

        return response.status(200).json(baseResp(true, data, 'Data SPBU sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            address: 'required',
            phone: 'required|number',
            code: 'required|unique:spbu'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let spbu = new Spbu()
        try {
            spbu.uuid = uuid()
            spbu.name = req.name
            spbu.address = req.address
            spbu.phone = req.phone
            spbu.code = req.code
            await spbu.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        spbu = await transform.item(spbu, SpbuTransformer)

        return response.status(200).json(baseResp(true, spbu, 'Membuat SPBU Baru'))
    }

    async update({ request, response, transform }) {
        console.log(request.all())
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.address) rules['address'] = 'required'
        if (req.phone) rules['phone'] = 'required|number'
        if (req.code) rules['code'] = `required|unique:spbu,code,uuid,${req.uuid}|max:254`
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let spbu
        try {
            spbu = await Spbu.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) spbu.name = req.name
            if (req.address) spbu.address = req.address
            if (req.code) spbu.code = req.code
            if (req.phone) spbu.phone = req.phone
            await spbu.save()
        } catch (error) {
            console.log(error);
            
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        spbu = await transform.item(spbu, SpbuTransformer)

        return response.status(200).json(baseResp(true, spbu, 'Mengedit SPBU ' + spbu.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let spbu
        try {
            spbu = await Spbu.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!spbu) return response.status(400).json(baseResp(false, [], 'SPBU tidak ditemukan'))

        await spbu.delete()
        await User.query().where('spbu_uuid', req.uuid).delete()

        spbu = await transform.item(spbu, SpbuTransformer)

        return response.status(200).json(baseResp(true, spbu, 'Menghapus SPBU ' + spbu.name))
    }
}

module.exports = SpbuController
