import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from 'src/modules/order/controller/orders.controller';
import { Order } from 'src/modules/order/entity/orders.entity';
import { OrderService } from 'src/modules/order/service/orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrdersModule {}
