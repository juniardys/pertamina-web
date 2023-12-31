'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const uuid = use('uuid-random')
const Notification = use('App/Models/Notification')
const NotificationTransformer = use('App/Transformers/V1/NotificationTransformer')
const Shift = use('App/Models/Shift')
const ReportShift = use('App/Models/ReportShift')
const Spbu = use('App/Models/Spbu')
const ReportSpbu = use('App/Models/ReportSpbu')
const Island = use('App/Models/Island')
const Order = use('App/Models/Order')
const Delivery = use('App/Models/Delivery')
const FeederTank = use('App/Models/FeederTank')
const ReportIsland = use('App/Models/ReportIsland')
const ReportFeederTank = use('App/Models/ReportFeederTank')
const _ = use('lodash')
const moment = use('moment')
const imagemin = use('imagemin');
const imageminJpegtran = use('imagemin-jpegtran');
const imageminPngquant = use('imagemin-pngquant');

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
        extnames: ['png', 'jpg', 'jpeg']
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

    const files = await imagemin([Helpers.publicPath('img/' + folder + fileName)], {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.6, 0.8]
			})
		]
	});

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

const pushNotification = async (user_uuid, title, body, type = 'info') => {
    const notification = new Notification()
    notification.uuid = uuid()
    notification.user_uuid = user_uuid
    notification.title = title
    notification.body = body
    notification.type = type
    await notification.save()

    return notification
}

const setReportShift = async (shift_uuid, spbu_uuid, date) => {
    var status = false
    var shift = await Shift.query().where('uuid', shift_uuid).first()
    if (!shift) throw new Error('Shift tidak ditemukan')
    
    // Get Report or Create
    var MyReportShift = await ReportShift.query().where('shift_uuid', shift_uuid).where('spbu_uuid', spbu_uuid).where('date', moment(date).format('YYYY-MM-DD')).first()
    if (!MyReportShift) {
        MyReportShift = await ReportShift.create({
            uuid: uuid(),
            date: date,
            start_time: shift.start,
            end_time: shift.end,
            shift_uuid: shift_uuid,
            spbu_uuid: spbu_uuid,
        })
    }

    var getIsland = await Island.query().where('spbu_uuid', spbu_uuid).fetch().then((data) => data.toJSON())
    var dataIsland = []
    for (let i = 0; i < getIsland.length; i++) {
        const row = getIsland[i];
        dataIsland.push(row.uuid)
        
    }
    var getReportIsland = await ReportIsland.query().where('shift_uuid', shift_uuid).where('spbu_uuid', spbu_uuid).where('date', moment(date).format('YYYY-MM-DD')).fetch().then((data) => data.toJSON())
    for (let i = 0; i < getReportIsland.length; i++) {
        const row = getReportIsland[i];
        _.pull(dataIsland, row.island_uuid)
    }
    if (dataIsland.length == 0) {
        status = true
    }

    // Save Status
    MyReportShift.status_operator = status
    await MyReportShift.save()
}

const setReportSpbu = async (spbu_uuid, date, is_admin = false) => {
    var status = false
    var spbu = await Spbu.query().where('uuid', spbu_uuid).first()
    if (!spbu) throw new Error('SPBU tidak ditemukan')
    
    // Get Report or Create
    var MyReportSpbu = await ReportSpbu.query().where('spbu_uuid', spbu_uuid).where('date', moment(date).format('YYYY-MM-DD')).first()
    if (!MyReportSpbu) {
        MyReportSpbu = await ReportSpbu.create({
            uuid: uuid(),
            date: date,
            spbu_uuid: spbu_uuid,
        })
    }

    var getShift = await Shift.query().where('spbu_uuid', spbu_uuid).orderBy('no_order', 'asc').fetch().then((data) => data.toJSON())
    var dataShift = []
    for (let i = 0; i < getShift.length; i++) {
        const row = getShift[i];
        dataShift.push(row.uuid)
        
    }
    var getReportShift = await ReportShift.query().where('spbu_uuid', spbu_uuid).where('date', moment(date).format('YYYY-MM-DD')).fetch().then((data) => data.toJSON())
    for (let i = 0; i < getReportShift.length; i++) {
        const row = getReportShift[i];
        if (is_admin) {
            if (row.status_admin) {
                _.pull(dataShift, row.shift_uuid)
            }
        } else {
            if (row.status_operator) {
                _.pull(dataShift, row.shift_uuid)
            }
        }
    }
    if (dataShift.length == 0) {
        status = true
    }

    if (is_admin) {
        // Save Status
        MyReportSpbu.status_admin = status
        await MyReportSpbu.save()
    } else {
        // Save Status
        MyReportSpbu.status_operator = status
        await MyReportSpbu.save()
    }
}

const getShiftBefore = async (spbu_uuid, shift_uuid, date) => {
    const shifts = await Shift.query().where('spbu_uuid', spbu_uuid).orderBy('no_order', 'asc').fetch()
    var lastShift = {
        date: date,
        shift: null,
    }
    for (let i = 0; i < shifts.toJSON().length; i++) {
        const shift = shifts.toJSON()[i];
        if (shift.uuid == shift_uuid) {
            // First Shift
            if (i == 0) {
                lastShift.date = moment(date).subtract(1, "days").format('YYYY-MM-DD')
                lastShift.shift = shifts.toJSON().slice(-1)[0]
            } else {
                lastShift.shift = shifts.toJSON()[(i-1)]
            }
        }        
    }
    return lastShift
}

const getShiftAfter = async (spbu_uuid, shift_uuid, date) => {
    const shifts = await Shift.query().where('spbu_uuid', spbu_uuid).orderBy('no_order', 'desc').fetch()
    var afterShift = {
        date: date,
        shift: null,
    }
    for (let i = 0; i < shifts.toJSON().length; i++) {
        const shift = shifts.toJSON()[i];
        if (shift.uuid == shift_uuid) {
            // Last Shift
            if (i == 0) {
                afterShift.date = moment(date).add(1, "days").format('YYYY-MM-DD')
                afterShift.shift = shifts.toJSON().slice(-1)[0]
            } else {
                afterShift.shift = shifts.toJSON()[(i-1)]
            }
        }        
    }
    return afterShift
}

const setOrderStatus = async (order_uuid) => {
    const order = await Order.query().where('uuid', order_uuid).first()
    const deliveries = await Delivery.query().where('order_uuid', order_uuid).fetch()
    var total = 0
    var status = 'pending'
    for (let index = 0; index < deliveries.toJSON().length; index++) {
        const delivery = deliveries.toJSON()[index];
        total += delivery.quantity   
    }
    if (total >= order.quantity) {
        status = 'delivered'
    } else if (total > 0) {
        status = 'partial'
    }
    order.status = status
    await order.save()
}

module.exports = {
    baseResp,
    queryBuilder,
    splitString,
    slugify,
    uploadImage,
    rndmChr,
    pushNotification,
    setReportShift,
    setReportSpbu,
    getShiftBefore,
    getShiftAfter,
    setOrderStatus
}