import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';

export class BodyCreateSaleItem {
  @ApiProperty({ description: 'Item list sale', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  item_id: Array<number>;

  @ApiProperty({ description: 'Amount of item is reduced', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  amount: Array<number>;

  sale: number;
}
