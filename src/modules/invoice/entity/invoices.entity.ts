import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Order } from '../../order/entity/orders.entity';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @ManyToOne((type) => Order, (order) => order.invoices)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    name: string;

    @Column({ length: 20 })
    phone: string;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updated_at: Date;
}
