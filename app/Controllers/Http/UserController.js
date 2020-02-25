'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { makeResp } = use('App/Helpers/ApiHelper')

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
        let data = []
        let query = User.query()
        if (request.get().order && request.get().order_val) query = query.orderBy(request.get().order, request.get().order_val);
        if (request.get().filter && request.get().filter_val) query = query.where(request.get().filter, request.get().filter_val);
        if (request.get().search) {
            if (request.get().search.split('-').length == 5) {
                query = query.where('uuid', request.get().search)
            } else {
                query = query.orWhere('email', 'LIKE', `%${request.get().search}%`)
                    .orWhere('name', 'LIKE', `%${request.get().search}%`)
                    .orWhere('phone', 'LIKE', `%${request.get().search}%`)
                    .orWhere('address', 'LIKE', `%${request.get().search}%`)
            }
        }
        if (await query.getCount() <= 1) {
            data = await query.fetch()
        } else {
            data = await query.paginate(request.get().page || 1, request.get().paginate || 20)
        }

        return response.status(400).json(makeResp(false, data, 'Data User sukses diterima'))
    }

    async store({ request, response }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

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

        return response.status(200).json(makeResp(true, user, 'Membuat User Baru'))
    }

    async update({ request, response }) {
        const req = request.all()
        let rules = this.getRules()
        rules['uuid'] = 'required'
        rules['email'] = rules['password'] = ''
        if (req.email) rules['email'] = 'required|email|max:254'
        if (req.password) rules['password'] = 'required|min:8|max254'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

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

        return response.status(200).json(makeResp(true, user, 'Mengedit User ' + user.name))
    }

    async delete({ request, response }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(makeResp(false, [], validation.messages()[0]))

        const user = await User.query()
            .where('uuid', req.uuid)
            .first()

        if (!user) return response.status(400).json(makeResp(false, [], 'User tidak ditemukan'))

        await user.delete()

        return response.status(200).json(makeResp(true, user, 'Menghapus User ' + user.name))
    }
}

module.exports = UserController
