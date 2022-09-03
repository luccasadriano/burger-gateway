import { ApiProperty } from '@nestjs/swagger'

export class EmailDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string
}
