import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ResponseGetLog {
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
