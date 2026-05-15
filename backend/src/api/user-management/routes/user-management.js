'use strict'

// auth: false bypasses Strapi's scope-based permission check (which requires a
// registered content-type). Auth and role enforcement is done inside the controller.
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/user-management/users',
      handler: 'user-management.listUsers',
      config: { auth: false, policies: [] },
    },
    {
      method: 'PUT',
      path: '/user-management/users/:id/role',
      handler: 'user-management.updateRole',
      config: { auth: false, policies: [] },
    },
  ],
}
