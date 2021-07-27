import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Item } from '../entities/items.entity';
import { Order } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'item_orders' })
export class ItemOrder extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Item, (item) => item.itemorders)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @ManyToOne((type) => Order, (order) => order.itemorders)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    amount: number;
}
