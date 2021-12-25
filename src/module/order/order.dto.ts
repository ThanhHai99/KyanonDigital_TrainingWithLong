import { PaymentMethodIds } from '@constant/payment/method.constant'
import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator'

export class BodyCreateOrder {
  @ApiProperty({
    description: 'The delivery address',
    type: String
  })
  @IsNotEmpty()
  delivery_address: string

  @ApiProperty({
    description: 'The payment method',
    type: String
  })
  @IsOptional()
  @IsIn(PaymentMethodIds)
  payment_method: number

  paid: boolean

  cost: number

  created_by: number
}

export class BodyPayment {
  @ApiProperty({
    description: 'The sale code',
    type: String
  })
  @IsOptional()
  sale_code: string

  user: number
}
