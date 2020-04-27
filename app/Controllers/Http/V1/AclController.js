'use strict'

const { baseResp } = use('App/Helpers')
const { get, jsTree } = use('App/Helpers/ACL')

class AclController {
    get({ response }) {
        return response.status(200).json(baseResp(true, get(), 'Data List Akses Berhasil diterima'))
    }

    getJsTree({ response }) {
        return response.status(200).json(baseResp(true, jsTree(), 'Data List Akses Tree Berhasil diterima'))
    }
}

module.exports = AclController
