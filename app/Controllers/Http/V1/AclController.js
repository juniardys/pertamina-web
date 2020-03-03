'use strict'

const { baseResp } = use('App/Helpers')
const { get, jsTree } = use('App/Helpers/ACL')

class AclController {
    get({response}) {
        return response.json(jsTree())
        
        return response.status(200).json(baseResp(true, get(), 'Data List Akses Berhasil diterima'))
    }
}

module.exports = AclController
