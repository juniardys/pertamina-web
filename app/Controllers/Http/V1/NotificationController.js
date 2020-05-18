'use strict'
const Notification = use('App/Models/Notification')
const { queryBuilder, baseResp, pushNotification } = use('App/Helpers')
const NotificationTransformer = use('App/Transformers/V1/NotificationTransformer')
const Database = use('Database')

class NotificationController {
    async countUnread({ response, auth }) {
        let query = Notification.query().where('is_read', false).where('user_uuid', auth.user.uuid)
        const data = await query.getCount()

        return response.status(200).json(baseResp(true, { count: parseInt(data) }, 'Data Count Unread Notification sukses diterima'))
    }

    builder(model, request, user_uuid = null) {
        let query = model
        if (user_uuid != null) query = query.where('user_uuid', user_uuid)
        if (request.order_col) query = query.orderBy(request.order_col.split(':')[0], request.order_col.split(':')[1])

        return query
    }

    async get({ request, response, transform, auth }) {
        const req = request.all()
        
        let builder = this.builder(Notification.query(), req, auth.user.uuid)
        builder = await builder.paginate(req.page || 1, req.paginate || 20)
        const data = await transform.paginate(builder, NotificationTransformer)
        
        const updateData = this.builder(Database.table('notifications'), req, auth.user.uuid)
        await updateData.update({ is_read: true })

        return response.status(200).json(baseResp(true, data, 'Data Notifications sukses diterima'))
    }

    async create({ response, auth }) {
        await pushNotification(auth.user.uuid, 'Test', 'Test Notification') // for debuging api
        return response.status(200).json(baseResp(true, null, 'THIS API ONLY FOR DEBUG'))
    }
}

module.exports = NotificationController