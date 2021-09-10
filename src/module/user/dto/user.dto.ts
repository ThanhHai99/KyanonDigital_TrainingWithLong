import { ApiProperty } from '@nestjs/swagger';
import {
    IsIn,
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
        description: 'Role of account',
        type: Number
    })
    @IsInt()
    @Min(0)
    role: number;
}

export class UpdateUserDto {
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
}

export class ResponseCreateUser {
    @ApiProperty({ description: 'Error status', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: 'Message is returned', type: String })
    message: string;

    @ApiProperty({ description: 'Data is returned' })
    data: any;
}

export class ResponseGetUser extends ResponseCreateUser {}

export class ResponseUpdateUser extends ResponseCreateUser {}

export class ResponseLockUser extends ResponseCreateUser {}
