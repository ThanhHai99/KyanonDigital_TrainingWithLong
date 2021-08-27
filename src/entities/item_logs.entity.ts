import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn
} from 'typeorm';

@Entity({ name: 'item_logs' })
export class ItemLog extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    item_id: number;

    @Column()
    name: string;

    @Column()
    category_id: number;

    @Column()
    detail: string;

    @Column()
    user_manual: string;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;
}
