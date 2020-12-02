'use strict'

const { parseInt } = require('lodash')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Company = use('App/Models/Company')
const History = use('App/Models/HistoryCompanyBalance')
const VoucherHistory = use('App/Models/VoucherGenerateHistory')
const Voucher = use('App/Models/Voucher')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp, rndmChr } = use('App/Helpers')
const uuid = use('uuid-random')
const CompanyTransformer = use('App/Transformers/V1/CompanyTransformer')
const HistoryTransformer = use('App/Transformers/V1/HistoryCompanyBalanceTransformer')
const VoucherHistoryTransformer = use('App/Transformers/V1/VoucherHistoryTransformer')
const VoucherTransformer = use('App/Transformers/V1/VoucherTransformer')
const Helpers = use('Helpers')
const db = use("Database");
const moment = use("moment")
const SpreadSheet = use('SpreadSheet')
const numeral = use('numeral')

/**
 * Resourceful controller for interacting with companies
 */
class CompanyController {
	getRules() {
		return {
			name: 'required|max:254',
			address: 'required|max:254',
			email: `required|email|max:254`,
			password: 'required|min:8|max:254',
			phone: 'number',
		}
	}
	/**
	 * Show a list of all companies.
	 * GET companies
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */


	async get({ request, response, transform }) {
		const builder = await queryBuilder(Company.query(), request.all(), ['name', 'address', 'phone', 'email', 'balance'])
		let data = transform
		if (request.get().with) {
			data = data.include(request.get().with)
		}
		data = await data.paginate(builder, CompanyTransformer)

		return response.status(200).json(baseResp(true, data, 'Data Perusahaan sukses diterima'))
	}

	async history({ request, response, transform }) {
		const req = request.all()
		const builder = await queryBuilder(History.query().where('company_uuid', req.company_uuid), request.all())
		let data = transform
		if (request.get().with) {
			data = data.include(request.get().with)
		}
		data = await data.paginate(builder, HistoryTransformer)

		return response.status(200).json(baseResp(true, data, 'Data History sukses diterima'))
	}

