import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsDateString, IsInt, Min } from 'class-validator'

export class BodyImporting {
  @ApiProperty({ description: 'Expiration date of item', type: Date })
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({ strict: true }, { each: true })
  expiration_date: Array<Date>

  @ApiProperty({ description: 'Amount of item', type: Number })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  amount: Array<number>

  @ApiProperty({ description: 'Price of item', type: Number })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  price: Array<number>

  @ApiProperty({ description: 'Item id', type: Number })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  item_id: Array<number>

  user: number
}

export class BodyExporting {
  @ApiProperty({ description: 'Item id', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  item_id: Array<number>

  @ApiProperty({ description: 'Amount of item', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  amount: Array<number>
}
