import { ApiProperty } from '@nestjs/swagger'

export class BurgerDto {
  @ApiProperty()
  breads: string

  @ApiProperty()
  burgers: string

  @ApiProperty()
  ingredients: string

  @ApiProperty()
  additionals: string
}
