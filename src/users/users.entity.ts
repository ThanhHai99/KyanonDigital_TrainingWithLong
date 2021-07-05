import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Exclude } from 'class-transformer'

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
};
