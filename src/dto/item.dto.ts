import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ItemDto {
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
    @Min(0)
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
