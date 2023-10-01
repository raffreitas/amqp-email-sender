import { FastifyReply, FastifyRequest } from 'fastify'
import { RabbitmqServer } from '@/lib/queue/rabbitmq'
import { z } from 'zod'
import { env } from '@/env'

const rabbitmqServer = new RabbitmqServer(env.RABBITMQ_URI)

export class MailController {
  async sendMail(request: FastifyRequest, reply: FastifyReply) {
    const sendMailSchema = z.object({
      recipientsMail: z.array(z.string()),
      subject: z.string(),
      content: z.string(),
    })

    const { content, recipientsMail, subject } = sendMailSchema.parse(
      request.body,
    )

    await rabbitmqServer.start()

    await Promise.all(
      recipientsMail.map((mail) => {
        const mailData = JSON.stringify({ mail, content, subject })
        return rabbitmqServer.publishInQueue('mail', mailData)
      }),
    )

    return reply.send({ message: 'Emails colocados na fila de envio' })
  }
}
