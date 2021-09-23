import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateCategory {
    @ApiProperty({ description: 'Category name', type: String })
    @IsNotEmpty()
    name: string;
}

export class ResponseCreateCategory {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    data: any;
}

export class BodyUpdateCategory {
    @ApiProperty({ description: 'Category name', type: String })
    @IsOptional()
    name: string;
}

export class ResponseUpdateCategory extends ResponseCreateCategory {}

export class ResponseGetCategory extends ResponseCreateCategory {}
