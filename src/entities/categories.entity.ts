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
import { Length, IsNotEmpty } from 'class-validator';
import { Item } from './items.entity';
import { User } from './users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    @Length(11)
    id: number;

    @ApiProperty()
    @Unique(['name'])
    @Column()
    @Length(256)
    name: string;

    @ManyToOne((type) => User, (user) => user.categories)
    @JoinColumn({ name: 'created_by' })
    user: User;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany((type) => Item, (item) => item.category)
    items: Item[];
}
