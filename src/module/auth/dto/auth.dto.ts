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

export class BodyLogin {
    @ApiProperty({
        description: '',
        type: String
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: '',
        type: String
    })
    @MinLength(8)
    password: string;
}

export class ResponseLogin {
    @ApiProperty({ description: '', type: Number })
    @IsIn([0, 1])
    error: number;

    @ApiProperty({ description: '', type: String })
    @IsNotEmpty()
    message: string;
}

export class BodyRegister extends BodyLogin {
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
    @IsOptional()
    @IsInt()
    @Min(0)
    role: number;
}

export class ResponseRegister extends ResponseLogin {}
