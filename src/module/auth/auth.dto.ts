import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator'

export class BodyLogin {
  @ApiProperty({ description: 'Your email', type: String })
  @IsNotEmpty()
  @IsEmail()
  username: string

  @ApiProperty({ description: 'Your password', type: String })
  @MinLength(8)
  password: string
}

export class BodyRegister extends BodyLogin {
  @ApiProperty({ description: 'Your name', type: String })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Your phone', type: String })
  @IsPhoneNumber('VN')
  phone: string

  @ApiProperty({ description: 'Your address', type: String })
  @IsNotEmpty()
  address: string

  verify_token: string
}
