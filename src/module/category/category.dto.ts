import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class BodyCreateCategory {
  @ApiProperty({ description: 'Category name', type: String })
  @IsNotEmpty()
  name: string;

  user: number;
}

export class BodyUpdateCategory {
  @ApiProperty({ description: 'Category name', type: String })
  @IsOptional()
  name: string;

  user: number;
}
