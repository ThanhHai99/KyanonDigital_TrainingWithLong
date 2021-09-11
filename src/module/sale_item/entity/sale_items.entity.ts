import {
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Sale } from '../../sale/entity/sale.entity';

@Entity({ name: 'sale_item' })
export class SaleItem extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    item_id: number;

    @ManyToOne((type) => Sale, (si) => si.sale_item)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ nullable: true, default: null })
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
}
