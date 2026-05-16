'use strict'

const path = require('path')

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite')

  if (client === 'mysql' || client === 'mysql2') {
    return {
      connection: {
        client: 'mysql2',
        connection: {
          host:     env('DATABASE_HOST', '127.0.0.1'),
          port:     env.int('DATABASE_PORT', 3306),
          database: env('DATABASE_NAME', 'strapi'),
          user:     env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', ''),
          ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true) } : false,
        },
        acquireConnectionTimeout: 60000,
      },
    }
  }

  if (client === 'postgres') {
    return {
      connection: {
        client: 'pg',
        connection: {
          host:     env('DATABASE_HOST', '127.0.0.1'),
          port:     env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user:     env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', ''),
          ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
        },
        acquireConnectionTimeout: 60000,
      },
    }
  }

  // Default: SQLite (local development)
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: 60000,
    },
  }
}
