import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/entities/roles.entity';

export class CreateUserDto {
    id: number;
    
    @ApiProperty({
        description: 'Account using the application',
        type: String
    })
    username: string;

    @ApiProperty({
        description: 'Password used to login the application',
        type: String
    })
    password: string;

    @ApiProperty({
        description: 'Your fullname',
        type: String
    })
    name: string;

    @ApiProperty({
        description: 'Your phone',
        type: String
    })
    phone: string;

    @ApiProperty({
        description: 'Your address',
        type: String
    })
    address: string;

    @ApiProperty({
        type: () => Role
    })
    role: Role;
}
