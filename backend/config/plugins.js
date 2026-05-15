'use strict'

module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      jwtSecret: env('JWT_SECRET'),
    },
  },
  email: {
    config: {
      provider: '@strapi/provider-email-nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USER', ''),
          pass: env('SMTP_PASS', ''),
        },
        secure: env.bool('SMTP_SECURE', false),
        tls: { rejectUnauthorized: false },
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'Focus Space <noreply@focusspace.co.za>'),
        defaultReplyTo: env('SMTP_REPLY_TO', 'focusconference@mut.ac.za'),
      },
    },
  },
})
