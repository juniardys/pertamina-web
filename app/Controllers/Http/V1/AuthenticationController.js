'use strict'

const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/V1/UserTransformer')

class AuthenticationController {
    async signIn({ request, auth, response, transform }) {
        const req = request.all()
        const rules = {
            email: 'required|email|max:254',
            password: 'required|min:8|max:60'
        }

        const validation = await validate(req, rules)

        if (validation.fails()) return response.status(400).json(baseResp(false, null, validation.messages()[0].message))

        try {
            const authenticated = await auth.attempt(req.email, req.password)
            if (req.imei) {
                const user = await User.query().where('email', req.email).with('role').first()

                if (req.fcm) {
                    user.FCM_TOKEN = req.fcm
                    await user.save()
                }

                // if (user.spbu_uuid === null) return response.status(400).json(baseResp(false, null, 'SPBU belum di isi.'))

                let data = await transform.include('role').item(user, UserTransformer)

                return response.status(200).json(baseResp(true, data, 'Data Profil sukses diterima', null, {
                    type: authenticated.type,
                    token: authenticated.token
                }))
            }

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

        if (validation.fails()) return response.status(400).json(baseResp(false, null, validation.messages()[0].message))

        try {
            const authenticated = await auth.authenticator('client').attempt(req.email, req.password)
            return response.status(400).json(baseResp(true, authenticated, `Data Bearer ${req.email} diterima`))
        } catch (error) {
            return response.status(400).json(baseResp(false, null, 'username / password salah'))
        }
    }
}

module.exports = AuthenticationController
