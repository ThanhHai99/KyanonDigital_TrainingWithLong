import {
  JoinColumn,
  ManyToOne,
  BaseEntity,
  Column,
  Entity,
  OneToMany
} from 'typeorm';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Item } from '@module/item/item.entity';
import { WarehouseLog } from '@module/warehouse_log/warehouse_log.entity';

@Entity({ name: 'warehouse' })
export class Warehouse extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @ManyToOne((type) => Item, (item) => item.warehouses)
  @JoinColumn({ name: 'item_id' })
  item: Item | number;

  @Column({ type: 'timestamp' })
  expiration_date: Date;

  @Column({ default: 0 })
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

  @OneToMany((type) => WarehouseLog, (log) => log.warehouse)
  warehouse_logs: WarehouseLog[];
}
