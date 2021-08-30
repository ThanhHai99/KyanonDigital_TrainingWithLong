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
import { CategoryLog } from '../../category_log/entity/category_logs.entity';
import { Item } from '../../item/entity/items.entity';
import { User } from '../../user/entity/users.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne((type) => User, (user) => user.categories)
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

    @OneToMany((type) => Item, (item) => item.category)
    items: Item[];

    @OneToMany((type) => CategoryLog, (log) => log.category)
    category_logs: CategoryLog[];
}