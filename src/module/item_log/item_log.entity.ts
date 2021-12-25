import { BaseEntity, Column, Entity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Item } from '@module/item/item.entity'
import { Category } from '@module/category/category.entity'

@Entity({ name: 'item_log' })
export class ItemLog extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @Column()
  name: string

  @Column()
  detail: string

  @Column()
  user_manual: string

  @Column()
  created_by: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  created_at: Date

  @ManyToOne((type) => Item, (item) => item.item_logs)
  @JoinColumn({ name: 'item_id' })
  item: Item | number

  @ManyToOne((type) => Category, (category) => category.item_logs)
  @JoinColumn({ name: 'category_id' })
  category: Category | number
}
