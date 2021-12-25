import { ManyToOne, JoinColumn, BaseEntity, Column, Entity } from 'typeorm'
import { Item } from '@module/item/item.entity'
import { Order } from '@module/order/order.entity'

@Entity({ name: 'item_order' })
export class ItemOrder extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @ManyToOne((type) => Item, (item) => item.item_orders)
  @JoinColumn({ name: 'item_id' })
  item: Item | number

  @ManyToOne((type) => Order, (order) => order.item_orders)
  @JoinColumn({ name: 'order_id' })
  order: Order | number

  @Column()
  amount: number
}
