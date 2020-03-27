'use strict'

const ReportNozzle = use('App/Models/ReportNozzle')
const AccessList = use('App/Models/AccessList')
const { validate } = use('Validator')
const { queryBuilder, uploadImage, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const NozzleReportTransformer = use('App/Transformers/V1/NozzleReportTransformer')
const Database = use('Database')
const Helpers = use('Helpers')

class NozzleReportController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(ReportNozzle.query(), request.all(), ['spbu_uuid', 'island_uuid', 'shift_uuid', 'value'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, NozzleReportTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Laporan Pompa sukses diterima'))
    }

    async deleteImages(path = []) {
        for (let i = 0; i < path.length; i++) {
            const fs = Helpers.promisify(require('fs'))
            try {
                await fs.unlink(Helpers.publicPath(path[i]))
            } catch (error) {
                // console.log(error)
            }
        }
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            island_uuid: 'required',
            shift_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let report = []
        let countError = 0
        let imagePath = []
        const trx = await Database.beginTransaction()
        for (let i = 0; i < req.nozzle_uuid.length; i++) {
            const nozzle_uuid = req.nozzle_uuid[i];
            const value = req.value[i];
            const validation = await validate({ value }, { value: 'required|number' })
            if (validation.fails()) {
                await trx.rollback()
                this.deleteImages(imagePath)
                return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
            }

            let data = new ReportNozzle()
            try {
                data.uuid = uuid()
                data.spbu_uuid = req.spbu_uuid
                data.island_uuid = req.island_uuid
                data.shift_uuid = req.shift_uuid
                data.nozzle_uuid = nozzle_uuid
                data.value = value
                if (request.file(`image[${i}]`)) {
                    const upload = await uploadImage(request, `image[${i}]`, 'report-nozzle/')
                    if (upload) {
                        data.image = upload
                    } else {
                        return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                    }
                    await data.save(trx)
                    report.push(data)
                    imagePath.push(data.image)
                } else {
                    await trx.rollback()
                    this.deleteImages(imagePath)
                    return response.status(400).json(baseResp(false, [], 'Gambar harus diisi.'))
                }
            } catch (error) {
                // console.log(error);
                countError++
            }
        }

        if (countError > 0) {
            await trx.rollback()
            this.deleteImages(imagePath)
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada input data'))
        } else {
            await trx.commit()
            const nozzles = await transform.collection(report, NozzleReportTransformer)

            return response.status(200).json(baseResp(true, nozzles, 'Membuat Laporan Pompa'))
        }
    }

    async update({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required', value: 'required|number' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let nozzle
        try {
            nozzle = await ReportNozzle.query()
                .where('uuid', req.uuid).with('nozzle')
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            nozzle.value = req.value
            if (request.file('image')) {
                const upload = await uploadImage(request, 'image', 'report-nozzle/')
                if (upload) {
                    if (nozzle.image != null) {
                        const fs = Helpers.promisify(require('fs'))
                        try {
                            await fs.unlink(Helpers.publicPath(nozzle.image))
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    nozzle.image = upload
                } else {
                    return response.status(400).json(baseResp(false, [], 'Terjadi kesalahan pada saat mengunggah gambar.'))
                }
            }
            await nozzle.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        nozzle = await transform.item(nozzle, NozzleReportTransformer)

        return response.status(200).json(baseResp(true, nozzle, 'Mengedit Laporan Pompa ' + nozzle.nozzle.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let nozzle
        try {
            nozzle = await ReportNozzle.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!nozzle) return response.status(400).json(baseResp(false, [], 'Laporan Pompa tidak ditemukan'))

        if (nozzle.image != null) {
            const fs = Helpers.promisify(require('fs'))
            try {
                await fs.unlink(Helpers.publicPath(nozzle.image))
            } catch (error) {
                console.log(error)
            }
        }
        await nozzle.delete()

        nozzle = await transform.item(nozzle, ProductTransformer)

        return response.status(200).json(baseResp(true, nozzle, 'Menghapus Laporan Pompa ' + nozzle.name))
    }
}

module.exports = NozzleReportController
