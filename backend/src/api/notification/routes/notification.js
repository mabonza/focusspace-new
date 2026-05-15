'use strict'

module.exports = {
  routes: [
    { method: 'GET',  path: '/notifications',           handler: 'notification.find',      config: { policies: [] } },
    { method: 'POST', path: '/notifications',           handler: 'notification.create',    config: { policies: [] } },
    { method: 'PUT',  path: '/notifications/:id',       handler: 'notification.update',    config: { policies: [] } },
    { method: 'POST', path: '/notifications/broadcast', handler: 'notification.broadcast', config: { policies: [] } },
  ],
}
