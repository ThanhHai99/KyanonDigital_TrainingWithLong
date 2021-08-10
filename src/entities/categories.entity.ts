import {
    JoinColumn,
    OneToMany,
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Item } from './items.entity';
import { User } from './users.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Unique(['name'])
    @Column()
    @IsNotEmpty()
    name: string;

    @ManyToOne((type) => User, (user) => user.categories)
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

    @OneToMany((type) => Item, (item) => item.category)
    items: Item[];
}
