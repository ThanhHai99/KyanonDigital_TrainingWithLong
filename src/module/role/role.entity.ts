import { User } from '@module/user/user.entity'
import { BaseEntity, Column, Entity, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number

  @Column({ unique: true })
  name: string

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

  @OneToMany((type) => User, (user) => user.role)
  users: User[]
}
