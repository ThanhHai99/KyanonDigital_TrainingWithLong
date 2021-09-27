import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class BodyCreateItem {
    @ApiProperty({
        description: 'Item name',
        type: String
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Category Id',
        type: Number
    })
    @IsInt()
    @Min(1)
    category_id: number;

    @ApiProperty({
        description: 'Item detail',
        type: String
    })
    @IsNotEmpty()
    detail: string;

    @ApiProperty({
        description: 'Item user manual',
        type: String
    })
    @IsNotEmpty()
    user_manual: string;

    @ApiProperty({
        description: 'Item price',
        type: Number
    })
    @IsInt()
    @Min(0)
    price: number;
}

export class ResponseCreateItem {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    data: any;
}

export class BodyUpdateItem {
    @ApiProperty({
        description: 'Item name',
        type: String
    })
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'Category Id',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    category_id: number;

    @ApiProperty({
        description: 'Item detail',
        type: String
    })
    @IsOptional()
    detail: string;

    @ApiProperty({
        description: 'Item user manual',
        type: String
    })
    @IsOptional()
    user_manual: string;

    @ApiProperty({
        description: 'Item price',
        type: Number
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    price: number;
}

export class ResponseGetItem extends ResponseCreateItem {}

export class ResponseUpdateItem extends ResponseCreateItem {}