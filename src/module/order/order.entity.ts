import { OneToMany, BaseEntity, Column, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Invoice } from '@module/invoice/invoice.entity'
import { ItemOrder } from '@module/item_order/item_order.entity'
import { User } from '@module/user/user.entity'
import { PaymentMethodIds } from '@constant/payment/method.constant'

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @Column()
  delivery_address: string

  @Column({ type: 'enum', enum: PaymentMethodIds, default: 1 })
  payment_method: number

  @Column({ default: false })
  paid: boolean

  @Column({ default: 30000 })
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

  @ManyToOne((type) => User, (user) => user.orders)
  @JoinColumn({ name: 'created_by' })
  user: User | number

  @OneToMany((type) => ItemOrder, (item_order) => item_order.order)
  item_orders: ItemOrder[]

  @OneToMany((type) => Invoice, (invoice) => invoice.order)
  invoices: Invoice[]
}
