'use strict'

const { createCoreController } = require('@strapi/strapi').factories
const { sendTemplateEmail } = require('../../../services/email')

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
  async myPayments(ctx) {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return ctx.unauthorized()
    let userId
    try {
      const payload = await strapi.plugins['users-permissions'].services.jwt.verify(authHeader.slice(7))
      userId = payload.id
    } catch {
      return ctx.unauthorized()
    }
    const payments = await strapi.db.query('api::payment.payment').findMany({
      where: { user: userId },
      populate: ['invoice', 'registration', 'registration.conference'],
      orderBy: { createdAt: 'desc' },
      limit: 50,
    })
    return ctx.send({ data: payments })
  },

  async verify(ctx) {
    const { id } = ctx.params
    const adminUser = ctx.state.user

    const payment = await strapi.db.query('api::payment.payment').findOne({
      where: { id },
      populate: ['user', 'invoice', 'registration'],
    })
    if (!payment) return ctx.notFound('Payment not found')

    const updated = await strapi.db.query('api::payment.payment').update({
      where: { id },
      data: {
        status: 'approved',
        verifiedAt: new Date().toISOString(),
        verifiedBy: adminUser?.id,
      },
    })

    // Update linked invoice to paid
    if (payment.invoice?.id) {
      await strapi.db.query('api::invoice.invoice').update({
        where: { id: payment.invoice.id },
        data: { paymentStatus: 'paid' },
      })
    }
    // Update linked registration payment status
    if (payment.registration?.id) {
      await strapi.db.query('api::conference-registration.conference-registration').update({
        where: { id: payment.registration.id },
        data: { paymentStatus: 'paid' },
      })
    }

    // Send email + in-app notification
    if (payment.user?.email) {
      const reg = payment.registration
      const confTitle = reg?.conference?.title ?? 'Conference'
      await sendTemplateEmail(strapi, 'payment-approved', payment.user.email, {
        firstName: payment.user.firstName ?? 'Delegate',
        conference: confTitle,
        invoiceNumber: payment.invoice?.invoiceNumber ?? '',
      })
      await strapi.db.query('api::notification.notification').create({
        data: {
          title: 'Payment Verified',
          message: `Your payment for ${confTitle} has been verified. Your registration is confirmed.`,
          type: 'payment',
          readStatus: false,
          user: payment.user.id,
        },
      }).catch(() => null)
    }

    return { data: updated }
  },

  async reject(ctx) {
    const { id } = ctx.params
    const { reason = 'Payment proof could not be verified.' } = ctx.request.body ?? {}

    const payment = await strapi.db.query('api::payment.payment').findOne({
      where: { id },
      populate: ['user', 'invoice', 'registration'],
    })
    if (!payment) return ctx.notFound('Payment not found')

    const updated = await strapi.db.query('api::payment.payment').update({
      where: { id },
      data: { status: 'rejected', notes: reason },
    })

    if (payment.user?.email) {
      const confTitle = payment.registration?.conference?.title ?? 'Conference'
      await sendTemplateEmail(strapi, 'payment-rejected', payment.user.email, {
        firstName: payment.user.firstName ?? 'Delegate',
        conference: confTitle,
        invoiceNumber: payment.invoice?.invoiceNumber ?? '',
        reason,
      })
      await strapi.db.query('api::notification.notification').create({
        data: {
          title: 'Payment Proof Rejected',
          message: `Your payment proof for ${confTitle} was rejected. Reason: ${reason}`,
          type: 'payment',
          readStatus: false,
          user: payment.user.id,
        },
      }).catch(() => null)
    }

    return { data: updated }
  },
}))
