import {
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { User } from '../entities/users.entity';
import { Item } from '../entities/items.entity';

@Entity({ name: 'prices' })
export class Price extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    price: number;

    @ManyToOne((type) => Item, (item) => item.prices)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column()
    @Length(6)
    start_date: Date;

    @Column()
    end_date: Date;

    @ManyToOne((type) => User, (user) => user.prices)
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
}
