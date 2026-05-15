'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::attendance.attendance', ({ strapi }) => ({
  async checkin(ctx) {
    const { qrCode } = ctx.request.body ?? {}
    const checkedInBy = ctx.state.user?.id

    if (!qrCode) return ctx.badRequest('qrCode is required')

    const record = await strapi.db.query('api::attendance.attendance').findOne({
      where: { qrCode },
      populate: ['user', 'conference'],
    })

    if (!record) return ctx.notFound('QR code not recognised')
    if (record.attendanceStatus === 'checked-in') {
      return { data: record, message: 'Already checked in', alreadyCheckedIn: true }
    }

    const updated = await strapi.db.query('api::attendance.attendance').update({
      where: { id: record.id },
      data: {
        attendanceStatus: 'checked-in',
        checkedInAt: new Date().toISOString(),
        checkedInBy,
      },
    })

    // Also update conference-registration attendanceStatus
    const reg = await strapi.db.query('api::conference-registration.conference-registration').findOne({
      where: { user: record.user?.id, conference: record.conference?.id },
    })
    if (reg) {
      await strapi.db.query('api::conference-registration.conference-registration').update({
        where: { id: reg.id },
        data: { attendanceStatus: 'attended' },
      })
    }

    return { data: updated, user: record.user, conference: record.conference }
  },
}))
