import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { OnModuleInit } from '@nestjs/common'
import { Client, ClientKafka, Transport } from '@nestjs/microservices'
import { ApiBody } from '@nestjs/swagger'
import { Partitioners } from 'kafkajs'
import { Observable } from 'rxjs'
import { BurgerDto } from 'src/burgers/dtos/burger.dto'
import { IBurger, IburgerData } from './types/burger.interface'

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
    const requestPatters = ['find-all-burger', 'find-burger', 'mount-burger']

    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern)
      await this.client.connect()
    })
  }

  @Get()
  @ApiBody({ type: BurgerDto })
  index(): Observable<IburgerData[]> {
    return this.client.send('find-all-burger', {})
  }

  @Get(':id')
  @ApiBody({ type: BurgerDto })
  find(@Param('id') id: number): Observable<IburgerData> {
    return this.client.send('find-burger', id)
  }

  @Post()
  @ApiBody({ type: BurgerDto })
  create(@Body() mountBurger: IBurger): Observable<IBurger> {
    return this.client.send('mount-burger', mountBurger)
  }

  @Put(':id')
  @ApiBody({ type: BurgerDto })
  update(
    @Param('id') id: number,
    @Body() { additionals, breads, burgers, ingredients }: IBurger,
  ) {
    const payload = {
      breads,
      burgers,
      ingredients,
      additionals,
      id,
    }
    return this.client.emit('update-burger', payload)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.client.emit('delete-burger', id)
  }

  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.client.emit('activate-burger', id)
  }

  @Patch(':id/inactivate')
  inactivate(@Param('id') id: number) {
    return this.client.emit('inactivate-burger', id)
  }
}
