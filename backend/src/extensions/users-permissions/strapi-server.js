'use strict'

const crypto = require('crypto')
const { sendTemplateEmail } = require('../../services/email')

module.exports = (plugin) => {
  // ── Add extra user attributes ───────────────────────────────────────────────
  const extraAttributes = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phone: { type: 'string' },
    institution: { type: 'string' },
    country: { type: 'string' },
    userRole: {
      type: 'enumeration',
      enum: ['attendee', 'presenter', 'reviewer', 'organizer', 'admin'],
      default: 'attendee',
    },
  }

  const userCT = plugin.contentTypes.user
  if (userCT) {
    if (userCT.schema && userCT.schema.attributes) {
      userCT.schema.attributes = { ...userCT.schema.attributes, ...extraAttributes }
    } else if (userCT.attributes) {
      userCT.attributes = { ...userCT.attributes, ...extraAttributes }
    }
  }

  // ── Override forgotPassword to use branded email template ───────────────────
  const originalAuth = plugin.controllers.auth

  plugin.controllers.auth = ({ strapi: strapiInstance }) => {
    const base = typeof originalAuth === 'function' ? originalAuth({ strapi: strapiInstance }) : originalAuth

    return {
      ...base,

      async forgotPassword(ctx) {
        const { email } = ctx.request.body ?? {}

        if (!email || typeof email !== 'string') {
          return ctx.badRequest('email is required')
        }

        const user = await strapiInstance.db.query('plugin::users-permissions.user').findOne({
          where: { email: email.toLowerCase().trim() },
        })

        // Always respond OK to avoid email enumeration
        if (!user || !user.confirmed || user.blocked) {
          return ctx.send({ ok: true })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        await strapiInstance.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: { resetPasswordToken: resetToken },
        })

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
        const resetUrl = `${frontendUrl}/reset-password?code=${resetToken}`

        await sendTemplateEmail(strapiInstance, 'password-reset', user.email, {
          firstName: user.firstName || user.username || 'User',
          resetUrl,
        })

        return ctx.send({ ok: true })
      },
    }
  }

  return plugin
}
