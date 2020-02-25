'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')

class UserController {
    getRules() {
        return {
            name: 'required|max:254',
            email: 'required|email|max:254',
            password: 'required|min:8|max254',
            roles_uuid: 'required',
            phone: 'number'
        }
    }

    async get({ request, response }) {
        const data = await queryBuilder(Role.query(), request.all(), ['name', 'phone', 'address']) 

        return response.status(200).json(baseResp(false, data, 'Data Pengguna sukses diterima'))
    }

    async store({ request, response }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const user = new User()
        user.uuid = uuid()
        user.roles_uuid = req.roles_uuid
        user.spbu_uuid = req.spbu_uuid
        user.name = req.name
        user.email = req.email
        user.password = req.password
        user.phone = req.phone
        user.address = req.address
        await user.save()

        return response.status(200).json(baseResp(true, user, 'Membuat Pengguna Baru'))
    }

    async update({ request, response }) {
        const req = request.all()
        let rules = this.getRules()
        rules['uuid'] = 'required'
        rules['email'] = rules['password'] = ''
        if (req.email) rules['email'] = 'required|email|max:254'
        if (req.password) rules['password'] = 'required|min:8|max254'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const user = await User.query()
            .where('uuid', req.uuid)
            .first()

        user.roles_uuid = req.roles_uuid
        user.spbu_uuid = req.spbu_uuid
        user.name = req.name
        if (req.email) user.email = req.email
        if (req.password) user.password = req.password
        user.phone = req.phone
        user.address = req.address
        await user.save()

        return response.status(200).json(baseResp(true, user, 'Mengedit Pengguna ' + user.name))
    }

    async delete({ request, response }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const user = await User.query()
            .where('uuid', req.uuid)
            .first()

        if (!user) return response.status(400).json(baseResp(false, [], 'Pengguna tidak ditemukan'))

        await user.delete()

        return response.status(200).json(baseResp(true, user, 'Menghapus Pengguna ' + user.name))
    }
}

module.exports = UserController
