import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Sale } from '@module/sale/sale.entity';
import { Item } from '@module/item/item.entity';

@Entity({ name: 'sale_item' })
export class SaleItem extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @ManyToOne((type) => Item, (item) => item.sale_items)
  @JoinColumn({ name: 'item_id' })
  item: Item | number;

  @ManyToOne((type) => Sale, (si) => si.sale_items)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale | number;

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
