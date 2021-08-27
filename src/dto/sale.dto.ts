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
    @ApiProperty({
        description: '',
        type: String
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: '',
        type: Array
    })
    @IsArray()
    item_id: Array<number>;

    @ApiProperty({
        description: '',
        type: Number
    })
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty({
        description: '',
        type: Number
    })
    @IsInt()
    @Min(0)
    @Max(100)
    sale: number;

    @ApiProperty({
        description: '',
        type: Date
    })
    @IsDateString()
    start_date: Date;

    @ApiProperty({
        description: '',
        type: Date
    })
    @IsDateString()
    end_date: Date;

    @ApiProperty({ description: '', type: Boolean, default: false })
    @IsOptional()
    @IsBoolean()
    applied: boolean;
}

export class BodyUpdateSale {
    @ApiProperty({
        description: '',
        type: String
    })
    @IsOptional()
    name: string;

    @ApiProperty({
        description: '',
        type: Array
    })
    @IsOptional()
    @IsArray()
    item_id: Array<number>;

    @ApiProperty({
        description: '',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty({
        description: '',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    sale: number;

    @ApiProperty({
        description: '',
        type: Date
    })
    @IsOptional()
    @IsDateString()
    start_date: Date;

    @ApiProperty({
        description: '',
        type: Date
    })
    @IsOptional()
    @IsDateString()
    end_date: Date;

    @ApiProperty({ description: '', type: Boolean, default: false })
    @IsOptional()
    @IsBoolean()
    applied: boolean;
}

export class ResponseCreateSale {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseUpdateSale extends ResponseCreateSale {}
