import {
    JoinColumn,
    OneToMany,
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { CategoryLog } from '@module/category_log/category_log.entity';
import { Item } from '@module/item/item.entity';
import { User } from '@module/user/user.entity';
import { ItemLog } from '@module/item_log/item_log.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne((type) => User, (user) => user.categories)
    @JoinColumn({ name: 'created_by' })
    user: User | number;

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

    @OneToMany((type) => Item, (item) => item.category)
    items: Item[];

    @OneToMany((type) => CategoryLog, (log) => log.category)
    category_logs: CategoryLog[];

    @OneToMany((type) => ItemLog, (log) => log.item)
    item_logs: ItemLog[];
}
