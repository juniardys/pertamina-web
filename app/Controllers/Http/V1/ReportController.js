'use strict'

const Island = use('App/Models/Island')
const ReportNozzle = use('App/Models/ReportNozzle')
const ReportPayment = use('App/Models/ReportPayment')
const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const ReportNozzleTransformer = use('App/Transformers/V1/ReportNozzleTransformer')
const ReportPaymentTransformer = use('App/Transformers/V1/ReportPaymentTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')

class ReportController {
    async island({ response, request, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let data = []
        let islands = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        islands = islands.toJSON()
        for (let i = 0; i < islands.length; i++) {
            const element = islands[i]
            const reportNozzle = await ReportNozzle.query().where('spbu_uuid', req.spbu_uuid).where('island_uuid', element.uuid).fetch()
            const tfReportNozzle = await transform.collection(reportNozzle, ReportNozzleTransformer)

            const reportPayment = await ReportPayment.query().where('spbu_uuid', req.spbu_uuid).where('island_uuid', element.uuid).fetch()
            const tfReportPayment = await transform.collection(reportPayment, ReportPaymentTransformer)


            const tfIsland = await transform.item(element, IslandTransformer)
            tfIsland.reportNozzle = tfReportNozzle
            tfIsland.reportPayment = tfReportPayment
            data.push(tfIsland)
        }

        return response.status(200).json(baseResp(true, data, 'Data Laporan Island Berhasil diterima'))
    }

    async sales() {

    }

    async feeder() {

    }

    async finance() {

    }
}

module.exports = ReportController
