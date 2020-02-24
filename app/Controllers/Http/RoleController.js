'use strict'

const Role = use('App/Models/Role')
const { validate } = use('Validator')
const { slugify } = use('App/Helpers')
const { makeResp } = use('App/Helpers/ApiHelper')
const uuid = use('uuid-random')

class RoleController {
    getRules() {
        let rules = {
            name: 'required|max:254'
        }

        return rules 
    }

    async get({ request, response }) {
        let roles = []
        let query = Role.query()
        if (request.get().order && request.get().order_val) query = query.orderBy(request.get().order, request.get().order_val);
        if (request.get().search) {
            if(request.get().search.split('-').length == 5) {
                query = query.where('uuid', request.get().search)
            } else {
                query = query.orWhere('name', 'LIKE', `%${request.get().search}%`)
                    .orWhere('description', 'LIKE', `%${request.get().search}%`)
            }
        }

        if (await query.getCount() == 1) {
            roles = await query.fetch()
        } else {
            roles = await query.paginate(request.get().page || 1, request.get().paginate || 20)
        }

        return response.status(400).json(makeResp(false, roles, 'Data Roles Retrieved Successfully'))
    }

    async store({ request, response }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

        const role = new Role()
        role.uuid = uuid()
        role.name = req.name
        role.description = req.description
        role.slug = await slugify(req.name, 'roles', 'slug')
        await role.save()

        return response.status(200).json(makeResp(true, role, 'Membuat Jabatan Baru'))
    }

    async update({ request, response }) {
        const req = request.all()
        let rules = this.getRules()
        rules['uuid'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

        const role = await Role.query()
            .where('uuid', req.uuid)
            .first()

        if (role.name != req.name) {
            role.name = req.name
            role.slug = await slugify(req.name, 'roles', 'slug')
        }
        role.description = req.description
        await role.save()

        return response.status(200).json(makeResp(true, role, 'Mengedit Jabatan ' + role.name))
    }

    async delete({ request, response }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

        const role = await Role.query()
            .where('uuid', req.uuid)
            .first()

        if (!role) return response.status(400).json(makeResp(false, [], 'Jabatan tidak ditemukan'))

        await role.delete()

        return response.status(200).json(makeResp(true, role, 'Menghapus Jabatan ' + role.name))
    }
}

module.exports = RoleController
