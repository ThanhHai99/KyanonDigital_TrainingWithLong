import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Sale } from '@module/sale/sale.entity';

@Entity({ name: 'sale_log' })
export class SaleLog extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column()
  sale_item: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ default: null })
  end_date: Date;

  @Column()
  amount: string;

  @Column()
  discount: number;

  @Column({ default: false })
  applied: boolean;

  @Column()
  code: string;

  @Column()
  created_by: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  created_at: Date;

  @ManyToOne((type) => Sale, (sale) => sale.sale_logs)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale | number;
}
