'use strict'
const Notification = use('App/Models/Notification')
const { queryBuilder, baseResp, pushNotification } = use('App/Helpers')
const NotificationTransformer = use('App/Transformers/V1/NotificationTransformer')

class NotificationController {
    async get({ request, response, transform }) {
        await pushNotification('fd4d0cb0-a4f1-45e2-80a8-6da560fdd775', 'Test', 'Test Notification')
        const builder = await queryBuilder(Notification.query(), request.all(), ['user_uuid', 'title', 'body', 'type'])
        const data = await transform.paginate(builder, NotificationTransformer)

        return response.status(200).json(baseResp(true, data, 'Data Notifications sukses diterima'))
    }
}

module.exports = NotificationController