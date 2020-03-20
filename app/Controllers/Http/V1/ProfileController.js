'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const { baseResp, uploadImage } = use('App/Helpers')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const sharp = use('sharp')
const Helpers = use('Helpers')

class ProfileController {
    async get({ transform, response, auth }) {
        const data = await transform.item(auth.user, UserTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Profil sukses diterima'))
    }

    async update({ request, transform, auth, response }) {
        const req = request.all()
        let rules = {
            phone: 'number',
            ktp: 'number'
        }
        if (req.name) rules['name'] = `required|max:254`
        if (req.email) rules['email'] = `required|email|unique:users,email,uuid,${auth.user.uuid}|max:254`
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let user
        try {
            user = await User.query()
                .where('uuid', auth.user.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        // let transformImage = sharp()
        // request.file('image', {}, async file => {
        //     console.log('asd');
        //     const data = await transformImage
        //         .resize({ width: 200 })
        //         .jpeg({
        //             quality: 100,
        //             chromaSubsampling: '4:4:4'
        //         })
        //         .toFormat('jpeg')

        //     file.stream.pipe(transformImage).pipe(file.stream)

        //     // await Drive.disk('do').put(file.clientName, data, {
        //     //     ACL: 'public-read',
        //     //     ContentType: 'image/jpeg'
        //     // })

        //     const moveImage = await data.move(Helpers.publicPath(folder), {
        //         name: fileName,
        //         overwrite: true
        //     })
        // })

        try {
            if (req.name) user.name = req.name
            if (req.email) user.email = req.email
            user.phone = req.phone
            user.address = req.address

            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'profile-image/')
                if (upload) {
                    if (user.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        await fs.unlink(Helpers.publicPath(user.image))
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

        user = await transform.item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Data Profil sukses diperbarui'))
    }

    async updatePassword({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            password: 'required|min:8|max:254'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

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
