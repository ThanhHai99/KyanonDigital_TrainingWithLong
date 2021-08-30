import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
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

export class UpdateItemDto {
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

export class ResponseGetItem {
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

export class ResponseCreateItem {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;
    
    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseUpdateItem extends ResponseCreateItem {}
