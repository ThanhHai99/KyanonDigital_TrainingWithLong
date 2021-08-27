import {
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity,
    OneToMany
} from 'typeorm';
import { User } from './users.entity';
import { SaleItem } from './sale_items.entity';

@Entity({ name: 'sales' })
export class Sale extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    name: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column()
    amount: number;

    @Column()
    sale: number;

    @Column({ default: false })
    applied: boolean;

    @ManyToOne((type) => User, (user) => user.sales)
    @JoinColumn({ name: 'created_by' })
    user: User;

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

    // @ManyToOne((type) => SaleItem, (si) => si.sales)
    // @JoinColumn({ name: 'sale_item_id' })
    // sale_item: SaleItem;

    @OneToMany((type) => SaleItem, (si) => si.sale)
    sale_item: Sale[];
}
