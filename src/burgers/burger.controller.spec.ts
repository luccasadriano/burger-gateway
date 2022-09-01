import { Test, TestingModule } from '@nestjs/testing'
import { BurgerController } from './burger.controller'

describe('AppController', () => {
  let burgerController: BurgerController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BurgerController],
      providers: [],
    }).compile()

    burgerController = app.get<BurgerController>(BurgerController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(burgerController.index()).toBe('Hello World!')
    })
  })
})
