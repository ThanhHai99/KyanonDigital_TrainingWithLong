import { JoinColumn, ManyToOne, BaseEntity, Column, Entity } from 'typeorm';
import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Warehouse } from '@module/warehouse/warehouse.entity';

@Entity({ name: 'warehouse_log' })
export class WarehouseLog extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ type: 'enum', enum: ['+', '-'] })
  status: string;

  @Column({ default: null })
  price: number;

  @Column()
  item_id: number;

  @Column({ type: 'timestamp' })
  expiration_date: Date;

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

  @ManyToOne((type) => Warehouse, (warehouse) => warehouse.warehouse_logs)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse | number;
}
