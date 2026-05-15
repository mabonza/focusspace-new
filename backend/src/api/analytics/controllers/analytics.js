'use strict'

module.exports = {
  async overview(ctx) {
    const strapi = ctx.strapi ?? global.strapi
    try {
      const [
        totalConferences,
        totalRegistrations,
        totalAbstracts,
        totalReviews,
        totalPayments,
        pendingPayments,
        approvedPayments,
        totalCertificates,
        totalAttendees,
      ] = await Promise.all([
        strapi.db.query('api::conference.conference').count(),
        strapi.db.query('api::conference-registration.conference-registration').count(),
        strapi.db.query('api::abstract.abstract').count(),
        strapi.db.query('api::review.review').count(),
        strapi.db.query('api::payment.payment').count(),
        strapi.db.query('api::payment.payment').count({ where: { status: 'pending' } }),
        strapi.db.query('api::payment.payment').count({ where: { status: 'approved' } }),
        strapi.db.query('api::certificate.certificate').count(),
        strapi.db.query('api::attendance.attendance').count({ where: { attendanceStatus: 'checked-in' } }),
      ])

      // Revenue from approved payments
      const approved = await strapi.db.query('api::payment.payment').findMany({
        where: { status: 'approved' },
        select: ['amount', 'currency'],
      })
      const totalRevenue = approved.reduce((sum, p) => sum + (p.amount ?? 0), 0)

      // Abstract status breakdown
      const abstractStatuses = ['draft', 'submitted', 'under-review', 'revision-requested', 'accepted', 'rejected']
      const abstractBreakdown = await Promise.all(
        abstractStatuses.map(async (status) => ({
          status,
          count: await strapi.db.query('api::abstract.abstract').count({ where: { status } }),
        }))
      )

      return ctx.send({
        totalConferences,
        totalRegistrations,
        totalAbstracts,
        totalReviews,
        totalPayments,
        pendingPayments,
        approvedPayments,
        totalCertificates,
        totalAttendees,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        abstractBreakdown,
      })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },

  async registrationsByDate(ctx) {
    const strapi = ctx.strapi ?? global.strapi
    try {
      const regs = await strapi.db.query('api::conference-registration.conference-registration').findMany({
        select: ['createdAt'],
        orderBy: { createdAt: 'asc' },
        limit: 1000,
      })

      const grouped = {}
      for (const r of regs) {
        const day = r.createdAt?.toISOString?.()?.split('T')[0] ?? String(r.createdAt).split('T')[0]
        grouped[day] = (grouped[day] ?? 0) + 1
      }

      const data = Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

      return ctx.send({ data })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },

  async paymentsByConference(ctx) {
    const strapi = ctx.strapi ?? global.strapi
    try {
      const payments = await strapi.db.query('api::payment.payment').findMany({
        where: { status: 'approved' },
        populate: ['registration'],
        limit: 2000,
      })

      const grouped = {}
      for (const p of payments) {
        const confId = p.registration?.conference ?? 'Unknown'
        if (!grouped[confId]) grouped[confId] = { label: String(confId), total: 0, count: 0 }
        grouped[confId].total += p.amount ?? 0
        grouped[confId].count += 1
      }

      // Enrich with conference titles
      const confIds = Object.keys(grouped).filter((k) => k !== 'Unknown' && !isNaN(Number(k)))
      const conferences = await strapi.db.query('api::conference.conference').findMany({
        where: { id: { $in: confIds.map(Number) } },
        select: ['id', 'title'],
      })
      const titleMap = Object.fromEntries(conferences.map((c) => [String(c.id), c.title]))
      for (const [key, val] of Object.entries(grouped)) {
        val.label = titleMap[key] ?? `Conference #${key}`
        val.total = Math.round(val.total * 100) / 100
      }

      return ctx.send({ data: Object.values(grouped) })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },

  async countryDistribution(ctx) {
    const strapi = ctx.strapi ?? global.strapi
    try {
      const users = await strapi.db.query('plugin::users-permissions.user').findMany({
        select: ['country'],
        limit: 5000,
      })

      const grouped = {}
      for (const u of users) {
        const country = u.country || 'Unknown'
        grouped[country] = (grouped[country] ?? 0) + 1
      }

      const data = Object.entries(grouped)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)

      return ctx.send({ data })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },
}
