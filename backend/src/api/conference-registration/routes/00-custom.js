'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/conference-registrations/check',
      handler: 'conference-registration.checkForConference',
      config: { policies: [] },
    },
  ],
}
