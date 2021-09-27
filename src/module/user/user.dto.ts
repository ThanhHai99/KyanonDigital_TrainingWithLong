import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Min,
  MinLength
} from 'class-validator';

export class BodyCreateUser {
  @ApiProperty({
    description: 'Account using the application',
    type: String
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password used to login the application',
    type: String
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Your name',
    type: String
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Your phone',
    type: String
  })
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({
    description: 'Your address',
    type: String
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Your account status',
    type: Boolean
  })
  @IsOptional()
  is_locked: boolean;

  @ApiProperty({
    description: 'Role of account',
    type: Number
  })
  @IsInt()
  @Min(0)
  role_id: number;
}

export class BodyUpdateUser {
  @ApiProperty({
    description: 'Password used to login the application',
    type: String
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Your name',
    type: String
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Your phone',
    type: String
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({
    description: 'Your address',
    type: String
  })
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Your account status',
    type: Boolean
  })
  @IsOptional()
  is_locked: boolean;

  @ApiProperty({
    description: 'Role of account',
    type: Number
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  role_id: number;
}