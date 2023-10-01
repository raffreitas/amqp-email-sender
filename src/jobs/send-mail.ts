import { RabbitmqServer } from '@/lib/queue/rabbitmq'
import { Nodemailer } from '@/lib/mail/nodemailer'
import { env } from '@/env'
import { z } from 'zod'

const rabbitmqServer = new RabbitmqServer(env.RABBITMQ_URI)
const mail = new Nodemailer()

const mailSchema = z.object({
  content: z.string(),
  mail: z.string().email(),
  subject: z.string(),
})

export async function sendMail() {
  await rabbitmqServer.start()
  await rabbitmqServer.consume('mail', async (message, channel) => {
    const {
      content,
      mail: to,
      subject,
    } = mailSchema.parse(JSON.parse(message.content.toString()))

    try {
      await mail.sendMail({
        to,
        subject,
        content,
      })
      console.log('👌 E-mail enviado')
      channel.ack(message)
    } catch (error) {
      console.error(error)
      channel.nack(message)
    }
  })
}
