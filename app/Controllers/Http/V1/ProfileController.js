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
}

module.exports = ProfileController
