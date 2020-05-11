'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const uuid = use('uuid-random')

const baseResp = (success, data, message = null, errors = null, meta = null) => {
    let response = {
        success: success,
        data: data,
        message: message,
        errors: errors,
    }
    if (meta != null) response['meta'] = meta
    return response
}

const queryBuilder = async (model, request, search = [], defaultWith = []) => {
    let data = []
    let query = model
    if (request.search) {
        if (request.search.split('-').length == 5) {
            query = query.where('uuid', request.search)
        } else {
            query = query.where(function () {
                for (let i = 0; i < search.length; i++) {
                    this.orWhere(search[i], 'LIKE', `%${request.search}%`)
                }
            })
        }
    }
    if (request.order_col) query = query.orderBy(request.order_col.split(':')[0], request.order_col.split(':')[1])
    if (Array.isArray(request.filter_col)) {
        request.filter_col.forEach(function (column, i) {
            if (column && request.filter_val[i]) query = query.where(column, request.filter_val[i]);
        })
    }
    if (Array.isArray(request.with)) {
        request.with.forEach(function (relation) {
            query = query.with(relation)
        })
    }
    // Default With
    if (defaultWith.length > 0) {
        defaultWith.forEach(function (relation) {
            query = query.with(relation)
        })
    }
    if (Array.isArray(request.not_col)) {
        request.not_col.forEach(function (column, i) {
            if (column && request.not_val[i]) query = query.whereNot(column, request.not_val[i]);
        })
    }

    if (request.with_trashed) query = query.withTrashed()
    if (request.only_trashed) query = query.onlyTrashed()

    data = await query.paginate(request.page || 1, request.paginate || 20)

    return data
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

const uploadImage = async (request, fileParam, folder = '/', fileName = null, size = '10mb') => {
    const img = request.file(fileParam, {
        // types: ['image'],
        size: size,
        extnames: ['png', 'jpg']
    })

    if (fileName == null) {
        fileName = new Date().getTime() + '-' + uuid() + "." + img.extname
    } else {
        fileName = fileName + '.' + img.extname
    }

    await img.move(Helpers.publicPath('img/' + folder), {
        name: fileName,
        overwrite: true
    })

    // console.log(!img.moved());
    // console.log(folder + fileName);

    if (!img.moved()) {
        console.log(img.error().message);
        return false
    }

    return 'img/' + folder + fileName
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