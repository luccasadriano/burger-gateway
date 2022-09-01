import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { OnModuleInit } from '@nestjs/common'
import { Client, ClientKafka, Transport } from '@nestjs/microservices'
import { ApiBody } from '@nestjs/swagger'
import { Partitioners } from 'kafkajs'
import { Observable } from 'rxjs'
import { BurgerDto } from 'src/dtos/burger.dto'
import { IBurger } from './types/burger.interface'

@Controller('burgers')
export class BurgerController implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `burger`,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'burger-consumer',
        allowAutoTopicCreation: true,
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  })
  public client: ClientKafka

  onModuleInit() {
    const requestPatters = ['find-all-burger', 'find-burger']

    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern)
      await this.client.connect()
    })
  }

  @Get()
  index(): Observable<IBurger[]> {
    return this.client.send('find-all-burger', {})
  }

  @Get(':id')
  find(@Param('id') id: number): Observable<IBurger> {
    return this.client.send('find-burger', id)
  }

  // @Post('v1')
  // @ApiBody({ type: BurgerDto })
  // create1(@Body() mountBurger: IBurger): Observable<IBurger> {
  //   return this.client.send('mount-burger', mountBurger)
  // }
  @Post()
  @ApiBody({ type: BurgerDto })
  create(@Body() mountBurger: IBurger) {
    return this.client.emit('mount-burger', mountBurger)
  }
}
