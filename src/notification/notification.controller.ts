import { Body, Controller, Post } from '@nestjs/common'
import { Client, ClientKafka, Transport } from '@nestjs/microservices'
import { ApiBody } from '@nestjs/swagger'
import { Partitioners } from 'kafkajs'
import { EmailDto } from './dtos/email.dto'
import { PhoneDto } from './dtos/phone.dto'
import { IEmail, IPhone } from './types/notification.interface'

@Controller('notification')
export class NotificationController {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `notification`,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'notification-consumer',
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  })
  public client: ClientKafka

  @Post('email')
  @ApiBody({ type: EmailDto })
  sendEmail(@Body() data: IEmail) {
    return this.client.emit('notification-email', data)
  }

  @Post('sms')
  @ApiBody({ type: PhoneDto })
  sendPhone(@Body() data: IPhone) {
    return this.client.emit('notification-sms', data)
  }
}