	async UnusedVoucher({ request, response, transform }) {
		const req = request.all()
		var builder = Voucher.query().where('company_uuid', req.company_uuid)
			.where('isUsed', false)
			.with('product')
			.with('spbu')
			.orderBy('id', 'desc')

		if (req.filterSpbu) {
			builder = builder.whereHas('spbu', (query) => {
				query.where('uuid', req.filterSpbu)
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
		var builder = Voucher.query().where('company_uuid', req.company_uuid)
			.where('isUsed', true)
			.with('product')
			.with('spbu')
			.orderBy('id', 'asc')

		if (req.filterSpbu) {
			builder = builder.whereHas('spbu', (query) => {
				query.where('uuid', req.filterSpbu)
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

	async ShowVoucher({ request, response, transform }) {
		const req = request.all()
		const builder = await Voucher.query().where('company_uuid', req.company_uuid).where('uuid', req.uuid)
			.with('company')
			.with('spbu')
			.with('operator')
			.with('product')
			.fetch()
		return response.status(200).json(baseResp(true, builder.toJSON(), 'Data Detail Voucher sukses diterima'))
	}

	// async voucher({ request, response, transform }) {
	//   const req = request.all()
	//   const builder = await queryBuilder(VoucherHistory.query().where('company_uuid', req.company_uuid), req, [], ['product'])
	//   let data = transform
	//   if (request.get().with) {
	//       data = data.include(request.get().with)
	//   }
	//   data = await data.paginate(builder, VoucherHistoryTransformer)

	//   return response.status(200).json(baseResp(true, data, 'Data Voucher History sukses diterima'))
	// }

	async voucher({ request, response, transform }) {
		const req = request.all()
		var builder = VoucherHistory.query().where('company_uuid', req.company_uuid)
			.with('product')
			.with('spbu')
			.orderBy('id', 'desc')

		if (req.filterSpbu) {
			builder = builder.whereHas('spbu', (query) => {
				query.where('uuid', req.filterSpbu)
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

        var vhistory = builder.toJSON()
        for (let index = 0; index < vhistory.length; index++) {
            const vhist = vhistory[index];
            vhistory[index].total_voucher = await db.table('voucher_generate_history_items').where('voucher_generate_history_uuid', vhist.uuid).getCount() || 0
        }

		return response.status(200).json(baseResp(true, vhistory, 'Data History Generate Voucher sukses diterima'))
	}

	async exportExcel({ request, view, response, auth, params }){
		const req = request.all()
		const excel = new SpreadSheet(response, 'xlsx')
		var data = []

		var builder = Voucher.query().where('company_uuid', req.company_uuid)
			.where('isUsed', (params.status == 'used') ? true : false)
			.with('product')
			.with('spbu')
			.orderBy('id', 'asc')

		if (req.filterSpbu) {
			builder = builder.whereHas('spbu', (query) => {
				query.where('uuid', req.filterSpbu)
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
		headers.push('Waktu ' + (params.status == 'used')? 'Penggunaan' : 'Pembuatan')
		headers.push('SPBU')
		headers.push('Produk')
		headers.push('Liter')
		headers.push('Code')
		headers.push('Harga/Liter')
		headers.push('Total Harga')
		if (params.status == 'used') {
			headers.push('Driver')
			headers.push('Plat No')
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
			vouchers.push(voucher.spbu.name)
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

	async index({ request, response, transform }) {
		// 
	}

	/**
	 * Render a form to be used for creating a new company.
	 * GET companies/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create({ request, response, view }) {
	}

	/**
	 * Create/save a new company.
	 * POST companies
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, response, transform }) {
		const req = request.all()
		const validation = await validate(req, this.getRules())
		if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

		let company = new Company()
		try {
			company.uuid = uuid()
			company.name = req.name
			company.email = req.email
			company.password = req.password
			company.phone = req.phone
			company.address = req.address
			company.balance = 0
			await company.save()
		} catch (error) {
			return response.status(400).json(baseResp(false, [], 'Kesalahan pada insert data'))
		}

		company = await transform.item(company, CompanyTransformer)

		return response.status(200).json(baseResp(true, company, 'Membuat Perusahaan Baru'))
	}

	/**
	 * Display a single company.
	 * GET companies/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, request, response, view }) {
	}

	/**
	 * Render a form to update an existing company.
	 * GET companies/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit({ params, request, response, view }) {
	}

	/**
	 * Update company details.
	 * PUT or PATCH companies/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response, transform }) {
		const req = request.all()
		let rules = {
			phone: 'number',
		}
		rules['uuid'] = 'required'
		if (req.name) rules['name'] = 'required|max:254'
		if (req.email) rules['email'] = `required|email|unique:companies,email,uuid,${req.uuid}|max:254`
		if (req.password) rules['password'] = 'required|min:8|max:254'
		const validation = await validate(req, rules)
		if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

		let company
		try {
			company = await Company.query()
				.where('uuid', req.uuid)
				.first()
		} catch (error) {
			return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
		}

		if (req.balance != null) {
			var sumBalance

			sumBalance = parseInt(company.balance) + parseInt(req.balance)

			let history = new History()

			try {
				history.company_uuid = company.uuid
				history.current_balance = company.balance
				history.added_balance = req.balance
				history.final_balance = sumBalance
				history.description = 'Topup Saldo'
				await history.save()

				try {
					company.balance = sumBalance
					await company.save()
				} catch (error) {
					return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
				}

			} catch (error) {
				console.log(error)
				return response.status(400).json(baseResp(false, [], 'Kesalahan pada history data'))
			}

			history = await transform.item(history, HistoryTransformer)

		} else {

			try {
				if (req.name) company.name = req.name
				if (req.email && company.email != req.email) company.email = req.email
				if (req.password) company.password = req.password
				company.phone = req.phone
				company.address = req.address
				await company.save()
			} catch (error) {
				console.log(error);
				return response.status(400).json(baseResp(false, [], 'Kesalahan pada update data'))
			}
		}

		company = await transform.item(company, CompanyTransformer)

		return response.status(200).json(baseResp(true, company, 'Mengedit Pengguna ' + company.name))
	}

	/**
	 * Delete a company with id.
	 * DELETE companies/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response, transform }) {
		const req = request.all()
		const validation = await validate(req, {
			uuid: 'required'
		})
		if (validation.fails()) return response.status(400).json(baseResp(false, [], validation.messages()[0].message))

		let company
		try {
			company = await Company.query()
				.where('uuid', req.uuid)
				.first()
		} catch (error) {
			return response.status(400).json(baseResp(false, [], 'Data tidak ditemukan'))
		}

		if (!company) return response.status(400).json(baseResp(false, [], 'Perusahaan tidak ditemukan'))

		company.email = await rndmChr(40, 'companies', 'email')
		await company.save()

		await company.delete()

		company = await transform.item(company, CompanyTransformer)

		return response.status(200).json(baseResp(true, company, 'Menghapus Perusahaan ' + company.name))
	}
}

module.exports = CompanyController
