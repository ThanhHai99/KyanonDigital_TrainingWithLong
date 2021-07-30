import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Item } from '../entities/items.entity';
import { Order } from './orders.entity';

@Entity({ name: 'item_order' })
export class ItemOrder extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Item, (item) => item.itemorders)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @ManyToOne((type) => Order, (order) => order.itemorders)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    @IsNotEmpty()
    price: number;

    @Column()
    @IsNotEmpty()
    amount: number;
}
