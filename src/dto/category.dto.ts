import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateCategory {
    @ApiProperty({
        description: 'Category name',
        type: String
    })
    @IsNotEmpty()
    name: string;
}

export class BodyUpdateCategory {
    @ApiProperty({
        description: '',
        type: String
    })
    @IsOptional()
    name: string;
}

export class ResponseGetCategory {
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

export class ResponseCreateCategory {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;
    
    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseUpdateCategory extends ResponseCreateCategory {}

