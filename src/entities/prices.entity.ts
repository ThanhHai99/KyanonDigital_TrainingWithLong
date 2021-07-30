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
import { IsNotEmpty, IsEmpty } from 'class-validator';
import { User } from './users.entity';
import { Item } from './items.entity';

@Entity({ name: 'prices' })
export class Price extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    price: number;

    @ManyToOne((type) => Item, (item) => item.prices)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    start_date: Date;

    @Column({ type: 'timestamp' })
    @IsEmpty()
    end_date: Date;

    @ManyToOne((type) => User, (user) => user.prices)
    @JoinColumn({ name: 'created_by' })
    user: User;

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
}
