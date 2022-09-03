import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BurgerModule } from './burgers/burger.module'
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [BurgerModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
