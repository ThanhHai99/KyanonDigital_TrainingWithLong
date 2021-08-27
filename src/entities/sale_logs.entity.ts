import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn
} from 'typeorm';

@Entity({ name: 'sale_logs' })
export class SaleLog extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    name: string;

    @Column()
    sale_id: number;

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
    sale: number;

    @Column()
    applied: boolean;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;
}
