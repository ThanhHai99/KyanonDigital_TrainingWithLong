import {
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Warehouse } from './warehouses.entity';

@Entity({ name: 'importings' })
export class Importing extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    amount: number;

    @Column()
    @IsNotEmpty()
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
