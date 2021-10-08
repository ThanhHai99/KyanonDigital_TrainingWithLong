import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Category } from '@module/category/category.entity';
import { Sale } from '@module/sale/sale.entity';
import { Item } from '@module/item/item.entity';
import { Order } from '@module/order/order.entity';
import { Role } from '@module/role/role.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: false })
  is_active: boolean;

  @Column()
  verify_token: string;

  @ManyToOne((type) => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role | number;

  @Column({ default: false })
  is_locked: boolean;

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

  @OneToMany((type) => Category, (category) => category.user)
  categories: Category[];

  @OneToMany((type) => Sale, (sale) => sale.user)
  sales: Sale[];

  @OneToMany((type) => Order, (order) => order.user)
  orders: Order[];

  @OneToMany((type) => Item, (item) => item.user)
  items: Item[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  isPasswordValid(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
