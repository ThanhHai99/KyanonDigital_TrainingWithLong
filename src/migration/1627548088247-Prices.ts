import { MigrationInterface, QueryRunner } from 'typeorm';

export class Prices1627548088247 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(1,1000,"2021-07-30 00:00:00","2021-08-31 00:00:00",1,1);`
        );
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(2,1200,"2021-06-01 00:00:00","2021-09-01 00:00:00",2,1);`
        );
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(3,1300,"2021-04-01 00:00:00","2021-10-01 00:00:00",3,1);`
        );
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(4,1400,"2021-05-01 00:00:00","2021-11-01 00:00:00",4,1);`
        );
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(5,2100,"2021-09-01 00:00:00","2021-09-30 00:00:00",1,1);`
        );
        await queryRunner.query(
            `insert into prices(id,price,start_date,end_date,item_id,created_by) values(6,2200,"2021-10-01 00:00:00","2021-11-01 00:00:00",1,1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
