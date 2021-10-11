import { ApiProperty } from '@nestjs/swagger';
import {
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

  user: number;
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

  user: number;
}
