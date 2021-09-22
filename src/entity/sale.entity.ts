import { SaleItem } from '@entity/sale_items.entity';
import { SaleLog } from '@entity/sale_log.entity';
import { User } from '@entity/user.entity';
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

@Entity({ name: 'sale' })
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

    @Column({ type: 'timestamp', nullable: true, default: null })
    end_date: Date;

    @Column()
    discount: number;

    @Column({ default: false })
    applied: boolean;

    @Column()
    code: string;

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

    @OneToMany((type) => SaleItem, (si) => si.sale)
    sale_item: Sale[];

    @OneToMany((type) => SaleLog, (log) => log.sale)
    sale_logs: SaleLog[];
}
