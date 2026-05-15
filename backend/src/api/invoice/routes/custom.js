'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/invoices/my',
      handler: 'invoice.myInvoices',
      config: { auth: false, policies: [] },
    },
  ],
}
