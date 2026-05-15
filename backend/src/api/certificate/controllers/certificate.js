'use strict'

const { createCoreController } = require('@strapi/strapi').factories
const crypto = require('crypto')

module.exports = createCoreController('api::certificate.certificate', ({ strapi }) => ({
  async verifyByCode(ctx) {
    const { code } = ctx.params

    const cert = await strapi.db.query('api::certificate.certificate').findOne({
      where: { verificationCode: code },
      populate: ['user', 'conference'],
    })

    if (!cert) {
      return ctx.notFound('Certificate not found or verification code is invalid.')
    }

    return {
      data: {
        valid: true,
        certificateId: cert.certificateId,
        certificateType: cert.certificateType,
        issuedDate: cert.issuedDate,
        holder: {
          firstName: cert.user?.firstName,
          lastName: cert.user?.lastName,
          email: cert.user?.email,
        },
        conference: {
          title: cert.conference?.title,
          year: cert.conference?.year,
          location: cert.conference?.location,
        },
      },
    }
  },

  async issue(ctx) {
    const { userId, conferenceId, certificateType } = ctx.request.body ?? {}

    if (!userId || !conferenceId || !certificateType) {
      return ctx.badRequest('userId, conferenceId, and certificateType are required')
    }

    // Check not already issued
    const existing = await strapi.db.query('api::certificate.certificate').findOne({
      where: { user: userId, conference: conferenceId, certificateType },
    })
    if (existing) {
      return { data: existing, message: 'Certificate already issued' }
    }

    const verificationCode = crypto.randomBytes(12).toString('hex').toUpperCase()
    const certificateId = `FS-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    const cert = await strapi.db.query('api::certificate.certificate').create({
      data: {
        certificateId,
        verificationCode,
        certificateType,
        issuedDate: new Date().toISOString().split('T')[0],
        user: userId,
        conference: conferenceId,
      },
    })

    return { data: cert }
  },
}))
