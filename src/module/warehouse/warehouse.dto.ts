import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, Min } from 'class-validator';

export class BodyImporting {
    @ApiProperty({ description: 'Expiration date of item', type: Date })
    @IsDateString()
    expiration_date: Date;

    @ApiProperty({ description: 'Amount of item', type: Number })
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty({ description: 'Price of item', type: Number })
    @IsInt()
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Item id', type: Number })
    @IsInt()
    @Min(1)
    item_id: number;
}

export class BodyExporting {
    @ApiProperty({ description: 'Item id', type: Array })
    @IsArray()
    item_id: Array<number>;

    @ApiProperty({ description: 'Amount of item', type: Array })
    @IsArray()
    amount: Array<number>;
}