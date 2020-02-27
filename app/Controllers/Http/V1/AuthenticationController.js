'use strict'

const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')

class AuthenticationController {
    async signIn({ request, auth, response }) {
        const req = request.all()
        const rules = {
            email: 'required|email|max:254',
            password: 'required|min:8|max:60'
        }

        const validation = await validate(req, rules)

        if (validation.fails()) return response.status(400).json(baseResp(false, null, validation.messages()[0]))

        try {
            const authenticated = await auth.attempt(req.email, req.password)
            return response.status(200).json(baseResp(true, authenticated, `Data Bearer ${req.email} diterima`))
        } catch (error) {
            return response.status(400).json(baseResp(false, null, 'username / password salah'))
        }
    }

    async signInClient({ request, auth, response }) {
        const req = request.all()
        const rules = {
            email: 'required|email|max:254',
            password: 'required|min:8|max:60'
        }

        const validation = await validate(req, rules)

        if (validation.fails()) return response.status(400).json(baseResp(false, null, validation.messages()[0]))

        try {
            const authenticated = await auth.authenticator('client').attempt(req.email, req.password)
            return response.status(400).json(baseResp(true, authenticated, `Data Bearer ${req.email} diterima`))
        } catch (error) {
            return response.status(400).json(baseResp(false, null, 'username / password salah'))
        }
    }
}

module.exports = AuthenticationController
