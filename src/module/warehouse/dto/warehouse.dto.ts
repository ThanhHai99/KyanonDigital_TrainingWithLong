import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    Min
} from 'class-validator';

export class BodyImporting {
    @ApiProperty({ description: '', type: Date })
    @IsDateString()
    expiration_date: Date;
    
    @ApiProperty({ description: '', type: Number })
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty({ description: '', type: Number })
    @IsInt()
    @Min(0)
    price: number;
    
    @ApiProperty({ description: '', type: Number })
    @IsInt()
    @Min(1)
    item_id: number;
}

export class BodyExporting {
    @ApiProperty({ description: '', type: Array })
    @IsArray()
    item_id: Array<number>;

    @ApiProperty({ description: '', type: Array })
    @IsArray()
    amount: Array<number>;
}

export class ResponseGetWarehouse {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;
    
    @ApiProperty({ description: '', type: String })
    @IsOptional()
    message: string;

    @ApiProperty({ description: '' })
    @IsOptional()
    data: any;
}

export class ResponseImporting {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseExporting extends ResponseImporting {}
