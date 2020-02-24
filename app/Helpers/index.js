'use strict'

const { validate } = use('Validator')
const Database = use('Database')
const Helpers = use('Helpers')
const uuid = use('uuid-random')

const sweet_validate = async (request, rules, session) => {
    const validation = await validate(request, rules)
        
    if (validation.fails()) {
        // session.withErrors(validation.messages())
        const error = validation.messages()[0]
        session.flash({
            sweetalert: {
                type: 'error',
                title: splitString("_", error.field.charAt(0).toUpperCase() + error.field.slice(1)) + " " + splitString("_", error.validation.charAt(0).toUpperCase() + error.validation.slice(1)),
                message: splitString("_", error.message.charAt(0).toUpperCase() + error.message.slice(1)),
                name: error.field
            }
        })
        session.flashAll()

        return true
    }

    return false
}

const splitString = (charToSplit, string) => {
    const splited = string.split(charToSplit);
    let result = ""
    
    // Display array values on page
    for(var i = 0; i < splited.length; i++){
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
  sweet_validate,
  splitString,
  slugify,
  uploadImage,
  rndmChr
}