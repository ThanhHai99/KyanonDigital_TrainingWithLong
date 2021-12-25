import { ManyToOne, JoinColumn, BaseEntity, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Order } from '@module/order/order.entity'

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @ManyToOne((type) => Order, (order) => order.invoices)
  @JoinColumn({ name: 'order_id' })
  order: Order | number

  @Column()
  name: string

  @Column({ length: 20 })
  phone: string

  @Column()
  cost: number

  @Column()
  created_by: number

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
}
