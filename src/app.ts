import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { startAllJobs } from './jobs'

import { appRoutes } from './http/routes'

export const app = fastify({})

app.register(appRoutes, { prefix: '/api' })

// QUEUE JOBS
startAllJobs()

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }
  if (env.NODE_ENV === 'development') {
    console.error(error)
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
