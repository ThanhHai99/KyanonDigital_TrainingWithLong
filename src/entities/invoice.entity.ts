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
import { Length, IsNotEmpty } from 'class-validator';
import { Order } from '../entities/order.entity';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
    @Column()
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
}
