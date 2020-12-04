'use strict'

const Product = use('App/Models/Product')
const Company = use('App/Models/Company')
const VoucherHistory = use('App/Models/VoucherGenerateHistory')
const Voucher = use('App/Models/Voucher')
const { validate } = use('Validator')
const { queryBuilder, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const db = use('Database')
const moment = use('moment')
const SpreadSheet = use('SpreadSheet')
const numeral = use('numeral')

class VoucherController {

    async redeemVoucher({ request, view, response, auth }){
        const req = request.all()
        const validation = await validate(req, {
            qr_code: 'required',
            name: 'required',
            plate: 'required'
        });

        if (validation.fails()) {
            return response.status(400).json(baseResp(false, [], validation.messages()[0].message))
        } else {
            const post = await db.transaction(async trx => {
                try {
                    var voucher = await Voucher.query().where('qr_code', req.qr_code).first()
                    if (!voucher) throw new Error('Voucher tidak ditemukan');
                    if (voucher.isUsed) throw new Error('Voucher sudah digunakan');
                    var product = await Product.query().where('uuid', voucher.product_uuid).first()
                    var vHist = VoucherHistory.query().whereHas('vouchers', (q) => {
                        q.uuid = voucher.uuid
                    }).first()
                    // Voucher Beda Harga
                    if (voucher.price != product.price) {
                        var company = await Company.query().where('uuid', voucher.company_uuid).first()
                        var old_total_price = voucher.total_price
                        var new_total_price = voucher.amount * product.price
                        
                        var new_balance = company.balance + old_total_price - new_total_price

                        if (new_balance < 200000) throw new Error('Saldo tidak mencukupi, Harap kontak Perusahaan anda')

                        voucher.isUsed = true
                        voucher.price = product.price
                        voucher.total_price = new_total_price
                        voucher.used_at = moment().format('YYYY-MM-DD HH:mm:ss')
                        voucher.used_date = moment().format('YYYY-MM-DD')
                        voucher.operator_uuid = auth.user.uuid
                        voucher.person_name = req.name
                        voucher.person_plate = req.plate

                        await voucher.save()

                        company.new_balance = new_balance

                        await company.save()

                        vHist.total_price = vHist.total_price - old_total_price + new_total_price

                        await vHist.save()
                    } else {
                        voucher.isUsed = true
                        voucher.used_at = moment().format('YYYY-MM-DD HH:mm:ss')
                        voucher.used_date = moment().format('YYYY-MM-DD')
                        voucher.operator_uuid = auth.user.uuid
                        voucher.person_name = req.name
                        voucher.person_plate = req.plate

                        await voucher.save()
                    }
                    return response.status(200).json(baseResp(true, [], 'Voucher Berhasil Digunakan'))
                } catch (e) {
                    return response.status(400).json(baseResp(false, [], e.message))
                }

            })

            return post;
        }
    }

	async UnusedVoucher({ request, response, transform }) {
		const req = request.all()
		var builder = Voucher.query().where('spbu_uuid', req.spbu_uuid)
			.where('isUsed', false)
			.with('product')
			.with('spbu')
			.with('company')
			.orderBy('id', 'desc')

		if (req.filterCompany) {
			builder = builder.whereHas('company', (query) => {
				query.where('uuid', req.filterCompany)
			})
		}

		if (req.filterProduct) {
			builder = builder.whereHas('product', (query) => {
				query.where('uuid', req.filterProduct)
			})
		}

		if (req.filterAmount) {
			builder = builder.where('amount', req.filterAmount)
		}

		if (req.filterDate) {
			var [startDate, endDate] = req.filterDate.split(' - ')
			builder = builder.where((query) => {
				query.where('created_at', '>=', moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD 00:00:00'))
					.where('created_at', '<=', moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD 23:59:59'))
			})
		}

		builder = await builder.fetch()

		return response.status(200).json(baseResp(true, builder.toJSON(), 'Data Voucher Belum Terpakai sukses diterima'))
	}

	async UsedVoucher({ request, response, transform }) {
		const req = request.all()
		var builder = Voucher.query().where('spbu_uuid', req.spbu_uuid)
			.where('isUsed', true)
			.with('product')
			.with('spbu')
			.with('company')
			.orderBy('id', 'desc')

		if (req.filterCompany) {
			builder = builder.whereHas('company', (query) => {
				query.where('uuid', req.filterCompany)
			})
		}

		if (req.filterProduct) {
			builder = builder.whereHas('product', (query) => {
				query.where('uuid', req.filterProduct)
			})
		}

		if (req.filterAmount) {
			builder = builder.where('amount', req.filterAmount)
		}

		if (req.filterDate) {
			var [startDate, endDate] = req.filterDate.split(' - ')
			builder = builder.where((query) => {
				query.where('used_at', '>=', moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD 00:00:00'))
					.where('used_at', '<=', moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD 23:59:59'))
			})
		}

		builder = await builder.fetch()

		return response.status(200).json(baseResp(true, builder.toJSON(), 'Data Voucher Terpakai sukses diterima'))
	}

	async exportExcel({ request, view, response, auth, params }){
		const req = request.all()
		const excel = new SpreadSheet(response, 'xlsx')
		var data = []

		var builder = Voucher.query().where('spbu_uuid', req.spbu_uuid)
			.where('isUsed', (params.status == 'used') ? true : false)
			.with('product')
            .with('spbu')
            .with('company')
			.orderBy('id', 'asc')

		if (req.filterCompany) {
			builder = builder.whereHas('company', (query) => {
				query.where('uuid', req.filterCompany)
			})
		}

		if (req.filterProduct) {
			builder = builder.whereHas('product', (query) => {
				query.where('uuid', req.filterProduct)
			})
		}

		if (req.filterAmount) {
			builder = builder.where('amount', req.filterAmount)
		}

		if (req.filterDate) {
			var [startDate, endDate] = req.filterDate.split(' - ')
			builder = builder.where((query) => {
				if (params.status == 'used') {
					query.where('used_at', '>=', moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD 00:00:00'))
						.where('used_at', '<=', moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD 23:59:59'))
				} else {
					query.where('created_at', '>=', moment(startDate, 'MM/DD/YYYY').format('YYYY-MM-DD 00:00:00'))
						.where('created_at', '<=', moment(endDate, 'MM/DD/YYYY').format('YYYY-MM-DD 23:59:59'))
				}
			})
		}

		builder = await builder.fetch()

		var headers = []
		headers.push('No')
		headers.push('Waktu ' + ((params.status == 'used')? 'Penggunaan' : 'Pembuatan'))
		headers.push('Perusahaan')
		headers.push('Produk')
		headers.push('Liter')
		headers.push('Code')
		headers.push('Harga/Liter')
		headers.push('Total Harga')
		if (params.status == 'used') {
			headers.push('Driver')
			headers.push('No Plat')
		}

		data.push(headers)

		builder.toJSON().forEach((voucher, i) => {
			var vouchers = []
			vouchers.push(i + 1)
			if (params.status == 'used') {
				vouchers.push(moment(voucher.used_at).format('DD MMM YYYY HH:mm:ss'))
			} else {
				vouchers.push(moment(voucher.created_at).format('DD MMM YYYY HH:mm:ss'))
			}
			vouchers.push(voucher.company.name)
			vouchers.push(voucher.product.name)
			vouchers.push(numeral(voucher.amount).format('0,0') + ' Liter')
			vouchers.push(voucher.qr_code)
			vouchers.push('Rp ' + numeral(voucher.price).format('0,0'))
			vouchers.push('Rp ' + numeral(voucher.total_price).format('0,0'))
			if (params.status == 'used') {
				vouchers.push(voucher.person_name)
				vouchers.push(voucher.person_plate)
			}
			data.push(vouchers)
		})

		excel.addSheet('Voucher', data)
		excel.download('List Voucher')
	}

}

module.exports = VoucherController
