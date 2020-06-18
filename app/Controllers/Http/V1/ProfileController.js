'use strict'

const User = use('App/Models/User')
const Island = use('App/Models/Island')
const Shift = use('App/Models/Shift')
const ReportIsland = use('App/Models/ReportIsland')
const ReportShift = use('App/Models/ReportShift')
const { validate } = use('Validator')
const { baseResp, uploadImage } = use('App/Helpers')
const UserTransformer = use('App/Transformers/V1/UserTransformer')
const ReportIslandTransformer = use('App/Transformers/V1/ReportIslandTransformer')
const ReportShiftTransformer = use('App/Transformers/V1/ReportShiftTransformer')
// const sharp = use('sharp')
const Helpers = use('Helpers')

class ProfileController {
    async get({ transform, response, auth, request }) {
        const user = await User.query().where('id', auth.user.id).with('role').first()
        let data = await transform.include('role').item(user, UserTransformer)
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
                .with('role')
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

        user = await transform.include('role').item(user, UserTransformer)

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
                .with('role')
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

        user = await transform.include('role').item(user, UserTransformer)

        return response.status(200).json(baseResp(true, user, 'Data Password Profil sukses siperbarui'))
    }

    async historyReport({ request, response, transform, auth }) {
        const req = request.all()
        const user = await User.query().where('id', auth.user.id).with('role').first()
        var data = {}
        if (user.role_uuid == '0bec0af4-a32f-4b1e-bfc2-5f4933c49740') {
        // Operator
            const reportIsland = await ReportIsland.query().where({
                operator_uuid: user.uuid,
            }).orderBy('id', 'desc').paginate(req.page || 1, req.paginate || 20)
            data = await transform.paginate(reportIsland, ReportIslandTransformer)
            for (let index = 0; index < data.data.length; index++) {
                const dt = data.data[index];
                const shift = await Shift.query().where('uuid', dt.shift_uuid).first()
                const island = await Island.query().where('uuid', dt.island_uuid).first()
                dt['shift_name'] = shift.name || null
                dt['island_name'] = island.name || null
            }
        } else if (user.role_uuid == '45982947-346a-43d6-9204-78202ad970ab') {
        // Admin
            const reportShift = await ReportShift.query().where({
                admin_acc: user.uuid,
            }).orderBy('id', 'desc').paginate(req.page || 1, req.paginate || 20)
            data = await transform.paginate(reportShift, ReportShiftTransformer)
            for (let index = 0; index < data.data.length; index++) {
                const dt = data.data[index];
                const shift = await Shift.query().where('uuid', dt.shift_uuid).first()
                dt['shift_name'] = shift.name || null
            }
        }

        return response.status(200).json(baseResp(true, data, 'Data riwayat laporan sukses diterima'))
    }
}

module.exports = ProfileController
