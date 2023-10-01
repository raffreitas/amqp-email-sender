import { FastifyInstance } from 'fastify'

import { mailRoutes } from './mail.routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(mailRoutes, { prefix: '/mail' })
}
