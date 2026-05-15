'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/certificates/verify/:code',
      handler: 'certificate.verifyByCode',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/certificates/issue',
      handler: 'certificate.issue',
      config: { policies: [] },
    },
  ],
}
