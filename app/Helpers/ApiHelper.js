'use strict'

const makeResp = (success, data, message = null, errors = null) => {
    let response
    if (data != null) {
        try {
            data = data.toJSON()
            if (data.lastPage != null && data.perPage != null) {
                response = {
                    success: success,
                    data: data.data,
                    message: message,
                    errors: errors,
                    pagination: {
                        total: data.total,
                        perPage: data.perPage,
                        page: data.page,
                        lastPage: data.lastPage
                    }
                }
            } else {
                response = baseResp(success, data, message, errors)
            }
        } catch (error) {
            response = baseResp(success, data, message, errors)
        }
    } else {
        response = baseResp(success, data, message, errors)
    }

    return response
}

const baseResp = (success, data, message = null, errors = null) => {
    return {
        success: success,
        data: data,
        message: message,
        errors: errors,
    }
}

module.exports = {
    makeResp
}