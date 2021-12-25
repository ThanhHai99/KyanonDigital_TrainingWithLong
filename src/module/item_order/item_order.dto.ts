import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray } from 'class-validator'

export class BodyCreateItemOrder {
  @ApiProperty({
    description: 'Item list',
    type: Array
  })
  @IsArray()
  @ArrayMinSize(1)
  item: Array<number>

  @ApiProperty({
    description: 'Amount list of each product',
    type: Array
  })
  @IsArray()
  @ArrayMinSize(1)
  amount: Array<number>

  order: number
}
