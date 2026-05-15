'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/payments/my',
      handler: 'payment.myPayments',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/payments/:id/verify',
      handler: 'payment.verify',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/payments/:id/reject',
      handler: 'payment.reject',
      config: { policies: [] },
    },
  ],
}
