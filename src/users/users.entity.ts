import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
    IsNotEmpty,
    MinLength,
    IsPhoneNumber,
} from 'class-validator';
import { Role } from 'src/roles/roles.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Unique(['username'])
    @Column()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(8)
    password: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsPhoneNumber('VN')
    phone: string;

    @Column()
    @IsNotEmpty()
    address: string;

    @ManyToOne(type => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ default: false })
    is_locked: boolean;

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
