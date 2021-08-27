import {
    OneToMany,
    JoinColumn,
    ManyToOne,
    BaseEntity,
    Column,
    Entity
} from 'typeorm';
import { Item } from 'src/entities/items.entity';
import { Exporting } from 'src/entities/exportings.entity';
import { Importing } from 'src/entities/importings.entity';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @ManyToOne((type) => Item, (item) => item.warehouses)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column({ type: 'timestamp' })
    expiration_date: Date;

    @Column()
    amount: number;

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

    @OneToMany((type) => Importing, (importing) => importing.warehouse)
    importings: Importing[];

    @OneToMany((type) => Exporting, (exporting) => exporting.warehouse)
    exportings: Exporting[];
}
