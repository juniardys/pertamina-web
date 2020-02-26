'use strict'

const User = use('App/Models/User')
const Role = use('App/Models/Role')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const UserTransformer = use('App/Transformers/V1/UserTransformer')

class UserController {
    getRules() {
        return {
            name: 'required|max:254',
            email: 'required|email|unique:users|max:254',
            password: 'required|min:8|max:254',
            roles_uuid: 'required',
            phone: 'number'
        }
    }

    async get({ request, response, transform }) {
        const builder = await queryBuilder(User.query(), request.all(), ['email', 'name', 'phone', 'address'])
        let data
        (builder.paginate) ? data = await transform.paginate(builder.data, UserTransformer) : data = await transform.collection(builder.data, UserTransformer)

        return response.status(200).json(baseResp(false, data, 'Data Pengguna sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        const user = new User()
        try {
            user.uuid = uuid()
            user.roles_uuid = req.roles_uuid
            user.spbu_uuid = req.spbu_uuid
            user.name = req.name
            user.email = req.email
            user.password = req.password
            user.phone = req.phone
            user.address = req.address
            await user.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Membuat Pengguna Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.email) rules['email'] = 'required|email|unique:users|max:254'
        if (req.password) rules['password'] = 'required|min:8|max:254'
        if (req.phone) rules['phone'] = 'number'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let user
        try {
            user = await User.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada mencari data'))
        }

        try {
            if (req.roles_uuid) user.roles_uuid = req.roles_uuid
            if (req.spbu_uuid) user.spbu_uuid = req.spbu_uuid
            if (req.name) user.name = req.name
            if (req.email) user.email = req.email
            if (req.password) user.password = req.password
            if (req.phone) user.phone = req.phone
            if (req.address) user.address = req.address
            await user.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Mengedit Pengguna ' + user.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let user
        try {
            user = await User.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada hapus data'))
        }

        if (!user) return response.status(400).json(baseResp(false, [], 'Pengguna tidak ditemukan'))

        await user.delete()

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Menghapus Pengguna ' + user.name))
    }
}

module.exports = UserController
