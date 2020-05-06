'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { queryBuilder, baseResp, uploadImage } = use('App/Helpers')
const uuid = use('uuid-random')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const Helpers = use('Helpers')

class UserController {
    getRules() {
        return {
            name: 'required|max:254',
            email: 'required|email|unique:users|max:254',
            password: 'required|min:8|max:254',
            role_uuid: 'required',
            phone: 'number',
            ktp: 'number'
        }
    }

    async get({ request, response, transform }) {
        const builder = await queryBuilder(User.query(), request.all(), ['email', 'name', 'phone', 'address'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, UserTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Pengguna sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, this.getRules())
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let user = new User()
        try {
            user.uuid = uuid()
            user.role_uuid = req.role_uuid
            user.spbu_uuid = req.spbu_uuid
            user.name = req.name
            user.email = req.email
            user.password = req.password
            user.phone = req.phone
            user.address = req.address
            user.ktp = req.ktp
            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'profile-image/')
                if (upload) {
                    if (user.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        try {
                            await fs.unlink(Helpers.publicPath(user.image))
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    user.image = upload
                } else {
                    return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                }
            }
            await user.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        let transformer = transform
        if (req.custom_response) {
            let relation = req.custom_response.split(',')
            transformer = transformer.include(relation)
        }

        user = await transformer.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Membuat Pengguna Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = {
            phone: 'number',
            ktp: 'number'
        }
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.email) rules['email'] = `required|email|unique:users,email,uuid,${req.uuid}|max:254`
        if (req.password) rules['password'] = 'required|min:8|max:254'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let user
        try {
            user = await User.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.role_uuid) user.role_uuid = req.role_uuid
            user.spbu_uuid = req.spbu_uuid
            if (req.name) user.name = req.name
            if (req.email && user.email != req.email) user.email = req.email
            if (req.password) user.password = req.password
            user.phone = req.phone
            user.address = req.address
            user.ktp = req.ktp
            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'profile-image/')
                if (upload) {
                    if (user.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        try {
                            await fs.unlink(Helpers.publicPath(user.image))
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    user.image = upload
                } else {
                    return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                }
            }
            await user.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        let transformer = transform
        if (req.custom_response) {
            let relation = req.custom_response.split(',')
            transformer = transformer.include(relation)
        }

        user = await transformer.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Mengedit Pengguna ' + user.name))
    }

    async updatePassword({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required', password: 'required|min:8|max:254' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let user
        try {
            user = await User.query().where('uuid', req.uuid).first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            user.password = req.password
            await user.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        let transformer = transform
        if (req.custom_response) {
            let relation = req.custom_response.split(',')
            transformer = transformer.include(relation)
        }

        user = await transformer.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Mengedit Password Pengguna ' + user.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let user
        try {
            user = await User.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!user) return response.status(400).json(baseResp(false, [], 'Pengguna tidak ditemukan'))

        await user.delete()

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Menghapus Pengguna ' + user.name))
    }
}

module.exports = UserController
