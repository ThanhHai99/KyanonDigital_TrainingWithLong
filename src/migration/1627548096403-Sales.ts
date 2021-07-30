import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sales1627548096403 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `insert into sales(id,item_id,start_date,end_date,amount,price,created_by) values(1,1,"2021-07-28 00:00:00","2021-08-28 00:00:00",5,50000,1);`
        );
        await queryRunner.query(
            `insert into sales(id,item_id,start_date,end_date,amount,price,created_by) values(2,2,"2021-08-30 00:00:00","2021-09-15 00:00:00",2,10000,3);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
