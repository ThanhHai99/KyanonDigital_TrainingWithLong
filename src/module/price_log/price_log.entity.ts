import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn
} from 'typeorm';

@Entity({ name: 'price_log' })
export class PriceLog extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    item_id: number;

    @Column()
    price: number;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;
}
