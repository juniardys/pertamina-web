'use strict'

const Role = use('App/Models/Role')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const RoleTransformer = use('App/Transformers/V1/RoleTransformer')

class RoleController {
    getRules() {
        let rules = {
            name: 'required|max:254'
        }

        return rules 
    }

    async get({ request, response, transform }) {
        const builder = await queryBuilder(Role.query(), request.all(), ['name', 'description'])
        let data
        (builder.paginate) ? data = await transform.paginate(builder.data, RoleTransformer) : data = await transform.item(builder.data, RoleTransformer)
        
        return response.status(200).json(baseResp(false, data, 'Data Jabatan sukses diterima'))
    }

    async store({ request, response }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const role = new Role()
        role.uuid = uuid()
        role.name = req.name
        role.description = req.description
        role.slug = await slugify(req.name, 'roles', 'slug')
        await role.save()

        return response.status(200).json(baseResp(true, role, 'Membuat Jabatan Baru'))
    }

    async update({ request, response }) {
        const req = request.all()
        let rules = this.getRules()
        rules['uuid'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const role = await Role.query()
            .where('uuid', req.uuid)
            .first()

        if (role.name != req.name) {
            role.name = req.name
            role.slug = await slugify(req.name, 'roles', 'slug')
        }
        role.description = req.description
        await role.save()

        return response.status(200).json(baseResp(true, role, 'Mengedit Jabatan ' + role.name))
    }

    async delete({ request, response }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const role = await Role.query()
            .where('uuid', req.uuid)
            .first()

        if (!role) return response.status(400).json(baseResp(false, [], 'Jabatan tidak ditemukan'))

        await role.delete()

        return response.status(200).json(baseResp(true, role, 'Menghapus Jabatan ' + role.name))
    }
}

module.exports = RoleController
