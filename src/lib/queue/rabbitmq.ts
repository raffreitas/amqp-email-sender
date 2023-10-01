/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Channel, Connection, Message, connect } from 'amqplib'

export class RabbitmqServer {
  // @ts-ignore
  private conn: Connection
  // @ts-ignore
  private channel: Channel

  constructor(private uri: string) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri)
    this.channel = await this.conn.createChannel()
  }

  async publishInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message))
  }

  async consume(
    queue: string,
    callback: (message: Message, channel: Channel) => void,
  ) {
    return this.channel.consume(queue, (message) => {
      if (message) {
        callback(message, this.channel)
      }
    })
  }
}
