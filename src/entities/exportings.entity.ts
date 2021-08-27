import {
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Column,
    Entity
} from 'typeorm';
import { Warehouse } from './warehouses.entity';

@Entity({ name: 'exportings' })
export class Exporting extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @ManyToOne((type) => Warehouse, (warehouse) => warehouse.exportings)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

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
}
