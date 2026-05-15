'use strict'
const { factories } = require('@strapi/strapi')

module.exports = factories.createCoreController('api::invoice.invoice', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params
    const invoice = await strapi.db.query('api::invoice.invoice').findOne({
      where: { id: Number(id) },
      populate: ['registration', 'registration.conference', 'registration.user'],
    })
    if (!invoice) return ctx.notFound()
    return ctx.send({ data: invoice })
  },

  async myInvoices(ctx) {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return ctx.unauthorized()
    let userId
    try {
      const payload = await strapi.plugins['users-permissions'].services.jwt.verify(authHeader.slice(7))
      userId = payload.id
    } catch {
      return ctx.unauthorized()
    }
    // Get invoices through the user's registrations
    const registrations = await strapi.db.query('api::conference-registration.conference-registration').findMany({
      where: { user: userId },
      select: ['id'],
    })
    const regIds = registrations.map((r) => r.id)
    if (regIds.length === 0) return ctx.send({ data: [] })
    const invoices = await strapi.db.query('api::invoice.invoice').findMany({
      where: { registration: { $in: regIds } },
      populate: ['registration', 'registration.conference'],
      orderBy: { issuedDate: 'desc' },
      limit: 50,
    })
    return ctx.send({ data: invoices })
  },
}))
