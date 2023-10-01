import nodemailer, { Transporter } from 'nodemailer'
import mailConfig from '@/config/mail'

interface MailData {
  to: string
  subject: string
  content: string
}

export class Nodemailer {
  private transporter: Transporter
  private sender = 'rabbitmq@queue.com.br'

  constructor() {
    this.transporter = nodemailer.createTransport({ ...mailConfig })
  }

  sendMail({ to, subject, content }: MailData) {
    return this.transporter.sendMail({
      from: this.sender,
      to,
      subject,
      html: content,
    })
  }
}
