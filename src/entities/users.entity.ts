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
import { IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';
import { Role } from 'src/entities/roles.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @ApiProperty()
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Unique(['username'])
    @Column()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @Column()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @Column()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty()
    @Column()
    @IsNotEmpty()
    address: string;

    @ManyToOne((type) => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ApiProperty()
    @Column({ default: false })
    is_locked: boolean;

    @ApiProperty()
    @Column()
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty()
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
