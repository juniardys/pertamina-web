'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const UserTransformer = use('App/Transformers/V1/UserTransformer')

class ProfileController {
    async get({ transform, response, auth }) {
        const data = await transform.item(auth.user, UserTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Profil sukses diterima'))
    }

    async update({ request, transform, auth, response }) {
        const req = request.all()
        let rules = {
            name: 'required|max:254',
            phone: 'number'
        }
        if (req.email) rules['email'] = `required|email|unique:users,email,uuid,${auth.user.uuid}|max:254`
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let user
        try {
            user = await User.query()
                .where('uuid', auth.user.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) user.name = req.name
            if (req.email) user.email = req.email
            if (req.phone) user.phone = req.phone
            if (req.address) user.address = req.address
            await user.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Data Profil sukses diperbarui'))
    }

    async updatePassword({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            password: 'required|min:8|max:254'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0]))

        let user
        try {
            user = await User.query()
                .where('uuid', auth.user.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            user.password = req.password
            await user.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Data Password Profil sukses siperbarui'))
    }
}

module.exports = ProfileController
