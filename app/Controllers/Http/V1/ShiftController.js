'use strict'

const Shift = use('App/Models/Shift')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const ShiftTransformer = use('App/Transformers/V1/ShiftTransformer')
const moment = use('moment')

class ShiftController {
    async get({ request, response, transform }) {
        const req = request.all()
        if (req.filter_col && req.filter_col.length >= 1) {
            let spbu_uuid = null
            for (let i = 0; i < req.filter_col.length; i++) {
                if (req.filter_col[i] == 'spbu_uuid') spbu_uuid = req.filter_val[i]
            }
            await this.generateOrder(spbu_uuid)
        }
        const builder = await queryBuilder(Shift.query(), request.all(), ['name', 'start', 'end'])
        const data = await transform.paginate(builder, ShiftTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Shift sukses diterima'))
    }

    async store({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            name: 'required|max:254',
            spbu_uuid: 'required',
            start: 'required',
            end: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let shift = new Shift()
        try {
            shift.uuid = uuid()
            shift.spbu_uuid = req.spbu_uuid
            shift.name = req.name
            shift.start = req.start
            shift.end = req.end
            await shift.save()
        } catch (error) {
            console.log(error);
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
        }

        await this.generateOrder(shift.spbu_uuid)

        shift = await transform.item(shift, ShiftTransformer)

        return response.status(200).json(baseResp(true, shift, 'Membuat Shift Baru'))
    }

    async update({ request, response, transform }) {
        const req = request.all()
        let rules = []
        rules['uuid'] = 'required'
        if (req.name) rules['name'] = 'required|max:254'
        if (req.start) rules['start'] = 'required'
        if (req.end) rules['end'] = 'required'
        const validation = await validate(req, rules)
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let shift
        try {
            shift = await Shift.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        try {
            if (req.name) shift.name = req.name
            if (req.start) shift.start = req.start
            if (req.end) shift.end = req.end
            await shift.save()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
        }

        await this.generateOrder(shift.spbu_uuid)

        shift = await transform.item(shift, ShiftTransformer)

        return response.status(200).json(baseResp(true, shift, 'Mengedit Shift ' + shift.name))
    }

    async delete({ request, response, transform }) {
        const req = request.all()
        const validation = await validate(req, {
            uuid: 'required'
        })
        if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

        let shift
        try {
            shift = await Shift.query()
                .where('uuid', req.uuid)
                .first()
        } catch (error) {
            return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
        }

        if (!shift) return response.status(400).json(baseResp(false, [], 'Shift tidak ditemukan'))

        await shift.delete()

        await this.generateOrder(shift.spbu_uuid)

        shift = await transform.item(shift, ShiftTransformer)

        return response.status(200).json(baseResp(true, shift, 'Menghapus Shift ' + shift.name))
    }

    async generateOrder(spbu_uuid = null, first = null) {
        if (spbu_uuid != null) {
            // const oldFirst = await Shift.query().where('spbu_uuid', spbu_uuid).where('is_first', true).first()
            let firstShift = null;
            if (first != null) {
                try {
                    const newFirst = await Shift.query().where('uuid', first).first()
                    newFirst.is_first = true
                    await newFirst.save()
                    firstShift = newFirst;
                } catch (error) {
                    // firstShift = oldFirst
                }
            }

            const data = await Shift.query().where('spbu_uuid', spbu_uuid).fetch()
            const dataJSON = data.toJSON()
            if (dataJSON.length >= 1) {
                // auto select time first
                if (firstShift == null) {
                    for (let i = 0; i < dataJSON.length; i++) {
                        const shift = dataJSON[i];
                        if (i == 0) {
                            firstShift = shift
                        } else {
                            const one = moment(dataJSON[i - 1].start, 'mm:ss');
                            const two = moment(shift.start, 'mm:ss');
                            (one.diff(two) < 0) ? firstShift = dataJSON[i - 1] : firstShift = shift
                        }
                    }
                }

                let dataSorted = []
                const $this = this
                var sortByTime = dataJSON.slice(0);
                sortByTime.sort(function (a, b) {
                    a = moment(a.start, 'mm:ss');
                    b = moment(b.start, 'mm:ss');
                    return a.diff(b)
                });
                // const indexFirstShift = sortByTime.map(function(e) { return e.uuid; }).indexOf(firstShift.uuid);
                for (let i = 0; i < sortByTime.length; i++) {
                    const shift = sortByTime[i];
                    await Shift.query().where('uuid', shift.uuid).update({ no_order: i + 1 })
                }
            }
        }
    }
}

module.exports = ShiftController
