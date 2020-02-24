'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { makeResp } = use('App/Helpers/ApiHelper')

class UserController {
    async get({ request, response }) {
        const users = await User.query()
            .where(function() {
                if (request.get().uuid != null) {
                    this.where('uuid', request.get().uuid)
                }
            })
            .paginate(request.get().page || 1, request.get().paginate || 20)

        return response.status(400).json(makeResp(false, users, 'Data Users Retrieved Successfully'))
    }
}

module.exports = UserController
