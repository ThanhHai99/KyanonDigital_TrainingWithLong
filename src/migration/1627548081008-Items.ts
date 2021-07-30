import { MigrationInterface, QueryRunner } from 'typeorm';

export class Items1627548081008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into items(id,name,details,user_manual,category_id,created_by) values (1,'hat1','detail1','user manual 1',1,1);`
        );
        await queryRunner.query(
            `insert into items(id,name,details,user_manual,category_id,created_by) values (2,'hat2','detail2','user manual 2',1,1);`
        );
        await queryRunner.query(
            `insert into items(id,name,details,user_manual,category_id,created_by) values (3,'shirt1','detail3','user manual 3',2,1);`
        );
        await queryRunner.query(
            `insert into items(id,name,details,user_manual,category_id,created_by) values (4,'shirt2','detail4','user manual 4',2,1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
