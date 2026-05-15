'use strict'

const { factories } = require('@strapi/strapi')

module.exports = factories.createCoreController('api::notification.notification', ({ strapi }) => ({

  async find(ctx) {
    const { user } = ctx.state
    if (!user) return ctx.unauthorized()

    const notifications = await strapi.db.query('api::notification.notification').findMany({
      where: { user: user.id },
      orderBy: { createdAt: 'desc' },
      limit: 50,
    })

    return ctx.send({ data: notifications, meta: { total: notifications.length } })
  },

  async update(ctx) {
    const { id } = ctx.params
    const body = ctx.request.body?.data ?? {}

    const notification = await strapi.db.query('api::notification.notification').update({
      where: { id: Number(id) },
      data: { readStatus: body.readStatus },
    })

    return ctx.send({ data: notification })
  },

  async create(ctx) {
    const body = ctx.request.body?.data ?? {}

    const userId = typeof body.user === 'object' && body.user?.connect?.[0]
      ? body.user.connect[0]
      : typeof body.user === 'number' ? body.user : null

    const notification = await strapi.db.query('api::notification.notification').create({
      data: {
        title: body.title,
        message: body.message,
        type: body.type || 'system',
        readStatus: false,
        ...(userId ? { user: userId } : {}),
      },
    })

    return ctx.send({ data: notification })
  },

  // Admin: send a notification to all users or a specific user
  async broadcast(ctx) {
    const { user } = ctx.state
    if (!user) return ctx.unauthorized()
    if (!['organizer', 'admin'].includes(user.userRole)) return ctx.forbidden()

    const { title, message, type = 'system', targetUserId } = ctx.request.body ?? {}
    if (!title || !message) return ctx.badRequest('title and message are required')

    let targets
    if (targetUserId) {
      targets = [{ id: Number(targetUserId) }]
    } else {
      targets = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: { confirmed: true, blocked: false },
        select: ['id'],
      })
    }

    await Promise.all(
      targets.map((u) =>
        strapi.db.query('api::notification.notification').create({
          data: { title, message, type, readStatus: false, user: u.id },
        })
      )
    )

    return ctx.send({ ok: true, sent: targets.length })
  },
}))
