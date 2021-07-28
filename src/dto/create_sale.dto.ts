import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
    @ApiProperty({
        description: 'Account using the application',
        type: Number
    })
    item_id: number;
    
    @ApiProperty({
        description: 'Account using the application',
        type: Number
    })
    amount: number;
    
    @ApiProperty({
        description: 'Account using the application',
        type: Number
    })
    price: number;
    
    @ApiProperty({
        description: 'Account using the application',
        type: Date
    })
    start_date: Date;
    
    @ApiProperty({
        description: 'Account using the application',
        type: Date
    })
    end_date: Date;
    
    @ApiProperty({
        description: 'Account using the application',
        type: Number
    })
    created_by: number;
};
