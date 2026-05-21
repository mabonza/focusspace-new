'use strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/abstracts/my',
      handler: 'abstract.myAbstracts',
      config: { auth: false, policies: [] },
    },
    {
      method: 'GET',
      path: '/abstracts/reviewers',
      handler: 'abstract.getReviewers',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/abstracts/export/csv',
      handler: 'abstract.exportCsv',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/abstracts/:id/assign-reviewer',
      handler: 'abstract.assignReviewer',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/abstracts/test-email',
      handler: 'abstract.testEmail',
      config: { auth: false, policies: [] },
    },
  ],
}
