import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPhoneNumber, Min, MinLength } from 'class-validator';

export class UserDto {
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
