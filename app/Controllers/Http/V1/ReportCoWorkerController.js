'use strict'

const ReportCoWorker = use('App/Models/ReportCoWorker')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ReportCoWorkerTransformer = use('App/Transformers/V1/ReportCoWorkerTransformer')
const Database = use('Database')

class ReportCoWorkerController {
    async get({ request, response, transform }) {
        const builder = await queryBuilder(ReportCoWorker.query(), request.all(), ['spbu_uuid', 'island_uuid', 'shift_uuid', 'user_uuid', 'date'])
        let data = transform
        if (request.get().with) {
            data = data.include(request.get().with)
        }
        data = await data.paginate(builder, ReportCoWorkerTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Laporan Rekan Kerja sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            island_uuid: 'required',
            shift_uuid: 'required',
            date: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let report = []
        let countError = 0
        const trx = await Database.beginTransaction()
        for (let i = 0; i < req.user_uuid.length; i++) {
            const user_uuid = req.user_uuid[i];
            let data = new ReportCoWorker()
            try {
                data.uuid = uuid()
                data.spbu_uuid = req.spbu_uuid
                data.island_uuid = req.island_uuid
                data.shift_uuid = req.shift_uuid
                data.user_uuid = user_uuid
                data.date = req.date
            } catch (error) {
                // console.log(error);
                countError++
            }
        }

        if (countError > 0) {
            await trx.rollback()
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada input data'))
        } else {
            await trx.commit()
            const coWorkers = await transform.collection(report, ReportCoWorkerTransformer)

            return response.status(200).json(baseResp(true, coWorkers, 'Menambah User pada Laporan Rekan Kerja'))
        }
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, { uuid: 'required' })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let coWorker
        try {
            coWorker = await ReportCoWorker.query()
                .where('uuid', req.uuid).with('user')
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!coWorker) return response.status(400).json(baseResp(false, [], 'Laporan Rekan Kerja tidak ditemukan'))
        await coWorker.delete()

        coWorker = await transform.item(coWorker, ReportCoWorkerTransformer)

        return response.status(200).json(baseResp(true, coWorker, 'Menghapus User ' + coWorker.user.name + ' dari Laporan Rekan Kerja'))
    }
}

module.exports = ReportCoWorkerController
