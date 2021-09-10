import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsIn,
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
    item_id: Array<number>;

    @ApiProperty({
        description: 'Amount of item is reduced',
        type: Number,
        default: null
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    amount: number;

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

    @ApiProperty({ description: 'Item list sale', type: Array })
    @IsOptional()
    @IsArray()
    item_id: Array<number>;

    @ApiProperty({
        description: 'Amount of item is reduced',
        type: Number,
        default: null
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty({
        description: 'Percent is reduced',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    discount: number;

    @ApiProperty({
        description: 'Sale start date',
        type: Date
    })
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

export class ResponseCreateSale {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    data: any;
}

export class ResponseGetSale extends ResponseCreateSale {}

export class ResponseUpdateSale extends ResponseCreateSale {}
