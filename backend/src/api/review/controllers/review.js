'use strict'

const { factories } = require('@strapi/strapi')

function parseId(value) {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object') {
    if (Array.isArray(value.connect)) {
      const first = value.connect[0]
      return typeof first === 'number' ? first : (first?.id ?? null)
    }
    if (value.id) return Number(value.id)
  }
  const n = Number(value)
  return isNaN(n) ? null : n
}

module.exports = factories.createCoreController('api::review.review', ({ strapi }) => ({

  async create(ctx) {
    const { user } = ctx.state
    if (!user) return ctx.unauthorized()

    const body = ctx.request.body?.data ?? {}
    const abstractId = parseId(body.abstract)
    const reviewerId = parseId(body.reviewer) ?? user.id

    if (!abstractId) return ctx.badRequest('abstract is required')
    if (!body.recommendation) return ctx.badRequest('recommendation is required')

    const review = await strapi.db.query('api::review.review').create({
      data: {
        score: body.score ?? null,
        comments: body.comments ?? '',
        recommendation: body.recommendation,
        submittedAt: body.submittedAt ?? new Date().toISOString(),
        abstract: abstractId,
        reviewer: reviewerId,
      },
      populate: ['abstract', 'reviewer'],
    })

    return ctx.send({ data: review })
  },

  async update(ctx) {
    const { id } = ctx.params
    const body = ctx.request.body?.data ?? {}

    const data = {}
    if (body.score !== undefined) data.score = body.score
    if (body.comments !== undefined) data.comments = body.comments
    if (body.recommendation !== undefined) data.recommendation = body.recommendation
    if (body.submittedAt !== undefined) data.submittedAt = body.submittedAt

    const review = await strapi.db.query('api::review.review').update({
      where: { id: Number(id) },
      data,
      populate: ['abstract', 'reviewer'],
    })

    return ctx.send({ data: review })
  },
}))
