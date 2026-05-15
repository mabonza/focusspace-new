'use strict'

const ADMIN_ROLES = ['admin', 'organizer']

async function verifyAdmin(ctx, strapi) {
  const authHeader = ctx.request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  try {
    const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token)
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id },
      select: ['id', 'email', 'userRole'],
    })
    if (!user || !ADMIN_ROLES.includes(user.userRole)) return null
    return user
  } catch {
    return null
  }
}

module.exports = {
  async listUsers(ctx) {
    const admin = await verifyAdmin(ctx, strapi)
    if (!admin) return ctx.unauthorized('Admin access required')

    try {
      const { search = '', role = '', page = 1, pageSize = 20 } = ctx.query

      const where = {}
      if (role && role !== 'all') where.userRole = role

      const allUsers = await strapi.db.query('plugin::users-permissions.user').findMany({
        select: ['id', 'firstName', 'lastName', 'email', 'userRole', 'institution', 'country', 'createdAt', 'confirmed'],
        where,
        orderBy: [{ firstName: 'asc' }, { email: 'asc' }],
      })

      const filtered = search
        ? allUsers.filter((u) => {
            const s = search.toLowerCase()
            return (
              u.email?.toLowerCase().includes(s) ||
              u.firstName?.toLowerCase().includes(s) ||
              u.lastName?.toLowerCase().includes(s) ||
              (u.institution ?? '').toLowerCase().includes(s)
            )
          })
        : allUsers

      const total = filtered.length
      const start = (Number(page) - 1) * Number(pageSize)
      const paginated = filtered.slice(start, start + Number(pageSize))

      return ctx.send({
        data: paginated,
        meta: { total, page: Number(page), pageSize: Number(pageSize), pageCount: Math.ceil(total / Number(pageSize)) },
      })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },

  async updateRole(ctx) {
    const admin = await verifyAdmin(ctx, strapi)
    if (!admin) return ctx.unauthorized('Admin access required')

    try {
      const { id } = ctx.params
      const { userRole } = ctx.request.body ?? {}

      const VALID_ROLES = ['attendee', 'presenter', 'reviewer', 'organizer', 'admin']
      if (!userRole || !VALID_ROLES.includes(userRole)) {
        return ctx.badRequest(`userRole must be one of: ${VALID_ROLES.join(', ')}`)
      }

      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: Number(id) },
        select: ['id', 'email'],
      })
      if (!user) return ctx.notFound('User not found')

      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: Number(id) },
        data: { userRole },
      })

      return ctx.send({ data: { id: Number(id), userRole } })
    } catch (err) {
      return ctx.internalServerError(err.message)
    }
  },
}
