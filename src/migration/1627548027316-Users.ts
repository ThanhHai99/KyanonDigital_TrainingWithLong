import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class Users1627548027316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`insert into user(id,username,password,name,phone,address,is_locked,verify_token,is_active,role_id) values (1,'hai@gmail.com','${bcrypt.hashSync('Aa@123456',8)}','Tran Viet Thanh Hai','0333771800','Tp.HCM',0,'${uuidv4()}',1,1);`);
    await queryRunner.query(`insert into user(id,username,password,name,phone,address,is_locked,verify_token,is_active,role_id) values (2,'hien@gmail.com','${bcrypt.hashSync('Aa@123456',8)}','Tran Thi Thao Hien','0333771801','Tp.HCM',0,'${uuidv4()}',1,2);`);
    await queryRunner.query(`insert into user(id,username,password,name,phone,address,is_locked,verify_token,is_active,role_id) values (3,'thao@gmail.com','${bcrypt.hashSync('Aa@123456',8)}','Tran Thi Thu Thao','0333771802','Tp.HCM',0,'${uuidv4()}',1,3);`);
    await queryRunner.query(`insert into user(id,username,password,name,phone,address,is_locked,verify_token,is_active) values (4,'sang@gmail.com','${bcrypt.hashSync('Aa@123456',8)}','Nguyen Dinh Sang','0333771803','Tp.HCM',0,'${uuidv4()}',1);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
