'use strict'

const Role = use('App/Models/Role')
const AccessList = use('App/Models/AccessList')
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
        const data = await transform.include(request.get().with).paginate(builder, RoleTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Jabatan sukses diterima'))
    }

    async storeAcl(role, acl) {
        await AccessList.query().where('role_uuid', role.uuid).where('type', 'role').delete()
        await acl.forEach(async function (acc) {
            const access = new AccessList()
            access.uuid = uuid()
            access.type = 'role'
            access.role_uuid = role.uuid
            access.access = acc
            await access.save()
            console.log(access.toJSON());
        })
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))
        
        let role = new Role()
        try {
            role.uuid = uuid()
            role.name = req.name
            role.description = req.description
            await role.save()
            if (req.acl) {
                let acl
                (Array.isArray(req.acl)) ?  acl = req.acl : acl = JSON.parse(req.acl.replace(/'/g, '"'))
                await this.storeAcl(role, acl)
            }
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        role = await transform.include('accessList').item(Role.query().where('uuid', role.uuid).with('accessList').first(), RoleTransformer)

        return response.status(200).json(baseResp(true, role, 'Membuat Jabatan Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = this.getRules()
        rules['uuid'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let role
        try {
            role = await Role.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            role.name = req.name
            role.description = req.description
            await role.save()
            if (req.acl) {
                let acl
                (Array.isArray(req.acl)) ?  acl = req.acl : acl = JSON.parse(req.acl.replace(/'/g, '"'))
                await this.storeAcl(role, acl)
            }
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        role = await transform.include('accessList').item(Role.query().where('uuid', role.uuid).with('accessList').first(), RoleTransformer)

        return response.status(200).json(baseResp(true, role, 'Mengedit Jabatan ' + role.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let role
        try {
            role = await Role.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (role.id == 1) return response.status(400).json(baseResp(false, [], 'Tidak Bisa Menghapus Jabatan'))

        await role.delete()

        role = await transform.item(role, RoleTransformer)

        return response.status(200).json(baseResp(true, role, 'Menghapus Jabatan ' + role.name))
    }
}

module.exports = RoleController
