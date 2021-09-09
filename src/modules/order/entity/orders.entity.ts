import {
    OneToMany,
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Invoice } from '../../invoice/entity/invoices.entity';
import { PAY } from 'src/helpers/paymentMethod';
import { ItemOrder } from '../../item_order/entity/item_order.entity';
import { User } from '../../user/entity/users.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    delivery_address: string;

    @Column({ type: 'enum', enum: PAY, default: 'COD' })
    payment_method: string;

    @Column({ default: false })
    paid: boolean;

    @Column({ default: false })
    exported: boolean;

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

    @ManyToOne((type) => User, (user) => user.orders)
    @JoinColumn({ name: 'created_by' })
    user: User;

    @OneToMany((type) => ItemOrder, (itemorder) => itemorder.order)
    itemorders: ItemOrder[];

    @OneToMany((type) => Invoice, (invoice) => invoice.order)
    invoices: Invoice[];
}
