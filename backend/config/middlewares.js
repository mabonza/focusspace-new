'use strict'

module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'http://localhost:80',
        'http://localhost',
        'http://frontend:3000',
        'https://focusspace-frontend-production.up.railway.app',
        'https://mutfocusspace.co.za',
        'https://www.mutfocusspace.co.za',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]
