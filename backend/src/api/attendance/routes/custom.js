'use strict'

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/attendances/checkin',
      handler: 'attendance.checkin',
      config: { policies: [] },
    },
  ],
}
