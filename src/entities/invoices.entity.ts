import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Order } from './orders.entity';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Order, (order) => order.invoices)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    @Length(256)
    name: string;

    @Column()
    @Length(20)
    phone: string;

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
}
