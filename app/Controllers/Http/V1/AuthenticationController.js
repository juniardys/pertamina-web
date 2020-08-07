'use strict'

const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const Mail = use('Mail')
const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const Hash = use('Hash')

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
            const getUser = await User.query().whereRaw('LOWER(email) = LOWER(?)', req.email).whereNull('deleted_at').first()
            if (!getUser) throw new Error('user tidak ditemukan')
            const validPassword = await Hash.verify(req.password, getUser.password)
            if (!validPassword) throw new Error('username / password salah')

            const authenticated = await auth.generate(getUser)
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
            console.log(error.message)
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

    async forgotPassword({ request, response }) {
        const rules = {
            email: 'required|email|max:254'
        }
        const { email } = request.all()
        const validation = await validate(request.all(), rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, null, validation.messages()[0].message))
        try {
            const data = await db
                .table("users")
                .where("email", email)
                .getCount();
            if (data == 0) {
                return response.status(400).json(baseResp(false, null, "Email tidak ditemukan"))
            } else {
                await Mail.send("emails.forgot", { email: email }, message => {
                    message
                        .to(email)
                        .from(
                            "noreply@kriwil.id",
                            "Kriwil - your curls bff"
                        )
                        .subject("Lupa Password - Kriwil");
                });

                return response.status(200).json(baseResp(true, null, "Silahkan cek email anda"))
            }
        } catch (error) {
            return response.status(400).json(baseResp(false, null, error.message))
        }
    }
}

module.exports = AuthenticationController
