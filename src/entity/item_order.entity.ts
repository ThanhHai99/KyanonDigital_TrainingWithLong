import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity
} from 'typeorm';
import { Item } from '@entity/item.entity';
import { Order } from '@entity/order.entity';

@Entity({ name: 'item_order' })
export class ItemOrder extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @ManyToOne((type) => Item, (item) => item.itemorders)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @ManyToOne((type) => Order, (order) => order.itemorders)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    amount: number;
}
