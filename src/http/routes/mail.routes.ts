import { FastifyInstance } from 'fastify'
import { MailController } from '../controllers/mail.controller'

const mailController = new MailController()

export async function mailRoutes(app: FastifyInstance) {
  app.post('/send', mailController.sendMail)
}
