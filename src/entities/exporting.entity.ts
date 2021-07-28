import {
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Warehouse } from '../entities/warehouses.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'exportings' })
export class Exporting extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Warehouse, (warehouse) => warehouse.exportings)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    created_by: number;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @CreateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @UpdateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}
