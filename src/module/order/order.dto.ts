import { PaymentMethodIds } from '@constant/payment/method.constant';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class BodyCreateOrder {
  @ApiProperty({
    description: 'Item list',
    type: Array
  })
  @IsArray()
  @ArrayMinSize(1)
  item: Array<number>;

  @ApiProperty({
    description: 'Amount list of each product',
    type: Array
  })
  @IsArray()
  @ArrayMinSize(1)
  amount: Array<number>;

  @ApiProperty({
    description: 'The delivery address',
    type: String
  })
  @IsNotEmpty()
  delivery_address: string;

  @ApiProperty({
    description: 'The payment method',
    type: String
  })
  @IsOptional()
  @IsIn(PaymentMethodIds)
  payment_method: number;
}

export class BodyPayment {
  @ApiProperty({
    description: 'The sale code',
    type: String
  })
  @IsOptional()
  sale_code: string;
}
