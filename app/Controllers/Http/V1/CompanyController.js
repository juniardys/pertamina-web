'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Company = use('App/Models/Company')
const { validate } = use('Validator')
const { queryBuilder, slugify, baseResp } = use('App/Helpers')
const uuid = use('uuid-random')
const CompanyTransformer = use('App/Transformers/V1/CompanyTransformer')
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
  async index ({ request, response, transform }) {
        const builder = await queryBuilder(Company.query(), request.all(), ['name', 'address', 'email', 'phone'])
        const data = await transform.paginate(builder, CompanyTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Perusahaan sukses diterima'))
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
    if (req.email) rules['email'] = `required|email|unique:users,email,uuid,${req.uuid}|max:254`
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
      company = await company.query()
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
