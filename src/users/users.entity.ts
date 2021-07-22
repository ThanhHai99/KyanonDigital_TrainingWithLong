import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    @Length(11)
    id: number;

    @Unique(['username'])
    @Column()
    @Length(256)
    @IsNotEmpty()
    username: string;

    @Exclude()
    @Column()
    @Length(256)
    @IsNotEmpty()
    password: string;

    @Column()
    @Length(256)
    @IsNotEmpty()
    name: string;

    @Column()
    @Length(20)
    @IsNotEmpty()
    phone: string;

    @Column()
    @Length(256)
    @IsNotEmpty()
    address: string;

    // @Column({ type: 'enum', enum: ROLE, default: null })
    // role: string;

    @Column({ type: 'boolean', default: false })
    is_locked: boolean;

    @Column()
    @IsNotEmpty()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    @IsNotEmpty()
    updated_at: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
