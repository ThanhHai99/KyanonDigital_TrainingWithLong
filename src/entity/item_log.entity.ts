import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Item } from '@entity/item.entity';

@Entity({ name: 'item_log' })
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

    @ManyToOne((type) => Item, (item) => item.item_logs)
    @JoinColumn({ name: 'item_id' })
    item: Item;
}
