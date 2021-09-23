import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ResponseCreateInvoice {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    data: any;
}

export class ResponseGetInvoice extends ResponseCreateInvoice {}
