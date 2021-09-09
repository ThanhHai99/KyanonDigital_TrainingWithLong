import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Sale } from '../../sale/entity/sales.entity';

@Entity({ name: 'sale_logs' })
export class SaleLog extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    name: string;

    @Column()
    sale_item: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    amount: number;

    @Column()
    discount: number;

    @Column()
    applied: boolean;
    
    @Column()
    code: string;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;

    @ManyToOne((type) => Sale, (sale) => sale.sale_logs)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;
}
