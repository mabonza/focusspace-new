'use strict'

const { factories } = require('@strapi/strapi')
const { sendTemplateEmail } = require('../../../services/email')

function parseRelationId(value) {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object') {
    if (Array.isArray(value.connect)) return value.connect[0] ?? null
    if (value.connect?.id) return value.connect.id
    if (typeof value.id === 'number') return value.id
  }
  const n = Number(value)
  return isNaN(n) ? null : n
}

module.exports = factories.createCoreController(
  'api::conference-registration.conference-registration',
  ({ strapi }) => ({

    async create(ctx) {
      const { user } = ctx.state
      if (!user) return ctx.unauthorized()

      const body = ctx.request.body?.data ?? {}
      const conferenceId = parseRelationId(body.conference)
      if (!conferenceId) return ctx.badRequest('conference is required')

      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`
      const conferenceFee = Number(body.conferenceFee ?? 7250)
      const preconferenceFee = body.preconferenceAttendance ? Number(body.preconferenceFee ?? 2000) : 0
      const totalFee = conferenceFee + preconferenceFee

      const registration = await strapi.db
        .query('api::conference-registration.conference-registration')
        .create({
          data: {
            titlePrefix: body.titlePrefix || null,
            phone: body.phone || null,
            institution: body.institution || null,
            billingAddress1: body.billingAddress1 || null,
            billingAddress2: body.billingAddress2 || null,
            city: body.city || null,
            stateProvince: body.stateProvince || null,
            postalCode: body.postalCode || null,
            country: body.country || null,
            vatNumber: body.vatNumber || null,
            preconferenceAttendance: !!body.preconferenceAttendance,
            abstractSubmission: !!body.abstractSubmission,
            conferenceFee,
            preconferenceFee,
            totalFee,
            registrationType: body.registrationType || 'in-person',
            ticketCategory: body.ticketCategory || 'standard',
            paymentStatus: 'pending',
            attendanceStatus: 'registered',
            invoiceNumber,
            user: user.id,
            conference: conferenceId,
          },
          populate: ['conference', 'user'],
        })

      await strapi.db.query('api::invoice.invoice').create({
        data: {
          invoiceNumber,
          currency: 'ZAR',
          amount: totalFee,
          paymentStatus: 'pending',
          issuedDate: new Date().toISOString().split('T')[0],
          registration: registration.id,
          user: user.id,
        },
      }).catch(() => null)

      // Send confirmation + invoice emails
      const fullUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
        select: ['firstName', 'lastName', 'email'],
      })
      const conf = registration.conference
      const firstName = fullUser?.firstName || fullUser?.email?.split('@')[0] || 'Delegate'
      const conferenceTitle = conf?.title ?? 'Focus Conference'

      await sendTemplateEmail(strapi, 'registration-confirmation', fullUser?.email ?? user.email, {
        firstName,
        conference: conferenceTitle,
        invoiceNumber,
      })
      await sendTemplateEmail(strapi, 'invoice-issued', fullUser?.email ?? user.email, {
        firstName,
        conference: conferenceTitle,
        invoiceNumber,
        currency: 'ZAR',
        amount: totalFee.toFixed(2),
      })

      return ctx.send({ data: registration })
    },

    async find(ctx) {
      const { user } = ctx.state
      if (!user) return ctx.unauthorized()

      const registrations = await strapi.db
        .query('api::conference-registration.conference-registration')
        .findMany({
          where: { user: user.id },
          populate: ['conference', 'invoice'],
          orderBy: { createdAt: 'desc' },
          limit: 50,
        })

      return ctx.send({ data: registrations, meta: { total: registrations.length } })
    },

    async findOne(ctx) {
      const { id } = ctx.params
      const reg = await strapi.db
        .query('api::conference-registration.conference-registration')
        .findOne({
          where: { id: Number(id) },
          populate: ['conference', 'user', 'invoice'],
        })
      if (!reg) return ctx.notFound()
      return ctx.send({ data: reg })
    },

    async checkForConference(ctx) {
      const { user } = ctx.state
      if (!user) return ctx.unauthorized()

      const conferenceId = ctx.query?.conferenceId
      if (!conferenceId) return ctx.badRequest('conferenceId is required')

      const reg = await strapi.db
        .query('api::conference-registration.conference-registration')
        .findOne({
          where: { user: user.id, conference: Number(conferenceId) },
          populate: ['conference', 'invoice'],
        })

      return ctx.send({ data: reg ?? null })
    },
  })
)
