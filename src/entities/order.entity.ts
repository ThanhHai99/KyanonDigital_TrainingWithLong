import {
    OneToMany,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Invoice } from '../entities/invoice.entity';
import { PAY } from 'src/helpers/paymentMethod';
import { ItemOrder } from '../entities/item_order.entiy';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(256)
    delivery_address: string;

    @Column({ type: 'enum', enum: PAY })
    @IsNotEmpty()
    payment_method: string;

    @Column()
    @Length(11)
    created_by: number;

    @Column()
    @IsNotEmpty()
    @CreateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @Column()
    @IsNotEmpty()
    @UpdateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @OneToMany((type) => ItemOrder, (itemorder) => itemorder.order)
    itemorders: ItemOrder[];

    @OneToMany((type) => Invoice, (invoice) => invoice.order)
    invoices: Invoice[];
}
