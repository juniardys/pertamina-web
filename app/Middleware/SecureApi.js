'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { makeResp } = use('App/Helpers/ApiHelper')
const Env = use('Env')

class SecureApi {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const req = request.all()
    if (Env.get('APP_API_KEY') == undefined || Env.get('APP_API_KEY') == '') return response.status('401').json(makeResp(false, null, 'APP API KEY not set, please set.'))

    if (req.api_key == undefined || req.api_key == '' || Env.get('APP_API_KEY') != req.api_key) return response.status('401').json(makeResp(false, null, 'You dont have access to API.'))

    await next()
  }
}

module.exports = SecureApi
