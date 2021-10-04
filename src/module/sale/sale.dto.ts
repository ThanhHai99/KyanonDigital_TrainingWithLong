import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min
} from 'class-validator';

export class BodyCreateSale {
  @ApiProperty({ description: 'Sale name', type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Item list sale', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  item_id: Array<number>;

  @ApiProperty({ description: 'Amount of item is reduced', type: Array })
  @IsArray()
  @ArrayMinSize(1)
  amount: Array<number>;

  @ApiProperty({ description: 'Percent is reduced', type: Number })
  @IsInt()
  @Min(0)
  @Max(100)
  discount: number;

  @ApiProperty({ description: 'Sale start date', type: Date })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'End start date',
    type: Date,
    default: null
  })
  @IsOptional()
  @IsDateString()
  end_date: Date;

  @ApiProperty({ description: 'Sale status', type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  applied: boolean;

  @ApiProperty({ description: 'Sale code', type: String })
  @IsNotEmpty()
  code: string;
}

export class BodyUpdateSale {
  @ApiProperty({ description: 'Sale name', type: String })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Percent is reduced', type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discount: number;

  @ApiProperty({ description: 'Sale start date', type: Date })
  @IsOptional()
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'Sale end date',
    type: Date,
    default: null
  })
  @IsOptional()
  @IsDateString()
  end_date: Date;

  @ApiProperty({ description: 'Sale status', type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  applied: boolean;

  @ApiProperty({ description: 'Sale code', type: String })
  @IsOptional()
  code: string;
}
