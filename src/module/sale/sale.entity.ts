import { SaleItem } from '@module/sale_item/sale_item.entity'
import { SaleLog } from '@module/sale_log/sale_log.entity'
import { User } from '@module/user/user.entity'
import { JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity, Column, Entity, OneToMany } from 'typeorm'

@Entity({ name: 'sale' })
export class Sale extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @Column()
  name: string

  @Column({
    type: 'date',
    default: () => '(CURRENT_DATE)'
  })
  start_date: Date

  @Column({ type: 'date', nullable: true, default: () => null })
  end_date: Date

  @Column()
  discount: number

  @Column({ default: false })
  applied: boolean

  @Column({ unique: true })
  code: string

  @ManyToOne((type) => User, (user) => user.sales)
  @JoinColumn({ name: 'created_by' })
  user: User | number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updated_at: Date

  @OneToMany((type) => SaleItem, (si) => si.sale)
  sale_items: Sale[]

  @OneToMany((type) => SaleLog, (log) => log.sale)
  sale_logs: SaleLog[]
}
