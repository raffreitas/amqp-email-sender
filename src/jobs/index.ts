import { sendMail } from './send-mail'

export async function startAllJobs() {
  await sendMail()
}
