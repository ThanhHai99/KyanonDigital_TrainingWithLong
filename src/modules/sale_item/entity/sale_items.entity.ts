import {
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Sale } from '../../sale/entity/sales.entity';

@Entity({ name: 'sale_items' })
export class SaleItem extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    item_id: number;    

    @ManyToOne((type) => Sale, (si) => si.sale_item)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

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
