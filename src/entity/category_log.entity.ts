import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Category } from '@entity/category.entity';

@Entity({ name: 'category_log' })
export class CategoryLog extends BaseEntity {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    category_id: number;

    @Column()
    name: string;

    @Column()
    created_by: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    created_at: Date;

    @ManyToOne((type) => Category, (category) => category.category_logs)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
