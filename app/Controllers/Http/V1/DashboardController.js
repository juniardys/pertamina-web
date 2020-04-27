'use strict'

const User = use('App/Models/User')
const Spbu = use('App/Models/Spbu')
const Product = use('App/Models/Product')
const { baseResp } = use('App/Helpers')

class DashboardController {
    async get({ response }) {
        const countUsers = await User.query().getCount()
        const countSpbu = await Spbu.query().getCount()
        const countProducts = await Product.query().getCount()

        return response.status(200).json(baseResp(true, {
            countUsers: countUsers,
            countSpbu: countSpbu,
            countProducts: countProducts,
        }, 'Data Dashboard Berhasil diterima'))
    }
}

module.exports = DashboardController
