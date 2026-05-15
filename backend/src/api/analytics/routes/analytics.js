'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/analytics/overview',
      handler: 'analytics.overview',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/analytics/registrations-by-date',
      handler: 'analytics.registrationsByDate',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/analytics/payments-by-conference',
      handler: 'analytics.paymentsByConference',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/analytics/country-distribution',
      handler: 'analytics.countryDistribution',
      config: { policies: [] },
    },
  ],
}
