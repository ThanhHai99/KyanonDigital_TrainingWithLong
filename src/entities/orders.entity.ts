import {
    OneToMany,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Invoice } from './invoices.entity';
import { PAY } from 'src/helpers/paymentMethod';
import { ItemOrder } from './item_order.entiy';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(256)
    delivery_address: string;

    @Column({ type: 'enum', enum: PAY, default: 'COD' })
    payment_method: string;

    @Column()
    @IsNotEmpty()
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

    @OneToMany((type) => ItemOrder, (itemorder) => itemorder.order)
    itemorders: ItemOrder[];

    @OneToMany((type) => Invoice, (invoice) => invoice.order)
    invoices: Invoice[];
}
