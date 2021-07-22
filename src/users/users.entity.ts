import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Unique(['username'])
    @Column()
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    name: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
