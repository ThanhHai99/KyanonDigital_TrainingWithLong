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
import { Warehouse } from '../entities/warehouses.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'importings' })
export class Importing extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

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
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne((type) => Warehouse, (warehouse) => warehouse)
    @JoinColumn({ name: 'warehouse_id' })
    warehouse: Warehouse;
}
