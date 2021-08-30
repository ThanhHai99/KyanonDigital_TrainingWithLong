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

export class CreateUserDto {
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
        description: 'Your fullname',
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
        description: "Role' account",
        type: Number
    })
    @IsInt()
    @Min(0)
    role: number;
}

export class UpdateUserDto {
    @ApiProperty({
        description: 'Your fullname',
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

export class ResponseGetUser {
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

export class ResponseCreateUser {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class ResponseUpdateUser extends ResponseCreateUser {}

export class ResponseLockUser extends ResponseCreateUser {}
