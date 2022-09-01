import { Module } from '@nestjs/common'
import { BurgerController } from './burger.controller'

@Module({
  imports: [],
  controllers: [BurgerController],
  providers: [],
})
export class BurgerModule {}
