import {
    JoinColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity
} from 'typeorm';
import { User } from '@module/user/user.entity';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { Category } from '@module/category/category.entity';
import { Warehouse } from '@module/warehouse/warehouse.entity';
import { ItemLog } from '@module/item_log/item_log.entity';

@Entity({ name: 'item' })
export class Item extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne((type) => Category, (category) => category.items)
    @JoinColumn({ name: 'category_id' })
    category: Category | number;

    @Column()
    detail: string;

    @Column()
    user_manual: string;

    @Column()
    price: number;

    @ManyToOne((type) => User, (user) => user.items)
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

    @OneToMany((type) => ItemOrder, (itemorder) => itemorder.item)
    itemorders: ItemOrder[];

    @OneToMany((type) => Warehouse, (warehouse) => warehouse.item)
    warehouses: Warehouse[];

    @OneToMany((type) => ItemLog, (log) => log.item)
    item_logs: ItemLog[];
}
