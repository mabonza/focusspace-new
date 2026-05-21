'use strict'

const { factories } = require('@strapi/strapi')
const { sendTemplateEmail } = require('../../../services/email')

// Parse a relation value that may be a plain ID or { connect: [...] }
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

module.exports = factories.createCoreController('api::abstract.abstract', ({ strapi }) => ({

  // ── Override create to bypass HTTP relation validation ────────────────────
  async create(ctx) {
    const { user } = ctx.state
    if (!user) return ctx.unauthorized()

    const body = ctx.request.body?.data ?? {}
    const conferenceId = parseRelationId(body.conference)

    if (!body.title) return ctx.badRequest('title is required')
    if (!body.abstractText) return ctx.badRequest('abstractText is required')
    if (!conferenceId) return ctx.badRequest('conference is required')

    const data = {
      title: body.title,
      abstractText: body.abstractText,
      keywords: body.keywords || '',
      presentationType: body.presentationType || 'oral',
      status: body.status || 'draft',
      user: user.id,
      conference: conferenceId,
    }
    if (body.subtheme) data.subtheme = body.subtheme
    if (body.coAuthors) data.coAuthors = body.coAuthors
    if (body.institution) data.institution = body.institution
    if (body.documentUpload) data.documentUpload = body.documentUpload

    const abstract = await strapi.db.query('api::abstract.abstract').create({
      data,
      populate: ['conference', 'user'],
    })

    // Send confirmation email when submitted directly
    if (data.status === 'submitted') {
      const authorUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
        select: ['firstName', 'email'],
      })
      if (authorUser?.email) {
        const dashboardUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/abstracts`
        await sendTemplateEmail(strapi, 'abstract-submitted', authorUser.email, {
          firstName: authorUser.firstName || authorUser.email.split('@')[0],
          title: abstract.title,
          dashboardUrl,
        })
        await strapi.db.query('api::notification.notification').create({
          data: {
            title: 'Abstract Submitted',
            message: `Your abstract "${abstract.title}" has been received and is under review.`,
            type: 'abstract',
            readStatus: false,
            user: user.id,
          },
        }).catch(() => null)
      }
    }

    return { data: abstract }
  },

  // ── Override update to bypass HTTP relation validation ────────────────────
  async update(ctx) {
    const { id } = ctx.params
    const body = ctx.request.body?.data ?? {}

    // Capture old status before update to detect transitions
    const existing = await strapi.db.query('api::abstract.abstract').findOne({
      where: { id: Number(id) },
      populate: ['user', 'conference'],
    })

    const data = {}
    if (body.title !== undefined) data.title = body.title
    if (body.abstractText !== undefined) data.abstractText = body.abstractText
    if (body.keywords !== undefined) data.keywords = body.keywords
    if (body.presentationType !== undefined) data.presentationType = body.presentationType
    if (body.status !== undefined) data.status = body.status
    if (body.subtheme !== undefined) data.subtheme = body.subtheme
    if (body.coAuthors !== undefined) data.coAuthors = body.coAuthors
    if (body.institution !== undefined) data.institution = body.institution
    if (body.documentUpload !== undefined) data.documentUpload = body.documentUpload
    if (body.reviewerComments !== undefined) data.reviewerComments = body.reviewerComments
    if (body.adminComments !== undefined) data.adminComments = body.adminComments

    const conferenceId = parseRelationId(body.conference)
    if (conferenceId) data.conference = conferenceId

    const abstract = await strapi.db.query('api::abstract.abstract').update({
      where: { id: Number(id) },
      data,
      populate: ['conference', 'user'],
    })

    // Send email + in-app notification on status transitions
    const newStatus = body.status
    const oldStatus = existing?.status
    if (newStatus && newStatus !== oldStatus && existing?.user?.id) {
      const authorUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: existing.user.id },
        select: ['firstName', 'email'],
      })
      const firstName = authorUser?.firstName || authorUser?.email?.split('@')[0] || 'Author'
      const to = authorUser?.email
      const title = existing.title
      const dashboardUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/abstracts`

      let notifTitle = null
      let notifMessage = null

      if (newStatus === 'submitted' && oldStatus === 'draft') {
        await sendTemplateEmail(strapi, 'abstract-submitted', to, { firstName, title, dashboardUrl })
        notifTitle = 'Abstract Submitted'
        notifMessage = `Your abstract "${title}" has been received and is under review.`
      } else if (newStatus === 'accepted') {
        await sendTemplateEmail(strapi, 'abstract-accepted', to, { firstName, title, dashboardUrl })
        notifTitle = 'Abstract Accepted'
        notifMessage = `Congratulations! Your abstract "${title}" has been accepted.`
      } else if (newStatus === 'rejected') {
        await sendTemplateEmail(strapi, 'abstract-rejected', to, { firstName, title, dashboardUrl })
        notifTitle = 'Abstract Not Accepted'
        notifMessage = `Your abstract "${title}" was not accepted at this time.`
      } else if (newStatus === 'revision-requested') {
        await sendTemplateEmail(strapi, 'abstract-revision-requested', to, {
          firstName, title, dashboardUrl,
          comments: body.adminComments || body.reviewerComments || '',
        })
        notifTitle = 'Revision Requested'
        notifMessage = `Your abstract "${title}" requires revisions before it can be accepted.`
      }

      if (notifTitle) {
        await strapi.db.query('api::notification.notification').create({
          data: { title: notifTitle, message: notifMessage, type: 'abstract', readStatus: false, user: existing.user.id },
        }).catch(() => null)
      }
    }

    return { data: abstract }
  },

  // ── Override find to bypass HTTP relation validation ─────────────────────
  async find(ctx) {
    const conferenceId = ctx.query?.conferenceId ? Number(ctx.query.conferenceId) : null
    const statusFilter = ctx.query?.status

    const reviewerId = ctx.query?.reviewerId ? Number(ctx.query.reviewerId) : null

    const where = {}
    if (conferenceId) where.conference = conferenceId
    if (statusFilter && statusFilter !== 'all') where.status = statusFilter
    if (reviewerId) where.assignedReviewer = reviewerId

    const abstracts = await strapi.db.query('api::abstract.abstract').findMany({
      where,
      populate: ['conference', 'user', 'assignedReviewer', 'documentUpload'],
      orderBy: [{ subtheme: 'asc' }, { createdAt: 'asc' }],
      limit: 200,
    })

    return ctx.send({ data: abstracts, meta: { total: abstracts.length } })
  },

  // ── Override findOne to bypass HTTP relation validation ───────────────────
  async findOne(ctx) {
    const { id } = ctx.params
    const abstract = await strapi.db.query('api::abstract.abstract').findOne({
      where: { id: Number(id) },
      populate: ['conference', 'user', 'reviews', 'documentUpload', 'assignedReviewer'],
    })
    if (!abstract) return ctx.notFound()
    return ctx.send({ data: abstract })
  },

  // ── Get abstracts for the current authenticated user ─────────────────────
  async myAbstracts(ctx) {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return ctx.unauthorized()
    const rawToken = authHeader.slice(7)
    let userId
    try {
      const payload = await strapi.plugins['users-permissions'].services.jwt.verify(rawToken)
      userId = payload.id
    } catch {
      return ctx.unauthorized()
    }
    if (!userId) return ctx.unauthorized()

    const abstracts = await strapi.db.query('api::abstract.abstract').findMany({
      where: { user: userId },
      populate: ['conference', 'user', 'reviews', 'documentUpload'],
      orderBy: { createdAt: 'desc' },
      limit: 100,
    })

    return ctx.send({ data: abstracts })
  },

  // ── Assign a reviewer to an abstract ─────────────────────────────────────
  async assignReviewer(ctx) {
    const { id } = ctx.params
    const { reviewerId } = ctx.request.body ?? {}

    if (!reviewerId) return ctx.badRequest('reviewerId is required')

    const abstract = await strapi.db.query('api::abstract.abstract').findOne({
      where: { id },
      populate: ['user', 'conference'],
    })
    if (!abstract) return ctx.notFound('Abstract not found')

    const reviewer = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: reviewerId },
    })
    if (!reviewer) return ctx.notFound('Reviewer not found')

    const updated = await strapi.db.query('api::abstract.abstract').update({
      where: { id },
      data: {
        assignedReviewer: reviewerId,
        status: abstract.status === 'submitted' ? 'under-review' : abstract.status,
      },
    })

    if (reviewer.email) {
      await sendTemplateEmail(strapi, 'reviewer-assignment', reviewer.email, {
        firstName: reviewer.firstName ?? reviewer.username ?? 'Reviewer',
        abstractTitle: abstract.title,
        dashboardUrl: `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/dashboard/reviews`,
      })
    }

    return { data: updated }
  },

  // ── Get all users with reviewer/organizer/admin role ──────────────────────
  async getReviewers(ctx) {
    try {
      const reviewers = await strapi.db.query('plugin::users-permissions.user').findMany({
        where: {
          $or: [
            { userRole: 'reviewer' },
            { userRole: 'organizer' },
            { userRole: 'admin' },
          ],
        },
        select: ['id', 'firstName', 'lastName', 'email', 'userRole'],
        orderBy: { firstName: 'asc' },
      })
      return ctx.send({ data: reviewers })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },

  // ── Export abstracts as CSV ───────────────────────────────────────────────
  async exportCsv(ctx) {
    try {
      const abstracts = await strapi.db.query('api::abstract.abstract').findMany({
        populate: ['user', 'conference', 'assignedReviewer'],
        orderBy: [{ subtheme: 'asc' }, { createdAt: 'asc' }],
        limit: 5000,
      })

      const escape = (v) => {
        const s = String(v ?? '')
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
          return `"${s.replace(/"/g, '""')}"`
        }
        return s
      }

      const rows = [
        ['Title', 'Author', 'Co-Authors', 'Institution', 'Email', 'Subtheme', 'Presentation Type', 'Status', 'Assigned Reviewer', 'Keywords', 'Conference', 'Submitted At'].join(','),
        ...abstracts.map((a) =>
          [
            a.title,
            a.user ? `${a.user.firstName ?? ''} ${a.user.lastName ?? ''}`.trim() || a.user.email : '',
            a.coAuthors ?? '',
            a.institution ?? a.user?.institution ?? '',
            a.user?.email ?? '',
            a.subtheme ?? '',
            a.presentationType ?? '',
            a.status,
            a.assignedReviewer ? `${a.assignedReviewer.firstName ?? ''} ${a.assignedReviewer.lastName ?? ''}`.trim() || a.assignedReviewer.email : '',
            a.keywords ?? '',
            a.conference?.title ?? '',
            a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
          ].map(escape).join(',')
        ),
      ]

      ctx.set('Content-Type', 'text/csv; charset=utf-8')
      ctx.set('Content-Disposition', 'attachment; filename="abstracts.csv"')
      ctx.body = '﻿' + rows.join('\r\n')
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },
}))
