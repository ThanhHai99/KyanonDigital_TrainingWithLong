import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateOrder {
    @ApiProperty({
        description: 'Item list',
        type: Array
    })
    @IsArray()
    item: Array<number>;

    @ApiProperty({
        description: 'Amount list of each product',
        type: Array
    })
    @IsArray()
    amount: Array<number>;

    @ApiProperty({
        description: 'The delivery address',
        type: String
    })
    @IsNotEmpty()
    delivery_address: string;

    @ApiProperty({
        description: 'The payment method',
        type: String
    })
    @IsOptional()
    @IsIn(['COD', 'MOMO'])
    payment_method: string;
}

export class BodyPayment {
    @ApiProperty({
        description: 'The sale code',
        type: String
    })
    @IsOptional()
    sale_code: string;
}

export class ResponseGetOrder {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    @IsOptional()
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    @IsOptional()
    data: any;
}

export class ResponseCreateOrder extends ResponseGetOrder {}

export class ResponseExport extends ResponseCreateOrder {}

export class ResponsePayment extends ResponseCreateOrder {}
