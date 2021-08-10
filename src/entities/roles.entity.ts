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

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
    @Column()
    @PrimaryColumn()
    id: number;

    @Unique(['name'])
    @Column()
    @IsNotEmpty()
    name: string;

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

    @OneToMany((type) => User, (user) => user.role)
    users: User[];
}
