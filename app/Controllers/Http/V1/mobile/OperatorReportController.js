'use strict'

const Shift = use('App/Models/Shift')
const Island = use('App/Models/Island')
const { validate } = use('Validator')
const { baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const IslandTransformer = use('App/Transformers/V1/IslandTransformer')
const moment = use('moment')
const Database = use('Database')
const _ = use("lodash")

class OperatorReportController {
    async getShift({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const shift = await Shift.query().where('spbu_uuid', req.spbu_uuid).orderBy('no_order', 'asc').fetch()
        const data = await transform.collection(shift, ShiftTransformer)
        const lastShift = shift.toJSON().slice(-1)[0]

        const yesterdayLastReport = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).subtract(1, "days").format('YYYY-MM-DD')).where('shift_uuid', lastShift.uuid).first()

        const reportShift = await Database.table('report_shifts').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).format('YYYY-MM-DD'))
        if (reportShift.length > 0) {
            let lastReport = yesterdayLastReport || null
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                let selectedShift = null
                let status = false
                reportShift.forEach(report => {
                    if (shift.uuid === report.shift_uuid) {
                        status = report.status_operator
                        selectedShift = report
                    }
                })

                if (lastReport == null) {
                    shift.done = status
                    shift.disable = !status
                } else {
                    shift.done = status
                    shift.disable = (lastReport.status_operator) ? false : true
                }
                lastReport = selectedShift
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const shift = data[i];
                shift.done = false
                shift.disable = false
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data Shift Report sukses diterima'))
    }

    async getIsland({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            spbu_uuid: 'required',
            date: 'required',
            shift_uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        const island = await Island.query().where('spbu_uuid', req.spbu_uuid).fetch()
        const data = await transform.collection(island, IslandTransformer)

        const reportIsland = await Database.table('report_islands').where('spbu_uuid', req.spbu_uuid).where('date', moment(req.date).format('YYYY-MM-DD')).where('shift_uuid', req.shift_uuid)
        
        if (reportIsland.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const island = data[i];
                let status = false
                reportIsland.forEach(report => { if (island.uuid === report.island_uuid) status = report.status_operator })
                island.done = status
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const island = data[i];
                island.done = false
            }
        }
        return response.status(200).json(baseResp(true, data, 'Data Island Report sukses diterima'))
    }

    async store({ request, response, transform, auth }) {
        const req = request.all()
        const validation = await validate(req, {
            date: 'required',
            spbu_uuid: 'required',
            shift_uuid: 'required',
            island_uuid: 'required',
            report_nozzle: 'required',
            report_payment: 'required',
            report_co_worker: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        try {
            // Insert Data Nozzle
            await Promise.all(_.forEach(report_nozzle, function(item, key){
                throw new Error('Gak isok cok')
            }))
            
        } catch (e) {
            return response.status(400).json(baseResp(false, [], e.message))
        }

    }
}

module.exports = OperatorReportController
