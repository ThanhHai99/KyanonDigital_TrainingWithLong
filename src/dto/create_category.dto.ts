import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    id: number;

    @ApiProperty({
        description: 'Category name',
        type: String
    })
    name: string;
}
