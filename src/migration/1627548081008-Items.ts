import { MigrationInterface, QueryRunner } from 'typeorm';

export class Items1627548081008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into item(id,name,detail,user_manual,price,category_id,created_by) values (1,'rau salas','detail1','user manual 1',1000,1,1);`
        );
        await queryRunner.query(
            `insert into item(id,name,detail,user_manual,price,category_id,created_by) values (2,'rau muong','detail2','user manual 2',1500,1,1);`
        );
        await queryRunner.query(
            `insert into item(id,name,detail,user_manual,price,category_id,created_by) values (3,'xoai cat','detail3','user manual 3',3000,2,1);`
        );
        await queryRunner.query(
            `insert into item(id,name,detail,user_manual,price,category_id,created_by) values (4,'chom chom','detail4','user manual 4',2000,2,1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
