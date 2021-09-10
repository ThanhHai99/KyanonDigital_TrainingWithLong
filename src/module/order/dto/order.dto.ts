import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateOrder {
    @ApiProperty({
        description: 'Order',
        type: Array
    })
    @IsArray()
    item: Array<number>;

    @ApiProperty({
        description: 'Order',
        type: Array
    })
    @IsArray()
    amount: Array<number>;

    @ApiProperty({
        description: 'Order',
        type: String
    })
    @IsNotEmpty()
    delivery_address: string;

    @ApiProperty({
        description: 'Order',
        type: String
    })
    @IsOptional()
    @IsIn(['COD', 'MOMO'])
    payment_method: string;
}

export class BodyPayment {
    @ApiProperty({
        description: '',
        type: String
    })
    @IsOptional()
    sale_code: string;
}

export class ResponseGetOrder {
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

export class ResponseCreateOrder {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseExport extends ResponseCreateOrder {}

export class ResponsePayment extends ResponseCreateOrder {}
