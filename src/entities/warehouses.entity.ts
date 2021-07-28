import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/entities/items.entity';
import { Exporting } from 'src/entities/exporting.entity';
import { Importing } from 'src/entities/importing.entity';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Item, (item) => item.warehouses)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    expiration_date: Date;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @OneToMany((type) => Importing, (importing) => importing.warehouse)
    importings: Importing[];

    @OneToMany((type) => Exporting, (exporting) => exporting.warehouse)
    exportings: Exporting[];
}
