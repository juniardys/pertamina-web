'use strict'

const ReportNozzle = use('App/Models/ReportNozzle')
const AccessList = use('App/Models/AccessList')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const NozzleReportTransformer = use('App/Transformers/V1/NozzleReportTransformer')
const Database = use('Database')

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
        const trx = await Database.beginTransaction()
        for (let i = 0; i < req.nozzle_uuid.length; i++) {
            const nozzle_uuid = req.nozzle_uuid[i];
            const value = req.value[i];
            const image = req.image[i];
            const validation = await validate({ value }, { value: 'required|number' })
            if (validation.fails()) {
                await trx.rollback()
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
                data.image = image
                await data.save(trx)
                report.push(data)
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
            const nozzles = await transform.collection(report, NozzleReportTransformer)

            return response.status(200).json(baseResp(true, nozzles, 'Membuat Laporan Pompa'))
        }
    }

    
}

module.exports = NozzleReportController
