import {
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { User } from './users.entity';
import { Item } from './items.entity';

@Entity({ name: 'sales' })
export class Sale extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(11)
    item_id: number;

    @Column()
    @IsNotEmpty()
    @CreateDateColumn()
    start_date: Date;

    @Column()
    @IsNotEmpty()
    @CreateDateColumn()
    end_date: Date;

    @Column()
    @IsNotEmpty()
    amount: number;

    @Column()
    @IsNotEmpty()
    price: number;

    @ManyToOne((type) => User, (user) => user.sales)
    @JoinColumn({ name: 'created_by' })
    user: User;

    @Column()
    @IsNotEmpty()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @IsNotEmpty()
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne((type) => Item, (item) => item.sales)
    @JoinColumn({ name: 'item_id' })
    item: Item;
}
