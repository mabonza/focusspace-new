'use strict'

module.exports = {
  async subscribe(ctx) {
    const { email } = ctx.request.body ?? {}

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ctx.badRequest('A valid email is required')
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = Number(process.env.BREVO_LIST_ID) || 0

    if (!apiKey || !listId) {
      strapi.log.warn('[Newsletter] BREVO_API_KEY or BREVO_LIST_ID not set')
      return ctx.send({ ok: true }) // fail silently so the form still shows success
    }

    try {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          listIds: [listId],
          updateEnabled: true,
        }),
      })

      // 201 = created, 204 = already exists & updated — both are success
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        strapi.log.error('[Newsletter] Brevo error:', err)
        return ctx.badRequest(err?.message ?? 'Subscription failed')
      }

      return ctx.send({ ok: true })
    } catch (err) {
      strapi.log.error('[Newsletter] Network error:', err.message)
      return ctx.internalServerError('Could not reach email service')
    }
  },
}
