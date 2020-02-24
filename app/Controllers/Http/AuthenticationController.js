'use strict'

const { validate } = use('Validator')
const { makeResp } = use('App/Helpers/ApiHelper')

class AuthenticationController {
    async signIn({ request, auth, response }) {
        const req = request.all()
        const rules = {
            email: 'required|email|max:254',
            password: 'required|min:8|max:60'
        }

        const validation = await validate(req, rules)

        if (validation.fails()) return response.status(400).json(makeResp(false, null, validation.messages()[0]))

        try {
            const authenticated = await auth.attempt(req.email, req.password)
            return response.status(400).json(makeResp(true, authenticated, `Data Bearer ${req.email} Retrieved`))
        } catch (error) {
            return response.status(400).json(makeResp(false, null, 'username / password salah'))
        }
    }
}

module.exports = AuthenticationController
