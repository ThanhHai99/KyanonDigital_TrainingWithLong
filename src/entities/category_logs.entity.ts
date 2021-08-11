import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'category_logs' })
export class Category_Log extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    category_id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column({ type: 'enum', enum: ['created', 'updated'] })
    @IsNotEmpty()
    status: string;

    @Column()
    @IsNotEmpty()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;
}
