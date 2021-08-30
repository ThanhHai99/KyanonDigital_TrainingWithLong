import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateOrder {
    @ApiProperty({
        description: 'Order',
        type: String
    })
    @IsNotEmpty()
    name: string;
}

export class BodyPayment {
    @ApiProperty({
        description: '',
        type: String
    })
    @IsOptional()
    name: string;
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

export class ResponsePayment extends ResponseCreateOrder {}
