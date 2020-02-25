'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const uuid = use('uuid-random')

const baseResp = (success, data, message = null, errors = null) => {
    return {
        success: success,
        data: data,
        message: message,
        errors: errors,
    }
}

const queryBuilder = async (model, request, search = []) => {
    let data = []
    let paginate = false
    let query = model
    if (request.order && request.order_val) query = query.orderBy(request.order, request.order_val);
    if (request.filter && request.filter_val) query = query.where(request.filter, request.filter_val);
    if (request.search) {
        if (request.search.split('-').length == 5) {
            query = query.where('uuid', request.search)
        } else {
            for (let i = 0; i < search.length; i++) {
                query = query.orWhere(search[i], 'LIKE', `%${request.search}%`)
            }
        }
    }

    if (await query.getCount() <= 1) {
        data = await query.fetch()
    } else {
        data = await query.paginate(request.page || 1, request.paginate || 20)
        paginate = true
    }

    return {
        data: data,
        paginate: paginate
    }
}

const splitString = (charToSplit, string) => {
    const splited = string.split(charToSplit);
    let result = ""

    // Display array values on page
    for (var i = 0; i < splited.length; i++) {
        result = result + " " + splited[i]
    }

    return result
}

const slugify = async (text, table = null, column = null) => {
    let firstSlug = text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text

    if (table !== null && column !== null) {
        let checkSlug = 1
        let slug = null
        while (checkSlug >= 1) {
            slug = text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '')             // Trim - from end of text
                + '-' + Math.floor(1000 + Math.random() * 9000)
            let existSlug = await Database.table(table).where(column, slug).count()
            checkSlug = existSlug[0].count
        }

        return slug
    } else {
        return firstSlug
    }
}

const uploadImage = async (request, session, fileParam, folder = null) => {
    const img = request.file(fileParam, {
        types: ['image'],
        size: '2mb'
    })

    if (folder == null) folder = '/'

    const fileName = new Date().getTime() + '-' + uuid() + "." + img.subtype

    await img.move(Helpers.publicPath(folder), {
        name: fileName,
        overwrite: true
    })

    if (!img.moved()) {
        session.flash({
            sweetalert: {
                type: 'error',
                title: 'Error Image Validation!',
                message: img.error().message,
                name: fileParam
            }
        })
        session.flashAll()

        return false
    }

    return folder + fileName
}

const rndmChr = async (length, table = null, column = null) => {
    let check = 1
    let result = '';
    while (check > 0) {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        if (table !== null && column !== null) {
            let exist = await Database.table(table).where(column, result).count()
            check = exist[0].count
        } else {
            check = 0
        }
    }

    return result
}

module.exports = {
    baseResp,
    queryBuilder,
    splitString,
    slugify,
    uploadImage,
    rndmChr
}