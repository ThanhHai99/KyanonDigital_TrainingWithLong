import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Unique(['name'])
    @Column()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Column()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(type => User, user => user.role)
    users: User[];
}
