'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { makeResp } = use('App/Helpers/ApiHelper')
const ScannerLogin = use('App/Models/ScannerLogin')

class AuthApi {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    const req = request.all()
    if (req.token == undefined || req.token == '') return response.status('401').json(makeResp(false, null, 'Unauthorized.'))

    const login = await ScannerLogin.query()
      .where('api_key', req.token)
      .first()

    if (!login) return response.status('401').json(makeResp(false, null, 'Unauthorized.'))

    await next()
  }
}

module.exports = AuthApi