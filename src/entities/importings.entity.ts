import {
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity
} from 'typeorm';
import { Warehouse } from './warehouses.entity';

@Entity({ name: 'importings' })
export class Importing extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    amount: number;

    @Column()
    created_by: number;

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

    @ManyToOne((type) => Warehouse, (warehouse) => warehouse)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;
}
