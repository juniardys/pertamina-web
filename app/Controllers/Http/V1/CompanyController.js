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
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const CompanyTransformer = use('App/Transformers/V1/CompanyTransformer')
const HistoryTransformer = use('App/Transformers/V1/HistoryCompanyBalanceTransformer')
const VoucherHistoryTransformer = use('App/Transformers/V1/VoucherHistoryTransformer')
const VoucherTransformer = use('App/Transformers/V1/VoucherTransformer')
const Helpers = use('Helpers')

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
    const builder = await queryBuilder(History.query(), request.all(), ['created_at', 'current_balance', 'added_balance', 'final_balance'])
    let data = transform
    if (request.get().with) {
        data = data.include(request.get().with)
    }
    data = await data.paginate(builder, HistoryTransformer)

    return response.status(200).json(baseResp(true, data, 'Data History sukses diterima'))
  }

  async UnusedVoucher({ request, response, transform }) {
    const req = request.all()
    const builder = await queryBuilder(Voucher.query().where('company_uuid', req.search ).where('isUsed', false).with('product', 'generate_history'), request.all(), ['uuid', 'company_uuid', 'product_uuid', 'qr_code', 'amount', 'price', 'total_price', 'isUsed'])
    let data = transform
    if (request.get().with) {
        data = data.include(request.get().with)
    }
    data = await data.paginate(builder, VoucherTransformer)

    return response.status(200).json(baseResp(true, data, 'Data Voucher sukses diterima'))
  }

  async voucher({ request, response, transform }) {
    const req = request.all()
    let query = await VoucherHistory.query().where('company_uuid', req.search).with('product').fetch()
    const data = await transform.paginate(query, VoucherHistoryTransformer)

    return response.status(200).json(baseResp(true, query, 'Data Voucher History sukses diterima'))
  }

  async index ({ request, response, transform }) {
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
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new company.
   * POST companies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, transform }) {
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
  async show ({ params, request, response, view }) {
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
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update company details.
   * PUT or PATCH companies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, transform }) {
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

    var sumBalance

    if (req.balance != null) {

      sumBalance = parseInt(company.balance) + parseInt(req.balance)

      let history = new History()

      try {
        history.uuid = company.uuid
        history.current_balance = company.balance
        history.added_balance = req.balance
        history.final_balance = sumBalance
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
          company.balance = sumBalance
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
  async destroy ({ params, request, response, transform }) {
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

    await company.delete()

    company = await transform.item(company, CompanyTransformer)

    return response.status(200).json(baseResp(true, company, 'Menghapus Perusahaan ' + company.name))
  }
}

module.exports = CompanyController
