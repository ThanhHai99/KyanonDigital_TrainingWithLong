import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemOrder } from './item_order.entity';
import { ItemOrderService } from '@module/item_order/item_order.service';

@Module({
    imports: [TypeOrmModule.forFeature([ItemOrder])],
    providers: [ItemOrderService],
    exports: [TypeOrmModule.forFeature([ItemOrder]), ItemOrderService]
})
export class ItemOrderModule {}
