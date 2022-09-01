import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BurgerModule } from './burgers/burger.module'

@Module({
  imports: [BurgerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
