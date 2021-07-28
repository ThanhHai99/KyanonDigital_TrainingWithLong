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
    start_date: Date;

    @Column()
    @IsNotEmpty()
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
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;

    @Column()
    @IsNotEmpty()
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)'
    })
    updated_at: Date;

    @ManyToOne((type) => Item, (item) => item.sales)
    @JoinColumn({ name: 'item_id' })
    item: Item;
}
